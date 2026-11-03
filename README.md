# Sport Bend Manager

Jogo de gestão de equipe de **dominação profissional** (pro-bending, de *A Lenda de Korra*) que roda no navegador. Você é o técnico: monta o elenco, planeja os treinos, cuida do dinheiro e escolhe a tática entre os rounds. Referência principal: *Teamfight Manager 2*.

Protótipo com formas geométricas; pixel art vem depois.

## Jogar

Abra `index.html` no navegador. Não precisa de servidor nem de instalação. O progresso fica salvo no próprio navegador.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | O jogo pronto, num arquivo só (gerado pelo `build.py`) |
| `src/sim.js` | Simulação da partida (física, ataques, rounds, regras) |
| `src/league.js` | Gestão: liga com 3 divisões, dinheiro, patrocínios, mercado, treino, carreira do técnico |
| `src/template.html` | Interface (HTML, CSS e o código das telas) |
| `docs/design.md` | Documento de design com todas as regras |
| `tools/balance.js` | Simula carreiras longas para conferir o equilíbrio |

## Desenvolvimento


Edite os arquivos em `src/` e gere o jogo de novo:

```sh
python3 build.py
```

Para simular uma carreira (semente, divisão inicial 0/1/2, temporadas):

```sh
node tools/balance.js 101 2 8
```
