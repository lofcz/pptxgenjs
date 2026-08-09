"""High-fidelity text extraction of ECMA-376 (Office Open XML) PDF -> ./standards/ecma/

Strategy:
- PyMuPDF layout-preserving text per page (keeps table/column geometry).
- Strip running headers (top band) and footers (bottom band) per page.
- Drop the standalone "line-number" gutter digits (1,2,3...) that pdfeTeX emits per line.
- Detect the natural part boundaries from the running headers to split into per-part files.
- Emit:
    standards/ecma/_index.md            -> manifest of chunks with page ranges + sizes
    standards/ecma/ecma376-full.txt     -> single cleaned full text (with page markers)
    standards/ecma/part-XX_<name>.txt   -> per-part cleaned text
"""
import os
import re
import json
import pymupdf

SRC = 'ECMA-376-new-merged.pdf'
OUT = os.path.join('standards', 'ecma')

os.makedirs(OUT, exist_ok=True)
doc = pymupdf.open(SRC)
N = doc.page_count

# --- collect running-header candidates (top band) across a sample -------------
from collections import Counter
top_c = Counter()
for i in range(0, N, 20):
    page = doc[i]
    for b in page.get_text('dict')['blocks']:
        if b['type'] != 0:
            continue
        for line in b['lines']:
            if line['bbox'][1] < 60:
                t = ''.join(s['text'] for s in line['spans']).strip()
                if t:
                    top_c[t] += 1
HEADERS = {t for t, c in top_c.items() if c >= 3}

# --- helpers ------------------------------------------------------------------
def clean_page(page):
    """Return layout-preserved text minus header/footer/gutter for one page."""
    pr = page.rect
    keep_top = 60.0
    keep_bottom = pr.height - 45.0

    # gather qualifying text lines as (x0, y0, text) using layout mode on clipped rect
    clip = pymupdf.Rect(0, keep_top, pr.width, keep_bottom)
    txt = page.get_text('text', clip=clip, sort=True)
    lines = txt.split('\n')

    out = []
    gutter_only = re.compile(r'^\s*\d{1,2}\s*$')
    for ln in lines:
        s = ln.rstrip()
        if not s.strip():
            out.append('')
            continue
        # drop standalone gutter line-numbers (1-99) that pdfeTeX puts in the margin
        if gutter_only.match(s):
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


def running_header(page):
    """Best-effort running-header label for part detection."""
    for b in page.get_text('dict')['blocks']:
        if b['type'] != 0:
            continue
        for line in b['lines']:
            if line['bbox'][1] < 60:
                t = ''.join(s['text'] for s in line['spans']).strip()
                if t in HEADERS:
                    return t
    return None


# --- extract all pages ---------------------------------------------------------
pages_text = []
page_header = []
for i in range(N):
    page = doc[i]
    pages_text.append(clean_page(page))
    page_header.append(running_header(page))
    if (i + 1) % 500 == 0:
        print(f'  extracted {i+1}/{N}', flush=True)

# --- full text with page markers ----------------------------------------------
full_parts = []
for i, t in enumerate(pages_text):
    full_parts.append(f'\n===== [page {i+1}] =====\n{t}\n')
full = ''.join(full_parts)
with open(os.path.join(OUT, 'ecma376-full.txt'), 'w', encoding='utf-8') as f:
    f.write(full)

# --- part boundary detection from running-header changes -----------------------
# Smooth headers (fill None with previous), then split when header label changes.
smoothed = []
last = 'Front Matter'
for h in page_header:
    if h:
        last = h
    smoothed.append(last)

# Build contiguous runs (start_page, end_page, label) but merge tiny runs into next.
runs = []
start = 0
for i in range(1, N):
    if smoothed[i] != smoothed[i - 1]:
        runs.append([start, i - 1, smoothed[i - 1]])
        start = i
runs.append([start, N - 1, smoothed[N - 1]])

merged = []
for r in runs:
    span = r[1] - r[0] + 1
    if span < 8 and merged:  # too small to be a real part -> attach to previous
        merged[-1][1] = r[1]
    else:
        merged.append(r)

# --- write per-part files ------------------------------------------------------
def slug(label):
    s = re.sub(r'[^A-Za-z0-9]+', '-', label).strip('-').lower()
    return s[:60] or 'part'

index = []
for n, (s, e, label) in enumerate(merged, 1):
    body = '\n'.join(pages_text[s:e + 1])
    fname = f'part-{n:02d}_{slug(label)}.txt'
    with open(os.path.join(OUT, fname), 'w', encoding='utf-8') as f:
        f.write(f'<!-- {label} | pages {s+1}-{e+1} of {N} -->\n\n')
        f.write(body)
    index.append({'file': fname, 'label': label, 'page_start': s + 1,
                  'page_end': e + 1, 'chars': len(body)})

# --- manifest ------------------------------------------------------------------
with open(os.path.join(OUT, '_index.md'), 'w', encoding='utf-8') as f:
    f.write('# ECMA-376 (Office Open XML) — extracted text index\n\n')
    f.write(f'Source: {SRC} | {N} pages | high-fidelity layout text\n\n')
    f.write('Full single file: `ecma376-full.txt`\n\n')
    f.write('| # | file | part | pages | chars |\n|---|------|------|-------|-------|\n')
    for it in index:
        f.write(f"| {it['file'].split('_')[0]} | `{it['file']}` | {it['label']} | "
                f"{it['page_start']}-{it['page_end']} | {it['chars']} |\n")

print(f'\nDONE: {N} pages -> {len(index)} part files + full text in ./{OUT}/')
for it in index:
    print(f"  {it['file']:48s} p{it['page_start']}-{it['page_end']:5d}  {it['chars']:>8d}  {it['label']}")
