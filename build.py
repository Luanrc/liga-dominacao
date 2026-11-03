"""Monta o jogo num arquivo só: src/template.html + src/sim.js + src/league.js -> index.html"""
from pathlib import Path
root = Path(__file__).parent
s = (root / 'src/template.html').read_text(encoding='utf-8')
code = (root / 'src/sim.js').read_text(encoding='utf-8') + '\n' + (root / 'src/league.js').read_text(encoding='utf-8')
assert '/*__SIM__*/' in s
html = s.replace('/*__SIM__*/', code)
# o template é um fragmento (sem <html>); aqui vira uma página completa
if not html.lstrip().lower().startswith('<!doctype'):
    # o navegador fecha o <head> sozinho quando chega no conteúdo visível
    html = '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + html + '\n</html>\n'
(root / 'index.html').write_text(html, encoding='utf-8')
print('index.html gerado')
