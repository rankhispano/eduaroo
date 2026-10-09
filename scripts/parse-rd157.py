"""
Genera el catálogo LOMLOE (lib/curriculum/lomloe/*.json) a partir del texto oficial
del Real Decreto 157/2022 (Anexo II) publicado en el BOE.

Uso:
  curl -sL -A "Mozilla/5.0" -o /tmp/rd157.html "https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296"
  python3 scripts/parse-rd157.py /tmp/rd157.html lib/curriculum/lomloe

Acepta el HTML del BOE directamente. Los rangos de líneas de AREAS dependen de la
versión consolidada descargada: si el BOE cambia el texto, revísalos.
"""
import html, json, re, sys
src, outdir = sys.argv[1], sys.argv[2]
raw = open(src, encoding='utf-8', errors='ignore').read()
if src.endswith('.html'):
    raw = re.sub(r'<(script|style).*?</\1>', '', raw, flags=re.S)
    raw = re.sub(r'<br\s*/?>', '\n', raw)
    raw = re.sub(r'</(p|h\d|li|div|tr)>', '\n', raw)
    raw = html.unescape(re.sub(r'<[^>]+>', '', raw))
    raw = re.sub(r'\n\s*\n+', '\n', raw)
lines = raw.split('\n')
AREAS = [
    ('conocimiento-medio', 'Conocimiento del Medio Natural, Social y Cultural', 580, 910),
    ('lengua-castellana', 'Lengua Castellana y Literatura', 1349, 1604),
    ('lengua-extranjera', 'Lengua Extranjera', 1605, 1776),
    ('matematicas', 'Matemáticas', 1777, 2133),
]
CYCLES = {'Primer ciclo': 1, 'Segundo ciclo': 2, 'Tercer ciclo': 3}
for area_id, area_name, start, end in AREAS:
    chunk = [l.strip() for l in lines[start - 1:end]]
    comps, cycles = [], {}
    mode, cycle, cur_ce, block, sub = None, None, None, None, None
    for l in chunk:
        if not l:
            continue
        if l == 'Competencias específicas.':
            mode = 'ce'; continue
        if l in CYCLES:
            cycle = CYCLES[l]
            cycles[cycle] = {'cycle': cycle, 'grades': [cycle * 2 - 1, cycle * 2], 'criteria': [], 'basicKnowledge': []}
            mode = None; continue
        if l == 'Criterios de evaluación':
            mode = 'crit'; continue
        if l == 'Saberes básicos.':
            mode = 'sab'; block = sub = None; continue
        if mode == 'ce':
            m = re.match(r'^(\d+)\.\s+(.+)$', l)
            if m and int(m.group(1)) == len(comps) + 1:
                comps.append({'id': f'CE{m.group(1)}', 'number': int(m.group(1)), 'text': m.group(2), 'descriptors': []})
                continue
            m = re.search(r'descriptores del Perfil de salida:\s*(.+?)\.?$', l)
            if m and comps:
                comps[-1]['descriptors'] = [d.strip() for d in m.group(1).split(',')]
        elif mode == 'crit':
            m = re.match(r'^Competencia específica (\d+)\.', l)
            if m:
                cur_ce = int(m.group(1)); continue
            m = re.match(r'^(\d+\.\d+)\.?\s+(.+)$', l)
            if m:
                cycles[cycle]['criteria'].append({'id': m.group(1), 'competency': f'CE{cur_ce}', 'text': m.group(2)})
        elif mode == 'sab':
            m = re.match(r'^([A-H])\.\s+(.+?)[.:]?$', l)
            if m:
                block = {'id': m.group(1), 'title': m.group(2), 'sections': []}
                cycles[cycle]['basicKnowledge'].append(block); sub = None; continue
            m = re.match(r'^(\d+)\.\s+(.+?)\.?$', l)
            if m and block is not None:
                sub = {'title': m.group(2), 'items': []}
                block['sections'].append(sub); continue
            if l.startswith('–') and block is not None:
                if sub is None:
                    sub = {'title': '', 'items': []}
                    block['sections'].append(sub)
                sub['items'].append(l.lstrip('– ').strip())
    data = {
        'area': area_id,
        'name': area_name,
        'source': 'Real Decreto 157/2022, de 1 de marzo (BOE-A-2022-3296), Anexo II',
        'sourceUrl': 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296',
        'competencies': comps,
        'cycles': [cycles[c] for c in sorted(cycles)],
    }
    json.dump(data, open(f'{outdir}/{area_id}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(area_id, 'CE', len(comps), [ (c['cycle'], len(c['criteria']), len(c['basicKnowledge']), sum(len(s['items']) for b in c['basicKnowledge'] for s in b['sections'])) for c in data['cycles']])
