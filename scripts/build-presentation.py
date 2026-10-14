"""Build the web entry point and remove all notes parts from the supplied PPTX.
Requires beautifulsoup4; run from any working directory. No design regeneration.
"""
from pathlib import Path
from bs4 import BeautifulSoup
import json, re, zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
P = ROOT / 'coo-technology-update-2026-10-14'
data = json.loads((P / 'design-source/slides.json').read_text())
soup = BeautifulSoup((P / 'design-source/coo-technology-update.dc.html').read_text(), 'html.parser')
slides = soup.select('section[data-label]')
assert len(slides) == len(data['slides']) == 9
for i, slide in enumerate(slides, 1):
    slide['id'] = f'slide-{i}'
    slide['class'] = ['slide']
    slide['aria-label'] = slide['data-label']
    slide['tabindex'] = '-1'
    for el in slide.select('[style]'):
        style = el['style']
        fs = re.search(r'font-size:(\d+)px', style)
        if fs:
            n = int(fs[1]); mobile = 64 if n >= 90 else 32 if n >= 56 else 24 if n >= 36 else 18 if n > 24 or (n == 24 and 'font-weight:700' not in style and 'text-transform:uppercase' not in style) else 14
            el['style'] += f';--mobile-font:{mobile}px;--tablet-font:{96 if n >= 90 else 44 if n >= 56 else 30 if n >= 36 else 20 if mobile == 18 else 16}px'
        if 'display:grid' in style: el['class'] = el.get('class', []) + ['reflow-grid']
        if 'font-size' not in style and 'display:flex' in style and 'flex-direction:column' not in style and 'border-radius' not in style:
            el['class'] = el.get('class', []) + ['reflow-row']
    for img in slide.select('img'):
        img['src'] = img['src'].replace('../assets/', 'assets/').replace('assets/power-bi-report.png','assets/coo-power-bi-report.png')
        if 'logo' not in img['src']:
            img['class'] = ['screenshot']
            a = soup.new_tag('a', href=img['src'], target='_blank', rel='noopener', **{'class':'image-link','aria-label':'Open screenshot at full resolution'})
            img.wrap(a)
    if i in range(2,9):
        slide.find_all(recursive=False)[-1]['class'] = ['slide-footer']
    if i == 4:
        a = slide.select_one('a[href="#power-bi-report-url-needed"]')
        href = data['slides'][3]['cta']['href']
        if href: a['href'] = href
        else:
            a.name = 'span'; del a['href']; del a['target']; del a['rel']
            a['aria-disabled'] = 'true'; a['title'] = 'Report URL awaiting confirmation'
    if i == 5:
        grid = slide.select('.reflow-grid')[-1]
        grid.name = 'ol'; grid['class'] += ['process-list']; grid['aria-label'] = 'Manual update process and planned automation'
        for child in grid.find_all(recursive=False):
            if child.get_text(strip=True): child.name = 'li'
            else: child['aria-hidden'] = 'true'; child['class'] = ['process-spacer']
    if i == 7:
        grid = slide.select('.reflow-grid')[0]; grid['class'] += ['workflow']
        children = grid.find_all(recursive=False)
        children[0]['class'] = ['workflow-surface']
        for j in (1,2,3): children[j]['class'] = ['zone', f'zone-{j}']
        # display:contents keeps the approved grid geometry while giving steps list semantics.
        ol = soup.new_tag('ol', **{'class':'workflow-list', 'aria-label':'Business verification process'})
        children[4].insert_before(ol)
        for j in range(4,9):
            children[j].name = 'li'; children[j]['class'] = [f'step-{j-3}']; ol.append(children[j].extract())
        children[9]['class'] = ['return-loop']
        children[10]['class'] = ['workflow-output']

html = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>COO · Technology Progress and Next Steps</title><meta name="description" content="Chiefs of Ontario Economic Development technology update, October 14, 2026.">
<link rel="stylesheet" href="presentation.css"><script src="presentation.js" defer></script></head><body>
<main id="presentation" aria-label="COO technology update"><div id="stage">'''
html += '\n'.join(str(s) for s in slides)
html += '''</div></main><nav class="controls" aria-label="Presentation controls">
<button id="previous" aria-label="Previous slide">← Previous</button><div class="progress"><output id="counter" aria-live="polite">1 / 9</output><progress id="progress" max="9" value="1" aria-label="Slide progress"></progress></div>
<button id="next" aria-label="Next slide">Next →</button><button id="fullscreen" aria-label="Enter fullscreen">Fullscreen</button>
<a class="download" href="downloads/coo-technology-update-2026-10-14.pptx" download>Download PowerPoint</a></nav></body></html>'''
(P/'index.html').write_text(html)
# Preserve all native editable slide shapes; remove notes and dangling relationships.
with zipfile.ZipFile(P/'design-source/coo-technology-update-original.pptx') as source, zipfile.ZipFile(P/'downloads/coo-technology-update-2026-10-14.pptx','w',zipfile.ZIP_DEFLATED) as output:
    for name in source.namelist():
        if 'notesSlides' in name or 'notesMasters' in name: continue
        content = source.read(name)
        if name.endswith('.rels') or name == '[Content_Types].xml':
            tree = ET.fromstring(content)
            for el in list(tree):
                if 'notesSlide' in str(el.attrib) or 'notesMaster' in str(el.attrib): tree.remove(el)
            content = ET.tostring(tree,encoding='utf-8',xml_declaration=True)
        elif name == 'ppt/presentation.xml':
            content = re.sub(rb'<p:notesMasterIdLst>.*?</p:notesMasterIdLst>',b'',content,flags=re.S)
        output.writestr(name,content)
print('Built nine approved slides and notes-free editable PowerPoint.')
