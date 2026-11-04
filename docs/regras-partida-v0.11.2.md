# Regras da partida: versão de referência (v0.11.2)

Registro de **como a partida funciona até a v0.11.2**, antes da revisão das táticas. Serve para voltar às regras originais, se for preciso. O código desta versão está guardado como `sim_regras_v0112.js` (cópia do `sim.js`).

Unidades: a arena tem 600 de comprimento (AL) e 300 de largura (AW); cada zona tem 100 (ZW). A simulação roda a 60 passos por segundo.

---

## 1. Estrutura

- **3 contra 3**: um bender de água, um de terra e um de fogo por time.
- Cada lado tem **3 zonas**; todos começam na **Zona 1** (a da frente). A linha do centro separa os times.
- **Empurrado para trás não volta**: ao cruzar o fundo da sua zona, o bender passa a jogar na zona de trás pelo resto do round.
- **Avanço**: quando **todos** os benders vivos de um time estão pelo menos uma zona atrás da linha, o time adversário **avança uma zona** (a linha anda; os vivos do time que avança ganham uma zona).
- **Água**: empurrado além do fundo da Zona 3, o bender cai na água e fica fora do round. Derrubar os três é **nocaute** e encerra a **partida**.
- **Rounds** de 3 minutos, melhor de 3. No fim do tempo vence:
  1. quem tiver avançado mais (território);
  2. se a linha estiver no centro, quem tiver os benders mais à frente (soma das zonas; caído conta −1 zona);
  3. empate total: **duelo 1 contra 1** (o mais forte de cada lado em Poder + Agilidade + Precisão), numa plataforma no centro, 45 segundos.
- **Pré-round**: 1,6 s de posicionamento. Táticas e instruções só mudam no intervalo antes de cada round.

## 2. Elementos

| | Recarga | Velocidade do ataque | Força (empurrão base) | Raio | Persegue o alvo | Duração |
|---|---|---|---|---|---|---|
| Fogo | 0,55 s | 440 | 150 | 6 | não | 1,5 s |
| Água | 0,85 s | 330 | 230 | 8 | sim (1,8 rad/s) | 2,0 s |
| Terra | 1,20 s | 300 | 330 | 9 | não | 2,2 s |

- **Alcance** (força × distância percorrida, de 40 a 240): fogo 0,6 → 1,4; água 1,0 → 1,0; terra 1,4 → 0,6.
- **Posição preferida**: fogo joga 8 mais atrás, terra 8 mais à frente.
- Fogo tem 35% de chance de soltar um segundo ataque logo em seguida (rajada).
- **Choque no ar**: ataques de times opostos que se encontram se anulam se a diferença de força for menor que 60; senão o mais forte segue com 60% da força.

## 3. Fórmulas principais

- **Recarga** = recarga do elemento × (1,15 − AGI × 0,003) × multiplicador da postura × (0,9 se Pressionar) × (0,85 a 1,15 aleatório).
- **Mira**: antecipa o movimento do alvo em (0,45 + PRE × 0,005); erro angular = 0,015 + (1 − PRE/100) × 0,48 (distribuição normal).
- **Empurrão** = força × alcance × 0,48 × (0,6 + POD × 0,008) ÷ (0,6 + (FIR + firmeza extra) × 0,008). Atrito 6,5.
- **Esquiva** (quando o ataque chega) = 0,10 + AGI × 0,0045 + bônus da postura + (LEI − 50) × 0,006 + bônus de instrução/formação − (PRE do atacante − 60) × 0,004, reduzida se o bender ainda está atordoado.
- **Bloqueio** (só terra) = 0,08 + FIR × 0,0025 + bônus da postura + (LEI − 50) × 0,0024.
- **Atordoamento** após levar golpe: 0,22 s + empurrão ÷ 1200 (não ataca nem se move por conta própria).

## 4. Faltas

- **Falta de linha** (pisar além da linha da zona): chance por decisão = 0,0007 × (1,25 − DIS/100) × multiplicador de faltas da postura × (2,5 se Pressionar ou âncora da Escalonada).
- **Golpe acima dos ombros**: a cada acerto, chance = 0,012 × (1,25 − DIS/100) × multiplicador de faltas; o golpe não conta.
- **Punição**: o infrator recua uma zona. Já na Zona 3: recua o **aliado mais à frente**. Time inteiro na Zona 3: o infrator fica **20 segundos fora** (termina com o round).

## 5. Táticas do time

### Postura

| | Distância da linha | Recarga | Esquiva | Bloqueio | Faltas |
|---|---|---|---|---|---|
| Agressiva | 20 | ×0,86 | −0,05 | −0,03 | ×1,6 |
| Equilibrada | 26 | ×1,00 | 0 | 0 | ×1,0 |
| Defensiva | 32 | ×1,15 | +0,10 | +0,06 | ×0,5 |

- **Temperamento** (0 calmo a 100 explosivo): a postura efetiva de cada bender = 65% a ordem do técnico + 35% o jeito natural (calmo puxa para a Defensiva, explosivo para a Agressiva). Faltas × (0,8 + temperamento × 0,004).
- Jogar mais longe da linha também deixa o bender mais perto do fundo da própria zona (mais fácil de ser empurrado para trás).

### Escolha de alvo

Todas usam a **vulnerabilidade** do rival: 1 + (quanto falta para o fundo da zona) × 1,5, +0,8 se já está na Zona 3.

- **IA decide** (`free`): vulnerabilidade + preferência de distância do elemento (fogo prefere longe, terra perto, ajustada por Pressionar/Manter distância) + 0,3 se o rival está mirando nele + 0,35 para continuar no mesmo alvo + acaso × (1,1 − LEI/100).
- **Foco no mais vulnerável** (`focus`): o mais vulnerável; com chance de (1 − LEI/100) × 35% escolhe um rival ao acaso.
- **Duelo de elementos** (`mirror`): o rival do mesmo elemento, a não ser que outro esteja 0,5 mais vulnerável.
- **Mais perigoso / Mais próximo / Caçar a estrela** (`danger`, `nearest`, `star`): vulnerabilidade × 0,85 + acaso × (1,1 − LEI/100) × 0,7 + bônus: (POD − 50)/28; −distância/160; (soma dos atributos − 300)/130.

### Formação

- **Aberta**: o time ocupa 100% da largura.
- **Compacta**: 55% da largura; +0,04 para atacar o alvo de um companheiro (só com IA decide). **Respingo**: um golpe empurra quem está a menos de 34 do alvo com 40% da força.
- **Escalonada**: 90% da largura. **Âncora** (terra, se em quadra; senão quem tem mais FIR): 8 mais à frente, +14 de FIR contra empurrões, faltas de linha ×2,5. Os outros dois: 6 mais atrás e +0,05 de esquiva.

## 6. Instruções individuais

| Instrução | Efeito |
|---|---|
| Sem instrução | segue o time |
| Pressionar | 8 mais à frente; prefere alvos perto; recarga ×0,9; faltas de linha ×2,5 |
| Manter distância | 6 mais atrás; prefere alvos longe; movimento lateral ×1,4; esquiva +0,08 |
| Mais agressivo | postura do bender puxada 60% para a Agressiva |
| Mais cauteloso | postura do bender puxada 60% para a Defensiva |
| Proteger | esquiva +0,10; quem não é terra recua 8. Na terra: tenta interceptar ataques em companheiros a até 80 |
| Marcar um rival | ataca sempre o rival escolhido |

- **Desobediência** (sorteada no início de cada round): explosivos resistem a Mais cauteloso, Manter distância e Proteger; calmos resistem a Mais agressivo e Pressionar. Chance = ((|temperamento − 50| − 15) ÷ 35) × 45%, até 45%. Estresse acima de 60 soma até 20% (máximo 80%). Quem desobedece joga como Mais agressivo (explosivo) ou Mais cauteloso (calmo).

## 7. Efeitos de fora da partida

- **Energia**: até 22% a menos nos atributos com energia zero.
- **Estresse**: reduz Precisão, Disciplina e Leitura em até 25% (estresse 100) e os físicos em até 8%.

## 8. Medições desta versão (laboratório, mesmos times trocando de lado)

| Confronto | Vitórias do primeiro |
|---|---|
| Agressiva × Equilibrada | 56% |
| Defensiva × Equilibrada | 57% |
| Compacta × Aberta | 64% |
| Escalonada × Aberta | 53% |
| Foco no vulnerável × IA decide | 51% |
| Mais perigoso × IA decide | 54% |

(80 partidas por confronto; margem de cerca de ±10 pontos.)
