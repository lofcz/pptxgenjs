"""High-fidelity text extraction of [MS-PPTX] PDF -> ./standards/pptx/

Strategy:
- PyMuPDF layout-preserving text per page (keeps table/column geometry).
- Strip the fixed Open Specs running header (top band) and footer (bottom band).
- Parse the Table of Contents for section start pages (top-level 1..N plus 2.x namespaces).
- Merge tiny adjacent runs so parts stay useful-sized.
- Emit:
    standards/pptx/_index.md           -> manifest of chunks with page ranges + sizes
    standards/pptx/mspptx-full.txt     -> single cleaned full text (with page markers)
    standards/pptx/part-XX_<name>.txt  -> per-part cleaned text
"""
import os
import re
import pymupdf

SRC = 'pptx_standard.pdf'
OUT = os.path.join('standards', 'pptx')

os.makedirs(OUT, exist_ok=True)
doc = pymupdf.open(SRC)
N = doc.page_count

# Open Specs header/footer bands (letter page, Word-generated)
HEADER_Y = 90.0
FOOTER_Y_OFFSET = 50.0

# Residual page label / copyright crumbs that sometimes leak past clipping
NOISE = re.compile(
    r'^(?:'
    r'\d+\s*/\s*\d+'                            # "12 / 170"
    r'|\[MS-PPTX\].*'                           # title line that leaked
    r'|PowerPoint \(\.pptx\) Extensions.*'
    r'|Copyright\b.*'
    r'|Release:.*'
    r')$',
    re.I,
)


def clean_page(page):
    """Return layout-preserved text minus header/footer for one page."""
    pr = page.rect
    clip = pymupdf.Rect(0, HEADER_Y, pr.width, pr.height - FOOTER_Y_OFFSET)
    txt = page.get_text('text', clip=clip, sort=True)
    lines = txt.split('\n')

    out = []
    for ln in lines:
        s = ln.rstrip()
        if not s.strip():
            out.append('')
            continue
        if NOISE.match(s.strip()):
            continue
        out.append(s)

    # collapse >2 consecutive blank lines
    res = []
    blank = 0
    for ln in out:
        if ln.strip() == '':
            blank += 1
            if blank <= 2:
                res.append('')
        else:
            blank = 0
            res.append(ln)
    return '\n'.join(res).strip('\n')


def slug(label):
    s = re.sub(r'https?://', '', label)
    s = re.sub(r'[^A-Za-z0-9]+', '-', s).strip('-').lower()
    return s[:70] or 'part'


# --- extract all pages ---------------------------------------------------------
pages_text = []
for i in range(N):
    pages_text.append(clean_page(doc[i]))
    if (i + 1) % 50 == 0:
        print(f'  extracted {i+1}/{N}', flush=True)

# --- full text with page markers ----------------------------------------------
full_parts = []
for i, t in enumerate(pages_text):
    full_parts.append(f'\n===== [page {i+1}] =====\n{t}\n')
full = ''.join(full_parts)
with open(os.path.join(OUT, 'mspptx-full.txt'), 'w', encoding='utf-8') as f:
    f.write(full)

# --- parse TOC for section boundaries -----------------------------------------
# TOC lives early in the doc (before section 1 body). Collect text from pages
# that look like TOC (contain "Table of Contents" or dotted leaders + page nums).
toc_pages = []
for i, t in enumerate(pages_text[:20]):
    if 'Table of Contents' in t or re.search(r'\.{5,}\s*\d+\s*$', t, re.M):
        toc_pages.append(t)
toc = '\n'.join(toc_pages)

# Match (TOC lines are often indented; some wrap so page# is optional here):
#   "1  Introduction ..... 12"
#   "  2.3  http://schemas... ..... 27"
#   "5  Appendix A: Full XML Schemas ..... 142"
toc_re = re.compile(
    r'^\s*(?P<num>\d+(?:\.\d+)*)\s+'
    r'(?P<title>.+?)'
    r'(?:\s*\.{3,}\s*(?P<page>\d+))?\s*$',
    re.M,
)

# Prefer top-level sections + section-2 second-level (2.1, 2.2, ...), skip deeper.
wanted = []
pending_label = None  # waiting for a lone page number on the next line
for raw in toc.splitlines():
    m = toc_re.match(raw)
    if not m:
        if pending_label:
            pm = re.match(r'^\s*\.*\s*(\d+)\s*$', raw)
            if pm:
                wanted.append((int(pm.group(1)), pending_label))
                pending_label = None
        continue

    num = m.group('num')
    title = re.sub(r'\s+', ' ', m.group('title')).strip(' .')
    page_s = m.group('page')
    depth = num.count('.')

    if depth == 0:
        label = f'{num} {title}'
    elif depth == 1 and num.startswith('2.'):
        if title.startswith('http'):
            # http://schemas.microsoft.com/office/powerpoint/2010/main
            # -> powerpoint/2010/main
            short = re.sub(
                r'^https?://schemas\.microsoft\.com/office/', '', title
            ).strip('/')
            label = f'{num} {short}'
        else:
            label = f'{num} {title}'
    else:
        pending_label = None
        continue

    if page_s:
        wanted.append((int(page_s), label))
        pending_label = None
    else:
        pending_label = label

# Deduplicate by page: prefer more-specific 2.x labels over bare "2 Structures"
by_page = {}
for page, label in wanted:
    prev = by_page.get(page)
    if prev is None:
        by_page[page] = label
    elif prev.startswith('2 ') and not label.startswith('2 '):
        by_page[page] = label
starts = sorted(by_page.items())  # (page_1based, label)

# Front matter = everything before first TOC body section
if starts and starts[0][0] > 1:
    starts = [(1, 'Front Matter')] + starts

# Build runs [start0, end0, label]
runs = []
for i, (p, label) in enumerate(starts):
    s = p - 1  # 0-based
    if i + 1 < len(starts):
        e = starts[i + 1][0] - 2  # page before next section start
    else:
        e = N - 1
    if e < s:
        e = s
    runs.append([s, e, label])

# Merge single-page runs into previous (keep 2+ page parts distinct)
merged = []
for r in runs:
    span = r[1] - r[0] + 1
    if span < 2 and merged:
        merged[-1][1] = r[1]
        if ' (+more)' not in merged[-1][2]:
            merged[-1][2] = f"{merged[-1][2]} (+more)"
    else:
        merged.append(r)

# --- write per-part files ------------------------------------------------------
index = []
for n, (s, e, label) in enumerate(merged, 1):
    body = '\n'.join(pages_text[s:e + 1])
    fname = f'part-{n:02d}_{slug(label)}.txt'
    with open(os.path.join(OUT, fname), 'w', encoding='utf-8') as f:
        f.write(f'<!-- {label} | pages {s+1}-{e+1} of {N} -->\n\n')
        f.write(body)
    index.append({
        'file': fname,
        'label': label,
        'page_start': s + 1,
        'page_end': e + 1,
        'chars': len(body),
    })

# --- manifest ------------------------------------------------------------------
with open(os.path.join(OUT, '_index.md'), 'w', encoding='utf-8') as f:
    f.write('# [MS-PPTX] PowerPoint (.pptx) Extensions — extracted text index\n\n')
    f.write(f'Source: {SRC} | {N} pages | high-fidelity layout text\n\n')
    f.write('Full single file: `mspptx-full.txt`\n\n')
    f.write('| # | file | part | pages | chars |\n|---|------|------|-------|-------|\n')
    for it in index:
        f.write(
            f"| {it['file'].split('_')[0]} | `{it['file']}` | {it['label']} | "
            f"{it['page_start']}-{it['page_end']} | {it['chars']} |\n"
        )

print(f'\nDONE: {N} pages -> {len(index)} part files + full text in ./{OUT}/')
for it in index:
    print(
        f"  {it['file']:56s} p{it['page_start']}-{it['page_end']:3d}  "
        f"{it['chars']:>7d}  {it['label']}"
    )
