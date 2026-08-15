"""Clean official MS-PPTX / MS-OWEXML markdown and split MS-PPTX by heading."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PPTX_MD = ROOT / 'standards' / 'ms-pptx' / 'MS-PPTX-25.0.md'
OWEXML_MD = ROOT / 'standards' / 'ms-owexml' / 'MS-OWEXML-11.0.md'
SECTIONS = ROOT / 'standards' / 'ms-pptx' / 'sections'

HEADING_RE = re.compile(r'^(#{1,3})\s+(?:<a[^>]+></a>)*(.+?)\s*$')
DATA_URI_RE = re.compile(r'!\[[^\]]*\]\(data:image\/[^)]+\)')
ESC_RE = re.compile(r'\\([\\`*_{}\[\]()#+\-.!])')


def clean(text: str) -> str:
	text = DATA_URI_RE.sub('*[figure omitted]*', text)
	text = ESC_RE.sub(r'\1', text)
	text = text.replace('\\.', '.')
	return text


def slug(title: str) -> str:
	title = re.sub(r'<[^>]+>', '', title)
	title = title.strip().lower()
	title = re.sub(r'[^a-z0-9]+', '-', title).strip('-')
	return title[:80] or 'section'


def split_pptx(text: str) -> list[tuple[str, str, str]]:
	lines = text.splitlines()
	chunks: list[tuple[str, str, str]] = []
	cur_level = ''
	cur_title = 'front-matter'
	buf: list[str] = []

	def flush() -> None:
		body = '\n'.join(buf).strip()
		if body:
			chunks.append((cur_level, cur_title, body))

	for line in lines:
		m = HEADING_RE.match(line)
		if m and m.group(1) in ('#', '##', '###'):
			flush()
			cur_level = m.group(1)
			cur_title = re.sub(r'<[^>]+>', '', m.group(2)).strip()
			buf = [f'{cur_level} {cur_title}', '']
			continue
		buf.append(line)
	flush()
	return chunks


def write_sections(chunks: list[tuple[str, str, str]]) -> list[tuple[str, str]]:
	SECTIONS.mkdir(parents=True, exist_ok=True)
	written: list[tuple[str, str]] = []
	for idx, (level, title, body) in enumerate(chunks, start=1):
		if level not in ('##', '###'):
			continue
		name = f'{idx:03d}_{slug(title)}.md'
		path = SECTIONS / name
		header = (
			f'<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->\n'
			f'<!-- heading: {title} -->\n\n'
		)
		path.write_text(header + body + '\n', encoding='utf-8')
		written.append((title, f'sections/{name}'))
	return written


def main() -> None:
	pptx = clean(PPTX_MD.read_text(encoding='utf-8'))
	PPTX_MD.write_text(pptx, encoding='utf-8')
	print('cleaned', PPTX_MD, 'chars', len(pptx))

	owexml = clean(OWEXML_MD.read_text(encoding='utf-8'))
	OWEXML_MD.write_text(owexml, encoding='utf-8')
	print('cleaned', OWEXML_MD, 'chars', len(owexml))

	chunks = split_pptx(pptx)
	written = write_sections(chunks)
	index = ['# [MS-PPTX] v25.0 section files', '', 'Source: official DOCX 2024-08-20, converted to markdown.', '', '| heading | file |', '|---|---|']
	for title, rel in written:
		index.append(f'| {title} | `{rel}` |')
	(SECTIONS / '_index.md').write_text('\n'.join(index) + '\n', encoding='utf-8')
	print('wrote', len(written), 'section files')


if __name__ == '__main__':
	main()
