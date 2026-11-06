# Sport Bend Manager: documento de design

**Sport Bend Manager** (nome provisório do projeto: Bender Manager; antes, Liga de Dominação) é um jogo de gestão de equipe de **dominação profissional** (pro-bending, de *A Lenda de Korra*), no navegador. Referência principal de gestão e visual: **Teamfight Manager 2**. O jogador é o técnico: não controla os benders em quadra; monta o elenco, planeja os treinos, cuida do dinheiro e escolhe a tática entre os rounds.

Este documento é a referência das regras. Quando uma regra mudar, ela muda aqui primeiro.

**Legenda de status:** ✅ implementado no protótipo · 🔨 decidido, a implementar · 💡 ideia para o futuro

Os números marcados como *iniciais* são pontos de partida para balancear.

---

## 1. Fluxo do jogador

0. **Tela de título (v0.24; junta-se à abertura na v0.24.1):** "Sabe como funciona a Dobra Esportiva?" com a partida ao vivo e o texto, e abaixo os botões: Novo jogo · Livre, Novo jogo · Carreira, Continuar (quando há jogo salvo) e Partida avulsa. A refinar. ✅
1. **Escolhe a equipe** ✅ — a tela mostra só as grades de times (no modo Carreira, só a Terceira Divisão) e um botão Voltar; clicar num time abre a confirmação.
   - **Livre:** qualquer um dos 24 times das três divisões. Times com nota menor, e os das divisões de baixo, são um desafio maior.
   - **Carreira:** começa num time da **Terceira Divisão**, com pouca reputação (8). O objetivo é subir, se firmar e chegar ao título da Primeira. As regras são as mesmas do modo Livre; muda só o ponto de partida.
2. **Pré-temporada (v0.24): telas próprias, sem abas, em toda temporada** ✅
   - Um indicador no topo mostra os passos: Patrocínios › Mercado › Temporada.
   - **Patrocínios:** quadro da temporada (resultado da anterior, expectativa da diretoria, quem envelheceu ou se aposentou) e as propostas; escolhe até 2. "Seguir para o mercado" no cabeçalho (sem patrocínio, pede confirmação).
   - **Mercado:** orçamento e ofertas recebidas no topo; abaixo, abas **Sem contrato | Água | Terra | Fogo** (v0.24.2) com a contagem de cada uma; as abas de elemento listam os benders de outros times daquele elemento, divididos em sub-abas por divisão (Primeira | Segunda | Terceira, com contagem; abre na divisão do seu time, v0.24.3), com os filtros "à venda" e orçamento. Notícias do mercado no fim. Coluna lateral: "Antes de começar" (✓ / ! / ✕ para patrocínios, elenco mínimo, contratos e ofertas) e **Seu elenco** (renovar contratos encerrados por 1, 2 ou 3 temporadas, vender e dispensar). A escalação não aparece na pré-temporada (v0.24.2): os titulares são escalados sozinhos ao começar a temporada e podem ser trocados no Elenco. "Voltar aos patrocínios" e "Começar temporada" no cabeçalho.
   - Durante a temporada, o cabeçalho mostra "Ir para a partida" e "Simular rápido".
   - **Abas na temporada:** Central, Elenco, Treino, Finanças, Classificação, Guia. O Mercado não aparece fora da pré-temporada. **Finanças** junta a antiga aba Patrocínios: Diretoria (expectativa e confiança), Patrocínios, Finanças e Folha salarial.
3. **Semana da temporada** (repete a cada rodada)
   - Escolhe o **tipo de treino** (Equipe ou Individual) e o foco de cada um, ou descanso. ✅
   - Joga a **partida**, ajustando a tática no intervalo entre rounds. ✅
   - Vê o **resultado da rodada**: placar, dinheiro recebido e pago, evolução do treino, progresso das metas. ✅
4. **Fim da temporada:** bônus de patrocínio, premiação, acesso e rebaixamento e, na temporada seguinte, renovação de patrocínios e nova janela de transferências. ✅

---

## 2. Liga, divisões e temporada

**Divisões** ✅
- **3 divisões de 8 times cada**, como no futebol brasileiro: **Primeira**, **Segunda** e **Terceira Divisão**, 24 times no total.
  | | Primeira | Segunda | Terceira |
  |---|---|---|---|
  | Notas dos times | 62–72 | 50–62 | 40–52 |
  | Patrocínios, prêmios e eventos | 100% | 60% | 45% |
  | Caixa inicial | ¥20.000 | ¥12.000 | ¥7.000 |
  | Popularidade inicial | ~40–75 | ~12–45 | ~4–30 |
- A Terceira tem elencos mais jovens: cerca de 25% dos benders começam com 17 a 20 anos, com mais potencial.
- **Acesso e rebaixamento**, ao fim da temporada, entre cada par de divisões vizinhas:
  - os **2 últimos** da fase de pontos da divisão de cima caem;
  - sobem o **campeão da divisão de baixo** (vencedor dos playoffs) e o **melhor colocado da fase de pontos entre os demais**.
  - Aplicado na virada de temporada. ✅
- Saves feitos com duas divisões ganham a Terceira na virada de temporada seguinte.

**Temporada** (igual nas três divisões)
- **Fase de pontos:** 14 rodadas em **turno e returno**: cada time enfrenta cada rival duas vezes, uma em casa e outra fora (o returno repete as rodadas do turno com o mando invertido). ✅
- **Efeito no descanso e no estresse (simulado):** com 7 rodadas, o estresse dos titulares não chegava a acumular antes do fim da temporada. Com 14 rodadas e a mesma recuperação, um técnico que treina 2 semanas e descansa 1 via o estresse médio dos titulares chegar a ~50 e passar de 60 (onde começam as desobediências). Com a recuperação natural de −4 por semana, a mesma rotina fica abaixo de 60, com média entre 10 e 40 conforme os resultados. Quem não descansa sente o returno.
- **Temporada mais longa, mesmo ritmo:** o que acontece a cada semana (energia, estresse, salários, patrocínio, renda da IA) continua igual. O que é um total "da temporada" vale metade por partida, para a temporada inteira render o mesmo que antes com 7 rodadas: ganho de treino, popularidade dos benders e do time por partida e por evento. ✅
- **Playoffs:** os 4 primeiros vão às semifinais (1º × 4º e 2º × 3º); os vencedores fazem a final, que decide o campeão da divisão. ✅
- Na Primeira Divisão, os playoffs valem o título e não mudam o rebaixamento. Na Segunda e na Terceira, o campeão dos playoffs tem acesso garantido. ✅
- **Campeão da Segunda ou da Terceira** recebe troféu/título, prêmio em dinheiro e o acesso. ✅
- **Classificação:** vitórias; desempate por saldo de rounds, depois nocautes. ✅
- As partidas das três divisões acontecem na mesma rodada; o jogador acompanha a classificação de todas (a do seu time primeiro). ✅
- **Times:** Primeira Divisão: Lótus Carmesim, Lanternas de Prata, Corvos de Jade, Raposas do Deserto, Dragões de Ba Sing Se, Tigres da Ilha, Ondas do Polo Norte, Martelos de Yu Dao. Segunda Divisão: Gaivotas do Porto, Tartarugas de Ferro, Garças da Neve, Ventos de Omashu, Faróis do Polo Sul, Ursos de Gaoling, Leques de Kyoshi, Lâminas de Zaofu. Terceira Divisão: Pumas de Taku, Lontras do Rio Jang, Falcões de Chin, Coalas da Baía, Serpentes do Pântano, Cometas de Hira'a, Lagartas de Makapu, Javalis da Montanha. (Divisão inicial; muda com acesso e rebaixamento.) ✅
- Cada time tem um **estilo de técnico** (agressivo, equilibrado ou defensivo) e uma **arena da casa** (redonda ou quadrada). A partida acontece na arena do mandante. ✅
- **Temporadas seguintes:** o jogador continua com o mesmo time, elenco e dinheiro (ver 6b). ✅
- **Passagem de tempo:** idade, evolução e declínio dos benders, aposentadoria. 💡

---

## 3. Elenco

- Cada time tem **de 6 a 9 benders** (v0.15; antes, até 5) e precisa ter **pelo menos 1 de cada elemento** (água, terra, fogo). ✅
  - Elenco inicial dos times: 3 titulares, 1 reserva de cada elemento (5 a 8 pontos de nota abaixo) e de 0 a 3 benders a mais, mais fracos e muitas vezes jovens. Média de 7,5 por time.
  - A temporada só começa com pelo menos 6 benders (sem contar contratos encerrados). Se o caixa não pagar, o técnico ainda pode contratar benders sem contrato baratos (luva até ¥1.500) para chegar a 6.
  - A IA completa o elenco até 6 e só vende ou dispensa acima de 6.
  - Nomes: a lista tem 318 nomes (eram 128), o bastante para 24 elencos de até 9 mais os benders sem contrato.
- Cada partida começa com **3 titulares, um por elemento**. O jogador escolhe os titulares. ✅
- **Banco e substituições** (v0.15): os reservas sadios ficam no banco da partida. No intervalo entre os rounds (na HUD de preparação), o técnico troca à vontade, sempre por alguém do mesmo elemento, para que os três elementos continuem em quadra. Quem entra herda a instrução de quem saiu, e quem marcava o bender que saiu passa a marcar quem entrou. Quem entra em quadra conta como quem jogou (energia, estresse, popularidade). A IA, e o técnico que pula para o resultado, trocam automaticamente quem se lesionou pelo melhor reserva sadio do elemento. ✅
- **Lesão** (v0.15): atributo visível, "sem lesão" ou "lesionado por X semanas" (rodadas). ✅
  - **Na partida:** cada vez que um bender é empurrado de zona (2,2%), cai na água (8%) ou é atingido acima dos ombros, a jogada que dá falta (2%, v0.15.1), pode se machucar; com energia baixa a chance aumenta (×0,7 com energia 100, ×1,3 com 50, ×1,9 com 0). Quem se lesiona joga o resto da partida com Poder, Agilidade e Firmeza a 85%, até ser trocado no intervalo. A narração avisa e o bender aparece com o selo "Lesionado" na HUD de preparação.
  - **No treino:** treinar com energia baixa pode machucar: 0,5% + 0,15% por ponto de energia abaixo de 50 (energia 30 ≈ 3,5%).
  - **Duração:** 1 semana (45%), 2 (30%), 3 (15%), 4 (7%) ou 5 (3%). Cada rodada desconta uma semana.
  - **Lesionado** não treina nem faz eventos que exigem o físico (Exibição na praça, Festival, Aula numa escola), mas pode descansar e fazer eventos tranquilos (Evento beneficente, Entrevista ao jornal, Comercial de rádio, Sessão de autógrafos). Não vai para o banco da partida e não pode ser escalado. Se o titular se lesiona, o melhor reserva sadio do elemento assume (aparece no resumo da rodada). Só entra em quadra se não houver outro bender sadio do elemento, e então joga com os atributos físicos a 85%.
  - **Valor de mercado:** −8% por semana de lesão (no mínimo 60% do valor).
- O elenco só muda durante a **janela de transferências**. ✅
- **Aba Elenco** (v0.11) ✅
  - **Escalação** (v0.16.7, no estilo da HUD de preparação): à esquerda, o campo vertical com as Zonas 1 a 3 e os 3 titulares posicionados pela formação e pela postura da última partida; à direita, a lista com titulares e reservas (elemento, nome, nota, idade, energia, estresse, lesão). Arrastar um reserva para o campo (ou sobre o titular) o escala no lugar de quem é do mesmo elemento; arrastar um titular sobre um reserva faz a troca ao contrário; o botão "Escalar ⇄ [titular]" continua como alternativa. Clicar num boneco do campo ou numa linha da lista abre a ficha do bender (gráfico de competências) logo abaixo.
  - A tabela completa do elenco (atributos, popularidade, temperamento, energia, estresse, lesão) continua embaixo. **Vender e dispensar** saíram dela e ficam na **folha salarial da aba Finanças** (só na pré-temporada), ao lado do salário, do contrato e do valor (v0.16.8).
  - **Ficha do bender sempre em janela** (v0.16.8): em qualquer lugar onde um bender pode ser clicado (campo e lista da escalação, tabela do elenco, treino, folha salarial, mercado, observação do rival na Central e na partida, e, desde a v0.16.9, bonecos e linhas da HUD de preparação, inclusive o banco), a ficha abre numa janela por cima da tela. Na HUD, clicar abre a ficha e arrastar faz a substituição; trocar a instrução não abre nada.
  - **Ficha do bender:** clique em qualquer bender (abre numa janela). Mostra idade, temperamento e popularidade, o **gráfico de competências** (radar dos 6 atributos, de 30 a 100, comparando o início da temporada com agora), a lista de atributos com o ganho na temporada e a **evolução semana a semana** (uma coluna por rodada; ▲ nas semanas em que o atributo subiu; cor mais forte conforme o crescimento acumulado).
  - O histórico é guardado só para os benders do seu time, a partir do início da temporada. Na pré-temporada, a ficha mostra só os valores atuais.
- **Aba Finanças · Folha salarial** (v0.11.1): salário, contrato e valor de mercado de cada bender (com Nota, Idade e Popularidade), o total da folha por rodada e na temporada, e a renovação dos contratos encerrados. Essas colunas saíram do Elenco. ✅
- **Aba Treino** (v0.11): tipo de treino (equipe ou individual), plano de cada bender e eventos da semana, separado do elenco. ✅

---

## 4. Dinheiro (yuans, ¥)

O único recurso do jogo. ✅

**Entradas**
| Fonte | Valor inicial |
|---|---|
| Patrocínio: valor fixo por rodada | ¥1.100 a ¥3.000 por contrato (Fácil 1.100–1.500 · Média 1.600–2.100 · Difícil 2.200–3.000) |
| Patrocínio: bônus por meta cumprida | ¥4.000 a ¥20.000 |
| Prêmio por vitória na fase de pontos | ¥1.000 |
| Premiação final: semifinalista / vice / campeão | ¥5.000 / ¥12.000 / ¥25.000 |
| Bônus de acesso | ¥15.000 × multiplicador da divisão de destino (para a Primeira ¥15.000; para a Segunda ¥9.000) |

Os valores de patrocínio e prêmios acima são os da **Primeira Divisão**. Na **Segunda Divisão**, valem **60%**, e na **Terceira**, **45%** (*iniciais*; com 35% um time da Terceira não fechava as contas). Salários e valores de mercado não mudam com a divisão: dependem só da nota do bender. Por isso, um time rebaixado com elenco caro tem que vender para fechar as contas.
| Venda de bender a outro time | 80% do valor de mercado |

**Saídas**
| Gasto | Valor inicial |
|---|---|
| Salário de cada bender, pago a cada rodada (fixado no contrato, ver 6d) | 0,75 × ¥1.400 × ((nota − 30) ÷ 40)^1,5: nota 50 ≈ ¥370, nota 56 ≈ ¥550, nota 70 = ¥1.050, nota 80 ≈ ¥1.470 (v0.15: o fator 0,75 compensa o elenco maior) |
| Contratar bender sem contrato (luvas) | 2 rodadas de salário |
| Comprar bender de outro time | valor de mercado |

(Valor de mercado e luvas também sobem com a popularidade do bender: ver 7b.)

- O salário **cresce mais rápido que a nota** (curva, não linear), para que um elenco médio da Segunda Divisão caiba no orçamento dela e uma estrela custe bem mais que um bender mediano. *Inicial.*
- **Valor de mercado:** 10 rodadas do salário de tabela, sem o fator 0,75 (nota 70 = ¥14.000); as luvas também usam o salário de tabela, ×1,25 se o bender for titular no time atual. *Inicial.*
- **Caixa inicial:** Primeira ¥20.000; Segunda ¥12.000; Terceira ¥7.000. *Inicial.*
- **Times da IA** não têm patrocinadores: recebem uma **renda simplificada por rodada** proporcional à própria folha (Primeira ×1,05, Segunda e Terceira ×0,95; ×0,8 acima de ¥40 mil; ×0,55 acima de ¥80 mil), **limitada por divisão** (1,35 × a renda de referência: Primeira ¥7.155, Segunda ¥4.185, Terceira ¥2.500 por rodada; v0.15: referência +15% para acompanhar a folha do elenco maior), mais os prêmios de vitória e playoffs como o jogador. ✅
- **Saldo negativo:** bloqueia contratações e compras até voltar ao positivo. ✅
- **Peso dos salários (diretriz de balanceamento):** o valor fixo dos patrocínios deve cobrir **cerca de 90% a 100% dos salários de um elenco médio**. Assim, um time que só cumpre o básico empata as contas, e o dinheiro para crescer (contratar e pagar benders melhores) vem das **metas de patrocínio, dos prêmios e das vendas**. Um elenco cheio de estrelas só se paga se o time vencer. 🔨

  Conta de referência para um time médio (4 benders com nota média 65) numa temporada de 7 a 9 partidas:
  | | Por rodada | Por temporada |
  |---|---|---|
  | Salários (4 × 65 × ¥20) | ¥5.200 | ¥36.000 a ¥47.000 |
  | 2 patrocínios, valor fixo médio | ¥5.500 | ¥38.000 a ¥50.000 |
  | Bônus de metas (1 ou 2 cumpridas) | | ¥10.000 a ¥40.000 |
  | Prêmios (4 vitórias e semifinal) | | ~¥9.000 |

  Esses valores (da Primeira Divisão) serão conferidos simulando temporadas inteiras sem tela antes de fechar, nas duas divisões.
- **Salários aparecem** no elenco, no mercado e no resumo da rodada. ✅

---

## 5. Patrocínios

✅

- Na pré-temporada, o jogador recebe **4 propostas** e escolhe **até 2**. O contrato vale a temporada inteira.
- Cada proposta tem um **valor fixo por rodada**, uma **meta** e um **bônus** pago quando a meta é cumprida.
- Quanto maior o pagamento, mais difícil a meta.
- Os valores dependem da divisão (60% na Segunda, 45% na Terceira). Há metas próprias das divisões de baixo, como **conseguir o acesso**.
- O progresso das metas aparece na central do time.
- A meta é avaliada assim que for cumprida, ou ao fim da temporada (as de posição final).
- **Não há multa** quando a meta não é cumprida. A consequência aparece na **renovação**, ao fim da temporada:
  - **Meta cumprida:** o patrocinador quer renovar, com valor fixo e bônus 15% maiores, até no máximo 25% acima do topo da faixa daquele nível.
  - **Meta não cumprida, mas perto:** oferece renovar com valores menores (−20%, *inicial*).
  - **Meta muito longe:** não quer renovar.
  - O jogador decide se aceita a renovação ou procura outras propostas na pré-temporada.

**Exemplos de meta** (*iniciais*)
| Dificuldade | Meta |
|---|---|
| Fácil | Vencer 6 partidas · Conseguir 2 nocautes |
| Média | Vencer 9 partidas · Terminar entre os 4 primeiros · 5 nocautes |
| Difícil | Chegar à final · Terminar a fase de pontos em 1º · Vencer 4 partidas seguidas |
| Especial | Ser campeão · Perder no máximo 1 vez em casa · Conseguir o acesso (só na Segunda e na Terceira) |

Os patrocinadores são marcas inventadas do universo (lojas, fábricas e serviços da Cidade República), nunca marcas reais.

---

## 6. Janela de transferências

✅

- Acontece **no início de cada temporada**, antes da 1ª rodada, em **1 etapa** (v0.24; antes eram 2).
- **Na abertura:** os times da IA fazem as contratações e vendas deles, o mercado de benders sem contrato se renova e chegam até **3 ofertas** pelos benders do técnico. Assim o técnico já vê os elencos completos dos outros times.
- **Ao começar a temporada:** a IA faz uma última rodada de ajustes (aparece nas notícias) e a janela fecha.
- O técnico pode:
  - **Contratar benders sem contrato**, pagando as luvas.
  - **Orçamento no mercado** (v0.11): o topo do mercado mostra caixa, folha e patrocínios por rodada e o saldo fixo. Cada bender mostra o caixa depois da compra e se **cabe no orçamento** (o caixa paga o preço e ainda cobre o salário dele nas 14 rodadas); os benders sem contrato também mostram o custo na temporada (luvas + salário). O filtro "Só quem cabe no orçamento" vale para as duas listas. ✅
- **Comprar benders de outros times** (de qualquer divisão), pagando o **valor de mercado**. O vendedor só aceita se continuar com pelo menos 1 bender do mesmo elemento e 3 no elenco.
  - **Vender** um bender direto, recebendo **80% do valor de mercado**, para o time com vaga e caixa que mais ganharia com ele.
  - **Aceitar ou recusar ofertas da IA.** As ofertas vão de 95% a 130% do valor (a maioria acima), e aparecem quando o bender seria titular no time interessado (chance alta) ou um bom reserva (chance baixa).
  - **Dispensar** um bender: ele vira bender sem contrato, sem custo nem receita.
- Nunca é possível ficar sem bender de algum elemento.
- **A IA negocia entre si:** completa o elenco com benders sem contrato quando tem menos de 6; procura reforço (bender sem contrato ou bender de outro time da IA) para o elemento do titular mais fraco, quando acha alguém pelo menos 4 pontos de nota melhor que caiba no caixa (deixando ¥3.000 de folga); dispensa o reserva mais fraco para abrir vaga; e, **se estiver no vermelho**, vende ou dispensa o reserva mais caro.
- As **notícias do mercado** mostram todos os negócios da janela.
- Fora da janela, o elenco fica travado.
- Multa por quebra de contrato e renegociação no meio do contrato. 💡

## 6b. Virada de temporada

✅

Ao encerrar uma temporada, o técnico avança para a seguinte:
- **Acesso e rebaixamento aplicados:** os times trocam de divisão e um novo calendário é sorteado.
- **Continuam:** elenco, caixa, popularidade dos benders e do time, atributos treinados.
- **Reiniciam:** campanha (vitórias, derrotas, nocautes, sequências), energia volta a 100, estresse cai para 40% do que era, planos voltam para descanso.
- **Popularidade do time volta um pouco para a média:** 70% do valor atual + 30% da média da divisão (55 na Primeira, 28 na Segunda, 14 na Terceira). Evita times presos em 0 ou 100.
- **Patrocínios:** cada patrocinador avalia a temporada.
  | Resultado da meta | Proposta de renovação |
  |---|---|
  | Cumprida | renova com valores +15% |
  | Não cumprida, mas perto (≥60% do objetivo, ou posição próxima nas metas de colocação) | renova com valores −20% |
  | Longe | não quer renovar |

  As renovações aparecem entre as propostas da pré-temporada, completadas por novas propostas até 4, já com a nova divisão e a popularidade atual. O técnico escolhe livremente de novo (até 2).
- **Histórico** das temporadas do técnico (posição, campanha, título, acesso ou queda) aparece na Central.
- **Cores:** os 24 times têm cores únicas, para não repetir quando trocam de divisão.
- **Equilíbrio de longo prazo** (simulado por 6 temporadas seguidas): os elencos continuam sempre válidos; a renda da IA acompanha a própria folha (Primeira ×1,05, Segunda ×0,95; ×0,8 se o time já tem mais de ¥40 mil), o que evita times quebrados. Times da IA ricos (mais de ¥80 mil) recebem menos e aceitam reforços menores (+2 de nota em vez de +4), para gastar o que acumulam. Com idade e aposentadoria (ver 6d), as notas ficam estáveis ao longo das temporadas.

## 6c. Carreira do técnico

✅

- **Reputação do técnico** (0 a 100), que é do jogador e vai com ele de time em time. Começa em 30 num time da Primeira Divisão, 20 num da Segunda e 8 num da Terceira.
- **Expectativa da diretoria:** quando a temporada começa, a diretoria espera a posição do time no ranking de notas da divisão (o elenco mais forte deve terminar em 1º, e assim por diante). A pré-temporada mostra uma prévia e a Central mostra a meta durante a temporada, com um objetivo em palavras:
  | Expectativa | Primeira Divisão | Segunda e Terceira |
  |---|---|---|
  | 1º–2º | Ser campeão | Conseguir o acesso |
  | 3º–4º | Chegar às semifinais | Chegar às semifinais |
  | 5º–6º | Terminar no meio da tabela | Terminar no meio da tabela |
  | 7º–8º | Evitar o rebaixamento | Terminar no meio da tabela |
- **No fim da temporada a reputação muda:** ±2,5 por posição acima ou abaixo do esperado; +3 por chegar aos playoffs; +12 pelo título da Primeira, +8 pelo da Segunda, +6 pelo da Terceira; +8 pelo acesso; −10 pelo rebaixamento. Nas divisões de baixo os ganhos valem menos e têm teto: **Segunda** 60%, até **70**; **Terceira** 45%, até **45** (para chegar ao topo é preciso trabalhar na Primeira).
- **Propostas de outros times:** no fim da temporada, até 3 times oferecem o cargo de técnico. Um time só se interessa se a reputação alcança o mínimo dele (Primeira: 38 + 3 por ponto de nota acima de 62; Segunda: 8 + 2 por ponto acima de 50; Terceira: 1 por ponto acima de 40; com 5 pontos de tolerância), e só aparecem propostas que não sejam um passo atrás (divisão melhor na próxima temporada, ou mesma divisão com elenco de nota parecida ou maior). Cada proposta mostra divisão, nota, caixa, popularidade e o objetivo da diretoria.
- **Aceitar:** na virada de temporada o técnico assume o novo time, com o elenco, o caixa, a popularidade e os patrocínios dele (recebe propostas novas, sem as renovações do time antigo). O time antigo passa a ser da IA. O histórico registra o time de cada temporada.
- **Confiança da diretoria e demissão** ✅
  - **Confiança da diretoria** (0 a 100), só durante a temporada. Começa entre 40 e 70: 55 + 0,3 × (reputação − 30).
  - **A cada rodada** (valores × 0,5 desde o turno e returno, para a temporada inteira pesar o mesmo que antes): vitória +5, derrota −6, ajustadas pela força do adversário (±0,5 a 0,6 por posição de diferença na expectativa; vitória de +2 a +8, derrota de −2 a −9); a partir da 3ª rodada, ±1 por posição acima ou abaixo da expectativa; −3 com o caixa no vermelho; −4 a mais em sequência de 3 derrotas. A Central mostra a barra com o estado (Firme, Atenção, Pressão, Por um fio) e avisa quando está baixa.
  - **Demissão no meio da temporada:** confiança zerada a partir da 8ª rodada (início do returno). O técnico escolhe na hora um dos times que o aceitam (pelo menos 2, de nível menor) e termina a temporada no comando dele, com confiança 60 e sem os patrocínios do time anterior.
  - **Demissão no fim da temporada:** confiança abaixo de 20 *e* posição final pior que a expectativa (quem cumpre a expectativa não cai por confiança), ou rebaixamento com expectativa de 4º lugar ou melhor. As propostas normais são trocadas por propostas de resgate, e é preciso escolher uma para avançar.
  - **Toda demissão custa 6 pontos de reputação** e fica registrada no histórico.
  - **Referência simulada:** em 16 temporadas com um técnico descuidado (treino sem descanso), houve 1 demissão no meio e poucas no fim, sempre em campanhas ruins.

## 6c-2. Contratação de emergência

- Se faltar um elemento no elenco na pré-temporada e o caixa não pagar a luva, o técnico **ainda pode contratar um bender sem contrato daquele elemento**; o caixa fica no vermelho. Assim o jogo nunca trava sem time completo.

## 6d. Idade, potencial e contratos

✅

**Idade**
- Benders nascem com idade entre 18 e 33 (a maioria entre 21 e 29). Jovens começam com atributos um pouco menores (−6 até 20 anos, −3 até 23).
- **Treino rende mais nos jovens:** ×1,5 até 20 anos, ×1,25 até 23, ×1 até 27, ×0,6 até 30, ×0,3 depois.
- **A cada virada de temporada,** todos fazem aniversário:
  - **Até 24 anos, abaixo do potencial:** amadurecem sozinhos, andando de 20% a 45% do caminho até o potencial.
  - **A partir dos 30:** declínio de cerca de 0,9 ponto por ano acima de 29 na Agilidade (com acaso), um pouco menos em Poder, metade na Firmeza e 30% na Precisão; ganham +0,5 em Leitura e Disciplina.
  - **Aposentadoria:** a partir dos 33 anos, com chance de 25% (+25% por ano a mais); aos 37, todos param. Os nomes dos aposentados voltam a ficar disponíveis.

**Potencial (oculto)**
- **O técnico não vê o potencial** (v0.11): ele existe e continua regendo o treino, o amadurecimento, o valor de mercado e as apostas da IA, mas não aparece em nenhuma tela. O Guia explica apenas que cada bender tem um limite de evolução, percebido quando o treino passa a render pouco.
- A nota máxima que o bender pode alcançar. Na geração: até 20 anos, nota + 8 a 20; até 23, + 4 a 13; até 26, + 1 a 6; acima, + 0 a 2.
- O potencial **nunca sobe**. Ao alcançar o potencial, o treino rende só 15%; com 2 pontos acima dele, o treino para de render. Após o declínio, o potencial cai junto com a nota.

**Valor de mercado** × idade (até 21 ×1,35; até 25 ×1,15; até 29 ×1; até 31 ×0,75; depois ×0,5) × (1 + 2% por ponto de potencial acima da nota).

**Contratos**
- Cada bender tem contrato de **1 a 3 temporadas** com **salário fixo**: melhorar não aumenta o salário até a renovação.
- Bender sem contrato contratado: salário pedido hoje; **3 temporadas se tiver até 21 anos, 2 nos demais casos**. Comprado de outro time: mantém contrato e salário.
- **Fim de contrato do técnico:** o bender aparece como "Encerrado" na pré-temporada. Pode ser renovado por 1, 2 ou 3 temporadas pelo salário que pede (salário de hoje × (1 + popularidade ÷ 250)). Sem renovação, **sai de graça** ao começar a temporada. Se a saída deixasse o time sem algum elemento, não dá para começar a temporada até resolver.
- **IA:** renova quem é útil (até 30 anos e até 6 pontos abaixo do pior titular, ou até 32 anos e no nível do pior titular, ou o único do elemento); libera o resto para o mercado.

**Mercado e IA**
- O mercado sempre tem pelo menos **2 promessas** de 17 a 19 anos e 2 benders de cada elemento.
- A IA às vezes aposta numa promessa (até 21 anos, potencial perto da nota do time) e repõe com benders sem contrato quem se aposentou ou saiu.

**Equilíbrio de longo prazo** (9 temporadas simuladas): nota média dos times da Primeira Divisão estável entre 67 e 69; a Segunda sobe de ~57 para ~64 e se aproxima; idade média se estabiliza perto dos 28 anos; aposentadorias começam por volta da 4ª temporada.

## 7. Treino e energia

**Calendário da semana** (v0.16) ✅
| Dia | O que acontece |
|---|---|
| Segunda | O técnico decide: treino de quarta (ou descanso) de cada bender e até 1 evento por bender. Dia livre. |
| Terça, quinta, sexta, sábado | Os eventos da semana, cada um no seu dia (sorteado toda semana). Quem não tem evento no dia tem o dia livre. |
| Quarta | Treino (ou descanso). |
| Domingo | Jogo. |
- Fluxo: na segunda, o botão **Avançar para domingo** roda a semana (segunda a sábado) para todos os times. No domingo a Central mostra **Como foi a semana** (ganhos do treino, eventos, lesões, quem assumiu como titular) e o técnico ainda pode mexer na escalação antes de **Ir para a partida**. Depois do jogo começa a nova segunda. **Simular rápido** faz tudo de uma vez.
- A grande mudança: **o treino e os eventos acontecem antes do jogo da mesma semana**. Até a v0.15.1, o plano da semana era aplicado depois da partida e só pesava no jogo seguinte.
- Lesão no treino de quarta já tira o bender do domingo da mesma semana.

**Energia por dia** (v0.16; substitui a tabela semanal abaixo)
| Dia | Efeito |
|---|---|
| Dia livre | recupera 12% do que falta para 100, mais 2 (quanto mais cansado, mais recupera) |
| Quarta: treinar | −22 |
| Quarta: descansar | dia livre + 10 |
| Dia de evento | não recupera; gasta a energia do evento |
| Domingo: jogar | −15 |
| Domingo: reserva que não joga | dia livre |
- Calibrado para manter o equilíbrio de antes: num ciclo **treina 2, descansa 1**, o titular chega ao jogo com energia média de 86 (mínimo 76); antes, 85 (mínimo 70).
- Como a recuperação depende do quanto falta, **o dia do evento importa**: um titular que treina e faz a Exibição na terça chega ao domingo com ~43; no sábado, com ~32. Quem descansa na quarta e faz exibição chega com 100 (terça) ou 92 (sábado). Para titulares, evento é caro; é trabalho para reservas.
- Treinar toda semana não zera mais a energia: estabiliza perto de 68 no dia do jogo, o que já custa caro em quadra (um time com energia 70 venceu 18% contra a cópia de si mesmo descansada, em 60 partidas).
- O ganho do treino usa a energia de antes do treino. O risco de lesão no treino usa a energia de antes do treino, a partir de 60 (antes: depois do treino, a partir de 50, o que dá o mesmo ponto).

**Medição: semana antiga × calendário novo** (3 temporadas, técnico automático treinando 2 semanas e descansando 1, reservas treinando e fazendo exibição)
| | Semana antiga | Calendário novo |
|---|---|---|
| Energia do titular do técnico no jogo | 87,6 | 87,3 |
| Estresse do titular do técnico no jogo | 18,1 | 11,6 |
| Energia do titular da IA no jogo | 80,8 | 80,7 |
| Titulares da IA abaixo de 60 de energia no jogo | 13% | 0% |
| Evolução de atributos por time na temporada | 50,9 | 53,5 |
| Renda de eventos do técnico na temporada | ¥12.300 | ¥11.700 |
- O estresse no jogo cai porque o descanso de quarta (−14) chega antes do jogo; antes, chegava depois.

**Tipo de treino** (escolhido a cada semana) ✅
- **Equipe:** um único foco para todo o elenco (um atributo, ou todos descansam). É um atalho para quem não quer configurar bender por bender; rende o mesmo que o treino individual.
- **Individual:** cada bender tem o seu foco ou descansa.

**Treino** ✅
- Treinar um atributo aumenta esse atributo. O ganho por semana fica em torno de +0,6 a +2,2, menor quanto mais alto o atributo já está e menor se o bender estiver cansado.
- Atributos treináveis: Poder, Precisão, Agilidade, Firmeza, Disciplina, Leitura de jogo.
- Temperamento não se treina.

**Energia: modelo semanal antigo** (até a v0.15.1, guardado como referência) (0 a 100)
| Ação | Efeito |
|---|---|
| Recuperação natural (todos, toda semana) | +10 |
| Jogar uma partida | −15 |
| Treinar | −10 |
| Descansar | +35 |
| Ficar na reserva sem jogar | +8 |

- Com esses valores, **treinar 2 semanas e descansar 1** mantém a energia estável. Treinar toda semana derruba ~15 por rodada: é possível, mas o titular chega cansado ao fim da temporada.

- Energia baixa reduz o rendimento em quadra: com energia 100 o bender rende 100%; com energia 0, rende 78%.
- Até a v0.15.1, os planos de treino da semana eram aplicados depois da partida da rodada. Desde a v0.16, antes (ver o calendário acima).

**Instalações** (centro de treino, centro médico), que aumentam o ganho de treino ou a recuperação. 💡

---

## 7b. Popularidade e eventos

✅

**Popularidade (POP)**, atributo de cada bender, de 0 a 100.
- **Inicial:** depende da nota (benders melhores são mais conhecidos), com um pouco de acaso; explosivos começam um pouco mais populares.
- **Sobe por partida jogada:** +0,6 por jogar, +1 se o time vencer, +0,4 por empurrão de zona causado, +1 por rival derrubado na água.
- **Sobe com eventos** (ver abaixo). **Cai 1 por semana** para quem fica na reserva sem jogar.
- **Explosivos ganham popularidade mais rápido:** +1% de ganho por ponto de temperamento acima de 50 (temperamento 90 = +40%).
- A popularidade do bender é **individual**; o time tem a sua própria (abaixo).

**Efeitos da popularidade**
| Onde | Efeito |
|---|---|
| Eventos | a renda cresce com a popularidade do bender |
| Valor de mercado | × (1 + popularidade ÷ 150) |
| Luvas para contratar | × (1 + popularidade ÷ 200) |

**Popularidade do time** (0 a 100), separada da dos benders. ✅
- **Inicial:** Primeira Divisão entre ~40 e ~75, conforme a força do time; Segunda Divisão entre ~12 e ~45.
- **Muda com** (por partida e por evento, valores × 0,5 desde o turno e returno): vitória +1,5 (+0,8 se for por nocaute), derrota −1,2, cada evento feito por um bender do time +0,3, semifinal +3, chegar à final +4, título +8, acesso +10, rebaixamento −10.
- **Expectativa dos patrocinadores:** valores das propostas × (0,85 + popularidade × 0,004), ou seja, popularidade 20 ≈ ×0,93 e 60 ≈ ×1,09. As **metas ficam mais exigentes**:
  | Popularidade do time | Propostas |
  |---|---|
  | abaixo de 35 | fácil, fácil, média, difícil |
  | 35 a 65 | fácil, média, média, difícil |
  | acima de 65 | média, média, difícil, difícil |
- **Arquibancada:** a lotação do lado de cada time vai de 35% (popularidade 0) a lotada (100).
- **Cobrança da torcida:** quanto mais popular o time, mais uma derrota estressa os benders (ver Estresse).

**Eventos da semana**: desde a v0.16, além do treino de quarta, cada bender pode fazer até 1 evento por semana, no dia do evento (terça, quinta, sexta ou sábado, sorteado a cada semana); antes, o evento ocupava o lugar do treino. Rende dinheiro e popularidade, custa energia e **não evolui atributos**. A **Exibição na praça** está sempre disponível (com 2 vagas desde a v0.15: com elenco de até 9, vagas livres viravam renda fácil com os reservas, de ¥5 mil para ¥20 a 36 mil por temporada na Primeira); outros **2 eventos** sorteados aparecem a cada rodada. Alguns exigem popularidade mínima e têm vagas limitadas. Renda = (base + valor por ponto × popularidade) × multiplicador da divisão (60% na Segunda).

| Evento | Requisito | Vagas | Base | Por ponto de POP | Energia | POP |
|---|---|---|---|---|---|---|
| Exibição na praça | — | 2 | ¥200 | ¥6 | −8 | +2 |
| Comercial de rádio | POP 40 | 1 | ¥600 | ¥20 | −6 | +3 |
| Sessão de autógrafos | POP 25 | 2 | ¥300 | ¥14 | −8 | +2 |
| Evento beneficente | — | 2 | ¥0 | ¥0 | −10 | +6 |
| Festival da Cidade República | POP 50 | 3 | ¥500 | ¥18 | −14 | +4 |
| Entrevista ao jornal | POP 30 | 1 | ¥200 | ¥8 | −3 | +3 |
| Aula numa escola de dominação | — | 1 | ¥400 | ¥4 | −10 | +3 |

- No **treino em equipe**, o foco vale só para a quarta; os eventos são escolhidos bender a bender (v0.16).
- **Calendário como quadro de eventos** (v0.16.6): a faixa da semana no topo da aba Treino é onde se arrasta: cada dia de evento mostra o nome do evento, etiquetas curtas (renda, energia gasta, vagas ocupadas, popularidade mínima, se exige o físico) e as fichas dos benders escalados. Logo abaixo fica o quadro "Sem evento". O bloco separado de cartões de evento, embaixo da tabela, saiu.
- **Arrastar e soltar** (v0.16.1): na aba Treino, os benders aparecem como fichas no quadro "Sem evento · descansam nos dias livres". O técnico arrasta a ficha até o cartão do evento (com o dia, a renda, o custo de energia e as vagas). Quem não é arrastado para nenhum evento descansa nos dias livres. Para tirar, arraste de volta ou clique no ×. Se não puder (popularidade abaixo do mínimo, sem vaga, lesionado em evento que exige o físico), o cartão fica vermelho durante o arraste e uma mensagem explica o motivo. A coluna de evento saiu da tabela de treino. Funciona com mouse e com toque.
- Se o bender não cumprir o requisito ou não houver vaga quando a semana for processada, ele descansa.
- Times da IA não fazem eventos (renda simplificada); a popularidade dos benders deles muda só pelas partidas.
- **Referência medida:** uma Exibição na praça paga mais ou menos o salário de um bender mediano; eventos especiais pagam bem mais para quem é popular. Numa temporada, um time que usa eventos com moderação arrecada cerca de ¥9.000 na Primeira Divisão e ¥4.500 na Segunda.

## 7c. Estresse

✅

Cada bender tem **estresse** de 0 a 100.

**O que aumenta** (por semana; todo ganho é multiplicado pelo temperamento: × (0,6 + temperamento × 0,009), ou seja, calmo 20 ≈ ×0,78 e explosivo 90 ≈ ×1,41)
| Fonte | Estresse |
|---|---|
| Jogar a partida | +4 |
| Derrota | +4, mais até +6 conforme a popularidade do time (pressão da torcida) |
| Cada meta de patrocínio ainda em aberto (só no time do jogador) | +1,5 |
| Treinar | +2 |
| Fazer um evento | +1 |

**O que alivia** (v0.16: por dia; descanso na quarta −14, cada dia livre −0,8, reserva que não joga −3 a mais no domingo. A tabela abaixo é o modelo semanal antigo.)
| Fonte | Estresse |
|---|---|
| Descansar | −15 |
| Vitória | −3 |
| Ficar na reserva sem jogar | −4 |
| Recuperação natural, toda semana | −4 (era −3; com 14 rodadas o estresse acumulava demais) |

**Efeitos**
- Em quadra, o estresse reduz os **atributos mentais** (Precisão, Disciplina, Leitura de jogo) em até **25%** com estresse 100, e os físicos em até 8%. Disciplina menor gera mais faltas.
- **Acima de 60**, o bender passa a ignorar instruções com mais frequência, mesmo as que combinam com o temperamento dele (até +20% de chance com estresse 100).
- Os times da IA descansam quem passa de 60 de estresse.

**Referência medida** (titulares, uma temporada): treinando toda semana, o estresse chega a ~70; treinando 2 semanas e descansando 1, fica abaixo de ~25.

## 8. Atributos dos benders

Os atributos vão de 35 a 99. ✅

| Atributo | O que faz |
|---|---|
| **POD · Poder** | Força do golpe: o quanto empurra o rival. |
| **PRE · Precisão** | Mira e antecipação do movimento do alvo. Também dificulta a esquiva do rival. |
| **AGI · Agilidade** | Velocidade, chance de esquiva e ritmo de ataque. |
| **FIR · Firmeza** | Aguenta golpes sem ser empurrado. No dominador de terra, também dá chance de bloquear com um disco. |
| **DIS · Disciplina** | Evita faltas (pisar além da linha da zona, golpe acima dos ombros). |
| **LEI · Leitura de jogo** | Escolhe melhor o alvo, reage mais rápido e antecipa golpes para esquivar. |
| **Temperamento** (0 calmo a 100 explosivo) | Puxa a postura do bender para o seu jeito natural (65% a ordem do técnico, 35% o próprio jeito). Faltas × (0,8 + temperamento × 0,004). **Em quadra (v0.13):** com o time atrás (rounds, território) ou o próprio bender empurrado para trás, o **explosivo esquenta** (acima de 55: até +5% de empurrão e ataques 5% mais rápidos); sem estar atrás, o **calmo fica frio** (abaixo de 45: até +4% de esquiva). Medido contra neutros (50): explosivo 85 vence 55% (antes 35%); calmo 15 vence 56% (antes 60%). |
| **Nota** | Média ponderada dos atributos, pesando mais os que mais decidem partidas: Poder 1,25 · Firmeza 1,2 · Agilidade 1,1 · Precisão 1,0 · Leitura 0,85 · Disciplina 0,6. |

**Tendência por elemento:** a terra nasce com mais Firmeza e menos Agilidade; o fogo, com mais Agilidade e menos Firmeza.

**Impacto medido** (time com +15 no atributo contra um time igual, ~50% de base): Poder ~70%, Firmeza ~65%, Agilidade ~63%, Precisão ~63%, Disciplina ~55%. Leitura tem efeito moderado: Leitura 90 contra 50 vence ~58%.

---

## 9. Partida (simulação)

✅ tudo nesta seção.

**Regras de dominação profissional**
- 3 contra 3: um dominador de água, um de terra e um de fogo por time.
- Cada lado da arena tem 3 zonas; todos começam na Zona 1.
- Quem é empurrado para trás **não pode voltar** à zona anterior.
- Se o time inteiro recua, o rival **avança uma zona**.
- Quem cai pela borda do fundo cai na água e está fora do round. Derrubar os três é **nocaute** e encerra a partida na hora.
- Rounds de 3 minutos, melhor de 3.
- Vence o round quem avançou mais. Se a linha estiver no centro, vence quem tem os jogadores mais à frente. Empate total vira **duelo 1 contra 1** numa plataforma circular no centro.
  - **Escolha do duelista** (v0.13.1): antes do duelo abre uma janela e o técnico escolhe um dos benders que estavam em quadra. Quem caiu na água no round aparece apagado, riscado e com a faixa "Caiu na água", e não pode ser escolhido. O técnico da IA (e as partidas simuladas ou puladas) escolhe o mais forte em Poder + Agilidade + Precisão entre os que não caíram.
- **Faltas** (pisar além da linha, golpe acima dos ombros) mandam o infrator uma zona para trás. ✅
  - **Infrator já na Zona 3** (v0.11.2): quem recua é o **aliado mais à frente** (o vivo, em quadra, com a zona mais avançada).
  - **Time inteiro na Zona 3** (todos os que estão em quadra): o infrator é **suspenso por 20 segundos**. Ele fica fora da ação (não ataca, não se move e não pode ser atingido; aparece apagado na arena e com "Suspenso" no painel) e volta sozinho quando cumpre o tempo. A suspensão termina junto com o round. Um suspenso não conta como caído para o nocaute.
  - Antes, uma falta na Zona 3 virava só uma advertência sem efeito. Em 200 partidas simuladas, a suspensão aconteceu 38 vezes (1 a cada ~5 partidas).

**Elementos**
| Elemento | Estilo |
|---|---|
| Fogo | Ataque rápido e fraco, às vezes em rajada dupla. |
| Água | Velocidade média; o disparo curva atrás do alvo. |
| Terra | Lento, mas empurra muito; pode bloquear com um disco. |

**Alcance** ✅: a força do golpe muda com a distância percorrida pelo projétil.
| Elemento | Até 40 de distância | A partir de 240 | Posicionamento da IA |
|---|---|---|---|
| Fogo | ×0,6 | ×1,4 | joga mais recuado e prefere alvos distantes |
| Água | ×1,0 | ×1,0 | neutro |
| Terra | ×1,4 | ×0,6 | encosta na linha e prefere alvos próximos |

Entre 40 e 240 a força muda de forma gradual. O tamanho do projétil na tela acompanha a força (a bola de fogo cresce, o disco de terra encolhe). Quem é empurrado para trás fica mais longe, então o fogo é bom para terminar o serviço. A força geral foi recalibrada (multiplicador 0,48) para manter ~19% de nocautes.

Ataques de times opostos que se chocam no ar se anulam.

**Táticas do técnico** ✅ (só mudam no intervalo antes de cada round; durante o combate ficam travadas)

- **Postura:**
  - Agressiva: joga mais à frente, ataca com mais frequência, esquiva menos, comete mais faltas.
  - Equilibrada.
  - Defensiva: joga mais recuada, ataca menos, esquiva e bloqueia mais, comete menos faltas.
- **Escolha de alvo:**
  | Opção | Comportamento |
  |---|---|
  | Leitura do bender (antes "IA decide", v0.13) | cada bender escolhe sozinho e a Leitura decide: vulnerabilidade × LEI × 2, preferência de distância do elemento × LEI, distração com quem está perto quando LEI < 70, acaso × (1,05 − LEI)^1,4 × 2,2. Medido contra Foco no vulnerável com o mesmo elenco: LEI 75 vence 59%, LEI 60 vence 55%, LEI 45 vence 35% |
  | Foco no mais vulnerável | todos no rival mais perto de ser empurrado ou de cair |
  | Duelo de elementos (v0.13) | jogo defensivo: ataca o mais vulnerável, mas 25% mais devagar; quando um ataque rival chega a menos de 90 do alvo, o bender livre mais próximo (até 230) tenta rebatê-lo no ar: chance 0,14 + PRE × 0,002 + LEI × 0,001, com 0,7 s de espera por bender. Medido: ~400 ataques rebatidos por partida, empurrões dos dois lados caem pela metade, nocautes caem para ~8%; vence 54% contra Leitura do bender e 54% contra Foco no vulnerável. O técnico da IA defensivo usa quando está ganhando |
  | Foco no mais perigoso | prioriza o rival com mais Poder |
  | Foco no mais próximo | prioriza quem está mais perto |
  | Caçar a estrela | prioriza o rival com os melhores atributos |

  As três últimas misturam o critério com a leitura de quem está vulnerável, para não virarem escolhas às cegas.
- **Formação: pedra, papel e tesoura** (v0.12). **Segredo de design (v0.12.2): o jogo não explica as vantagens em lugar nenhum.** O Guia descreve só o que cada formação faz e avisa que cada uma se sai melhor contra umas do que contra outras; descobrir qual vence qual é parte da graça. **Compacta vence Escalonada, Escalonada vence Aberta, Aberta vence Compacta.** A formação do rival **não aparece em lugar nenhum** (nem na narração, nem no resumo do round, nem na observação do rival, nem no relatório da partida): o técnico a reconhece só pelo desenho do time na arena e pelo mapa de calor do resumo do round. (v0.12.1)
  | Formação | Identidade | Vence | Contra-ataque |
  |---|---|---|---|
  | Aberta (cerco) | ocupa toda a largura | Compacta | golpes de lado: +8% de empurrão e respingo de 90% (em vez de 60%) em quem está colado |
  | Compacta (bloco) | 55% da largura; tende a atacar o mesmo alvo (+0,02); sofre respingo de 60% do empurrão em quem está a menos de 34 | Escalonada | ataque concentrado anula os +14 de Firmeza da âncora, e +3% de empurrão |
  | Escalonada (muralha) | âncora (terra, ou quem tem mais FIR) 14 à frente, +14 de FIR, ataca 20% mais devagar (não comete mais faltas extras); os outros 10 atrás, +5% de esquiva | Aberta | +6% de empurrão em quem está isolado na largura |
  - **Medido** (120 partidas por confronto, mesmos times trocando de lado): Compacta × Escalonada **62%**, Escalonada × Aberta **60%**, Aberta × Compacta **65%**. Sem os contra-ataques as três ficam perto de 50% entre si.
  - **Pior caso:** a formação em desvantagem com a melhor mistura de instruções (terra Pressionar, fogo Manter distância, água Proteger) vence só 25% a 33%. Instrução não vira o confronto de formação.
  - **Desenho na arena** (medido): Compacta ocupa ~82 de largura; Aberta ~129; Escalonada ~116, com o da frente ~34 à frente dos outros (Aberta ~16). São essas diferenças de desenho que o técnico precisa perceber.
- **Instruções individuais** (os três benders podem receber instrução em todo intervalo):
  | Instrução | Efeito |
  |---|---|
  | Pressionar | 8 mais à frente, prefere alvos próximos, ataca 5% mais rápido; custo: −5% de esquiva e 2,5× faltas de linha |
  | Manter distância | prefere alvos distantes, balança mais de lado, +10% de esquiva; custo: ataca 5% mais devagar (não recua mais: o recuo era a punição escondida) |
  | Mais agressivo / Mais cauteloso | puxa a postura daquele bender para Agressiva ou Defensiva |
  | Proteger | +10% de esquiva; na terra, tenta interceptar com um disco os ataques que vão num companheiro próximo; custo: ataca 5% mais devagar (não recua mais) |
  | Marcar [rival] | ataca só aquele rival enquanto ele estiver em quadra |
  - **Vantagens por elemento (v0.21):** cada elemento tem duas instruções com um bônus próprio, para nenhuma combinação parecer "a certa":
    | Elemento | Instrução | Bônus |
    |---|---|---|
    | Terra | Pressionar | finca o pé: +6 de firmeza contra empurrões |
    | Terra | Proteger | disco que intercepta ataques num companheiro próximo (já existia) |
    | Fogo | Pressionar | rajada em 45% dos ataques (padrão 35%); a recarga fica só ×1,05 em vez do bônus de velocidade normal |
    | Fogo | Manter distância | empurrão ×1,1 |
    | Água | Manter distância | o ataque persegue o alvo ×1,8 |
    | Água | Proteger | jato que rebate ataques leves (empurrão até 200) num companheiro a até 80: 18% + Precisão×0,2% |
  - O Guia deixou de dizer "Combina com a terra/fogo" e passou a descrever o bônus de cada elemento, sem números.
  - **Medido** (300 partidas, contra time Padrão): terra Pressionar 52%→54%, fogo Pressionar 64%→53%, fogo Distância 46%→48%, água Proteger 52%, água Distância 48%, água Pressionar 49%. A antiga "meta" (terra Proteger + fogo Distância) fica em 54%, e terra Pressionar + fogo Pressionar ou fogo Pressionar + terra Proteger vencem a meta 61%/60%.
  - ~~Ponto em aberto (v0.21):~~ terra Pressionar + fogo Pressionar vencia 63% contra Padrão e nenhuma mistura passava de 50% contra ela. Resolvido na v0.22.
  - **Manter distância pune quem pressiona (v0.22):** golpe de um bender em Manter distância num bender em Pressionar empurra ×1,15, e quem pressiona esquiva 3% a menos contra ele (v0.22 lançou com ×1,25 e −5%; suavizado na v0.22.1). Não aparece no Guia (o jogador descobre jogando). Medido (300 partidas) contra terra + fogo pressionando: terra Proteger + fogo e água Distância 44%→57%; água + fogo Distância 43%→51%; a antiga meta 39%→45%. A dupla pressionando contra Padrão continua 63% (Padrão não joga à distância). Com ×1,4 e −8% passava do ponto (72%).
  - **Matriz de cenários (v0.22.1, 200 partidas, margem ±7):** cada vantagem contra Padrão com os dois times no mesmo cenário:
    | Cenário | Terra press | Terra prot | Fogo press | Fogo dist | Água dist | Água prot |
    |---|---|---|---|---|---|---|
    | Compacta | 54 | 58 | 61 | 49 | 51 | 51 |
    | Escalonada | 34 | 54 | 52 | 53 | 57 | 51 |
    | Agressiva | 58 | 56 | 56 | 51 | 48 | 51 |
    | Defensiva | 56 | 44 | 60 | 49 | 51 | 48 |
    | Duelo de elementos | 44 | 49 | 44 | 56 | 47 | 52 |
    | Foco no mais próximo | 57 | 63 | 49 | 52 | 52 | 54 |
    - Terra + fogo pressionando contra Padrão: 59–66% em quase todos os cenários; 47% na Escalonada; 36% com Duelo de elementos. Três segurando (terra Proteger + fogo e água Distância) contra Padrão: 47–52% (59% com Foco no mais próximo). A antiga meta contra Padrão: 48–56% (62% com Foco no mais próximo). Nada que protege ficou dominante.
    - Com ×1,25 a punição passava do ponto fora da Aberta: três segurando contra a dupla pressionando 71% na Escalonada e 75% com Foco no mais próximo (sem a regra: 59% e 50%). Com ×1,15 e −3%: Aberta 53%, Escalonada 61%, Foco no mais próximo 62%.
    - **Pontos em aberto:** terra Pressionar na Escalonada fica fraca (34%; já era 39% antes das vantagens); terra Proteger com Foco no mais próximo fica forte (63%; essa escolha de alvo já era forte); fogo Pressionar oscila entre 52% e 61% conforme o cenário (reduzir a rajada para 40% não mostrou efeito claro dentro da margem).
  - **Ciclo resultante:** pressionar vence quem protege (meta 39–45%); proteger/distância com os três elementos vence quem pressiona (57%); Padrão perde para quem pressiona (37%).
  - **Mesma instrução nos três** (qualquer uma, menos "sem instrução"): o time fica **previsível** naquele round: −18% de esquiva e ataques 8% mais lentos. Só o próprio time é avisado (narração, painel do intervalo e resumo do round); nada é dito sobre o rival.
  - **Medido** (contra time sem instrução): uma instrução num bender fica entre 43% e 49%; a mistura terra Pressionar + fogo Manter distância + água Proteger dá 50%; os três iguais perdem: Pressionar 37%, Proteger 36%, Manter distância 34%.
- **Obediência:** uma instrução que contraria o temperamento pode ser **ignorada no round inteiro**. Explosivos resistem a Mais cauteloso, Manter distância e Proteger; calmos resistem a Mais agressivo e Pressionar. A chance é 0 até 15 pontos do centro (50) e chega a 45% nos extremos (explosivo 90 mandado ser cauteloso: ~32%). Quem desobedece joga do próprio jeito (explosivo fica agressivo, calmo fica cauteloso). A tela mostra o risco antes de confirmar e avisa quando acontece.
- **Menos texto (v0.25 em diante):** informação em etiquetas com ícone e blocos, em vez de frases; nenhuma informação sai, só muda de forma. Ícones desenhados no traço da interface (não emoji), com o nome ao passar o mouse: divisão, temporada/rodada, posição, nota, popularidade (estrela), reputação (medalha), diretoria (escudo), energia (raio), estresse (pulso), faltas (apito), caixa.
  - **Central (v0.25):** subtítulo do cabeçalho em etiquetas (divisão, T·rodada, posição e campanha, nota, popularidade, reputação, confiança com barrinha); Observação do rival com o técnico e o estado dos titulares em etiquetas e o elemento só como ícone; relatório da partida com Destaque/faltas em etiquetas e cada round numa linha (R1 · Venceu/Perdeu · motivo · sua tática); dinheiro da rodada em blocos.
  - **Partida (v0.25.1):** painéis laterais com números e ícones (acertos e precisão, empurrões, derrubou na água, esquivas, bloqueios, faltas) e sem a palavra do elemento (o ícone já mostra); Preparação sem a palavra do elemento; resumo do round com o placar em etiqueta (sai a frase de instrução do topo), o quadro "Instruções no round" com ícone + número (rajadas, faltas de linha, golpes recebidos, esquivas, acertos/ataques, desviados/rebatidos) e as leituras com um ícone por tipo no lugar do marcador e frases mais curtas.
  - **Elenco, Treino e Finanças (v0.25.2):** explicações longas saem da tela e vão para um "?" ao lado do título (abre o texto ao clicar): Escalação, Semana, tipo de treino e Folha salarial. Nas tabelas da central, o elemento aparece só como ícone (o nome fica ao passar o mouse). Vagas do elenco e totais da folha viram etiquetas no título; Diretoria em etiquetas (expectativa e confiança com barrinha); Finanças em blocos; eventos da semana com ícones (renda ¥ + ¥/★, energia, vagas, popularidade mínima) e as fichas dos benders com ícones de energia e popularidade no lugar de ⚡ e ★.
  - **Pré-temporada, Classificação e ficha (v0.25.3):** Patrocínios com "assinados x/2" e popularidade em etiquetas no título e a explicação no "?"; quadro da temporada em etiquetas (resultado da anterior, expectativa); Mercado com o orçamento em etiquetas (elenco, caixa, folha, patrocínios, saldo fixo) e as explicações (luvas, regra do vendedor, "cabe no orçamento", renovação 1T/2T/3T) no "?"; Classificação com legenda em etiquetas (semifinais, acesso, queda; detalhe ao passar o mouse); ficha do bender com idade, temperamento e popularidade em etiquetas, energia e estresse com ícones e a explicação da evolução no "?". O Guia continua em texto: é o lugar das explicações.
  - **Guia (v0.25.4):** a antiga aba Atributos (21 verbetes) vira três abas: **Atributos** (os seis, Temperamento, Nota), **O bender** (Energia, Estresse, Lesão, Idade, Limite de evolução, Popularidade do bender, Salário e contrato) e **Time e carreira** (Semana, Eventos, Elenco e banco, Popularidade do time, Reputação, Confiança da diretoria), além de Táticas da partida. Cada termo tem o mesmo ícone usado nas telas. Os textos não mudaram (continuam sem números).
  - **Telas restantes (v0.25.6):** fim de temporada com Sobem/Caem em etiquetas (nome de cada time na cor dele), reputação e os motivos em etiquetas, propostas de técnico com divisão, nota, caixa, popularidade e objetivo em etiquetas e as explicações no "?"; desempate com uma frase só (quem caiu na água já aparece marcado no cartão) e sem a palavra do elemento; janela da semana com ícones em Energia, Estresse e Popularidade.
- **Retorno neutro das instruções (v0.23):** o jogador vê o ganho e o custo típicos da própria instrução, sem veredito e sem nada do rival.
  - **Resumo do round, quadro "Instruções no round":** uma linha por bender do jogador com instrução (Padrão não aparece), com a instrução usada naquele round e "(ignorou)" se desobedeceu. Pressionar: rajadas (fogo) ou ataques, faltas de linha e golpes recebidos. Manter distância: esquivas e acertos de ataques (fogo: também empurrões). Proteger: ataques desviados com o disco (terra) ou rebatidos (água), esquivas e ataques próprios. Mais agressivo/cauteloso e Marcar: ataques, esquivas e faltas.
  - **Arena:** aviso curto e claro (sem cor de bom/ruim) sobre o bender do jogador quando a instrução age: "rajada" (fogo pressionando), "disco" (terra protegendo um companheiro), "rebate" (água protegendo); no máximo um a cada 5 segundos por bender. A falta de linha continua com o alerta FALTA. Firmeza da terra, empurrão do fogo à distância e ataque da água que persegue não têm aviso.
  - Novas estatísticas na simulação: rajadas, proteções (disco/rebate) e faltas de linha.
- **Técnico da IA lê o hábito do jogador (v0.22):** a liga guarda as escolhas dos últimos 12 rounds que o jogador jogou (formação e instrução de cada elemento). Antes da partida o técnico rival recebe um resumo: o que o jogador repetiu em pelo menos metade desses rounds (a partir de 3 rounds). Quanto mais repetido, mais chance de ele preparar a resposta, multiplicada pela leitura do técnico: Primeira 0,9, Segunda 0,75, Terceira 0,6.
  - Dois ou mais elementos pressionando → a IA joga terra Proteger + fogo e água Distância.
  - Dois ou mais elementos em Proteger/Distância → a IA joga terra + fogo Pressionar.
  - Formação repetida → no round 1 a IA já entra com a formação que a vence (depois segue a regra de ler a arena).
  - Nada é dito ao jogador; quem varia não dá hábito para ler.
  - **Medido** (200 partidas, mesma tática nos 12 rounds, técnico da Primeira): pressionar sempre 56%→34% na v0.22 e 42% na v0.22.1; meta sempre 56%→47%; Compacta sempre 42%→39%.
- **Técnico da IA:** depois de perder um round, em 70% das vezes troca para a formação que vence a do rival (v0.12). Também escolhe postura, formação e instruções conforme o estilo e o placar (estilo agressivo: escalonada e terra pressionando; equilibrado: compacta; defensivo: aberta e terra protegendo; perdendo: mais agressivo e compacto).
- **Equilíbrio medido** (time com a opção contra time igual na opção padrão, ~50%): a maioria das opções fica entre 44% e 56%. Compacta e Foco no mais próximo estão um pouco fortes (~60%); Duelo de elementos está mais fraco (~35%).

**Arenas**
- **Redonda:** mais larga no meio e mais estreita nas bordas do fundo. Quem está na Zona 3 tem menos espaço para se mexer. Tem menos nocautes (~13% das partidas).
- **Quadrada:** retangular. Tem mais nocautes (~23% das partidas).
- As duas ficam suspensas sobre a água, então a queda é uma queda de verdade.

**Ritmo** (valores medidos em centenas de partidas simuladas)
- ~20% das partidas terminam em nocaute.
- ~12% dos rounds vão para o duelo de desempate.
- ~4 empurrões de zona por round.

---

## 9b. Informação para o técnico

✅

**Observação do rival** (na Central, junto da próxima partida, e na partida pelo botão **Rival**)
- Últimos 5 resultados do rival na temporada.
- Tendência do técnico rival, conforme o estilo: postura inicial, instruções típicas e o que faz quando está perdendo (sem a formação, desde a v0.12.1).
- Energia e estresse médios dos titulares do rival e do seu time.
- Titulares do rival com nota, Poder, Firmeza, Agilidade, temperamento, energia e estresse; marcados o **mais perigoso** (maior Poder) e a **estrela** (maior nota).

**Resumo do round** (no intervalo da partida, v0.11) ✅
- Abre sozinho no intervalo antes do round 2 e do round 3; o botão **Resumo do round** reabre, "Ver a arena" fecha e "Começar round" segue o jogo. Tem atalho para o **Guia**.
- **Mapa de calor** de cada time: onde os benders passaram o round (grade de 30 × 10 sobre a arena, amostrada a cada 0,25 s), com as zonas e a linha do centro.
- **Território ao longo do round:** gráfico da linha de frente (em zonas) do ponto de vista do seu time.
- **Comparação do round:** acertos, precisão, empurrões, derrubadas na água, esquivas, bloqueios e faltas, seu time contra o rival.
- **Leituras do round:** até 4 observações tiradas dos números (bender mais empurrado, rival que mais empurrou, faltas, precisão baixa, desobediência), cada uma com uma sugestão de instrução.
- **Tabela** de cada bender no round: acertos (precisão), empurrões, derrubadas, vezes que foi empurrado, esquivas e faltas.

**Relatório da sua partida** (nos resultados da rodada, tanto jogando quanto em "Simular rápido")
- **Destaque** da partida: pontuação = empurrões × 5 + quedas causadas × 10 + acertos × 0,03 + bloqueios × 0,02 + esquivas × 0,01 − faltas × 2 (acertos, bloqueios e esquivas são muito numerosos e pesam pouco).
- **Round a round:** quem venceu e como, e a tática **do seu time** naquele round (a do rival não aparece, v0.12.1) (postura, formação, escolha de alvo e instruções individuais).
- **Estatísticas** de cada bender dos dois times: acertos, precisão, empurrões, quedas causadas, esquivas, bloqueios, faltas, desobediências e estado de estresse.
- **Alertas:** muitas faltas do seu time (3 ou mais), desobediências e benders que jogaram estressados (50 ou mais).
- **Guia em janela** (v0.11): na primeira vez que o técnico entra no jogo, o conteúdo da aba Guia abre numa janela, com o aviso de que ele fica sempre na aba Guia. O botão Guia da partida abre a mesma janela. ✅
- **Guia (aba da central):** atributos, estados do bender e uma seção **Táticas da partida** que explica cada postura, escolha de alvo, formação e instrução individual, além da desobediência. ✅
  - **Abas** (v0.16.3): o Guia tem as abas **Atributos** e **Táticas da partida**; dentro das táticas, **Postura do time** e **Instruções** (escolha de alvo, formação e instruções individuais). Saíram o texto de temperamento da postura (o temperamento continua explicado em Atributos) e o de desobediência. A janela do Guia (primeira entrada e botão Guia na partida) tem as mesmas abas.
  - **Sem números** (v0.16.2): o Guia explica o que cada coisa faz, nunca quanto. Nenhum número aparece (nem percentuais, faixas ou limites), e as explicações não dizem como os valores mexem nas estatísticas. Os números ficam neste documento.
- **Histórico de temporadas:** ver 6b. 💡 (gráficos de evolução de atributos e caixa)

## 9c. Dicas de primeira vez ✅

- **Abertura** (v0.17): na primeira vez que o jogo abre, antes de tudo (escolha de time, Guia e dicas), aparece a janela **"Sabe como funciona a Dobra Esportiva?"** com um resumo do esporte (times de três benders, um de cada elemento; arena sobre a água com zonas; empurrar para ganhar território; queda na água; vitória por território ou nocaute; melhor de três rounds) e do papel do técnico (elenco, semana, energia e estresse, tática antes de cada round; em quadra, quem joga são os benders). Ao lado do texto, uma partida de verdade roda ao vivo num campo visto de cima (benders com a forma do elemento e a cor do time, ataques, linha de território), recomeçando sozinha, em velocidade normal (1x, desde a v0.17.1; antes rodava em 2x). O botão **Vamos lá** fecha a janela, e ela não volta (fica salvo neste navegador). **Desde a v0.24.1, a abertura é a própria tela de título:** o título, a partida ao vivo e o texto ficam na mesma tela que os botões Novo jogo · Livre, Novo jogo · Carreira, Continuar e Partida avulsa; não há mais janela separada nem botão Vamos lá.

- Na primeira visita, cada página da central (Central, Elenco e treino, Mercado, Patrocínios, Finanças, Classificação, Guia) mostra no topo um quadro curto com o essencial daquela página. O quadro some ao clicar em **Entendi**.
- A dica da **Central** é a de boas-vindas: o caminho de uma temporada (pré-temporada → elenco → semana → partida → fim da temporada) e a barra de confiança.
- A **primeira partida** mostra uma dica sobre rounds, tática entre os rounds e desobediência.
- O que já foi visto fica salvo no jogo. No **Guia**, o botão **Rever dicas** mostra todas de novo.

## 9d. HUD de preparação (v0.14) ✅

Tela que abre antes de cada round (e entre os rounds) por cima da arena. É onde o técnico monta o time; os painéis laterais e a narração ficam escondidos enquanto ela está aberta.
- **Topo:** título (Preparação · Round N), placar em rounds, e os botões Resumo do round (a partir do round 2), Guia, Rival (na liga), Ver a arena e **Começar round**. O botão **Preparação** nos controles reabre a tela.
- **Esquerda:** Postura, Escolha de alvo e Formação (botões com o desenho da formação).
- **Centro:** campo na vertical só com as **Zonas 1, 2 e 3** do seu lado; a linha central fica em cima. Os benders aparecem na Zona 1 com a forma do elemento (círculo, quadrado, triângulo) e a cor do time, na posição em que começam o round, calculada com as mesmas regras da simulação (largura da formação, postura, elemento, âncora da Escalonada, Pressionar). A distância da linha é ampliada para as diferenças ficarem visíveis.
- **Animação:** ao trocar formação, postura ou instrução, cada bender é arrastado até a nova posição (inclina e cresce de leve, deixando um rastro que some).
- **Selo de instrução** sobre o bender: ↑ Pressionar, ↓ Manter distância, + Mais agressivo, − Mais cauteloso, ◆ Proteger, ◎ Marcar. O nome completo fica na lista.
- **Direita (lista):** elemento, nome, nota, energia (barra), estresse (barra), instrução individual e o risco de desobediência. Aviso quando os três estão com a mesma instrução.
- Não mostra nada da formação do rival.
- **Substituição arrastando** (v0.16.1): arraste um reserva do banco para o campo (em qualquer ponto, ou sobre o boneco ou a linha de quem sai) e ele entra no lugar de quem é do mesmo elemento; também dá para arrastar quem está em quadra até a linha de um reserva. O campo fica com contorno dourado quando a troca vale. O botão "Entra ⇄" continua como alternativa.
- **Banco** (v0.15): abaixo dos três em quadra, os reservas sadios com elemento, nome, nota, energia e estresse, cada um com o botão "Entra ⇄ [quem sai]" (sempre do mesmo elemento). Ao trocar, o boneco de quem sai desce e some e o de quem entra cai no lugar dele. Quem se lesionou na partida aparece com o selo "Lesionado" na lista e um contorno vermelho no campo.

## 10. Visual

✅
- **Câmera:** arena reta, da esquerda para a direita, com a câmera a **15°** em relação ao chão (bem de lado).
- **Protótipo:** formas geométricas simples. Água é cilindro, terra é cubo e fogo é pirâmide; a cor do time aparece no topo e num anel no chão.
- **Cenário:** plataforma suspensa sobre a água, com pilares, cordas laterais, bandeira na linha de frente, arquibancada com torcida que reage aos lances e camarote dos juízes.
- **Tela da partida em tela cheia** (v0.8): a arena ocupa a tela toda e as informações ficam num HUD por cima dela.
  - **Topo, ao centro:** placar (times, rounds vencidos, relógio, território).
  - **Cantos de cima:** um painel por time, do lado em que o time joga na arena.
    - **Seu time:** postura, escolha de alvo, formação e instruções individuais (só aparecem no intervalo; durante o round o painel encolhe), além dos atributos e das estatísticas da partida.
    - **Adversário:** só os benders, a zona, os atributos (no intervalo) e as estatísticas da partida. **Não mostra postura, escolha de alvo, formação nem instruções.**
  - **Canto inferior esquerdo:** narração como um chat (a mensagem mais nova embaixo; se o técnico rolar para cima para ler, a rolagem não pula).
  - **Canto inferior direito:** controles (começar/pausar, velocidade, pular para o resultado, som, Regras). As regras, a legenda e o laboratório (partida avulsa) abrem num painel por cima.
  - Na partida avulsa, os dois times são do técnico, então os dois painéis têm os controles.
  - Cada painel de time tem um botão para **minimizar** (fica só o nome) e expandir; a escolha é lembrada neste navegador. Ajuda em telas menores. (v0.11)
  - O painel **Regras** mostra só as regras da partida (zonas, quedas, rounds, alcance, faltas) e a legenda; atributos, táticas e instruções ficam no Guia. (v0.11.1)
  - Botões **Guia** (abre o guia em janela e pausa a partida) e **Rival** (observação do rival, só na liga). (v0.11)
- **Tipografia:** títulos e destaques em Big Shoulders Display; textos em Work Sans. (Uma fonte pixel art própria foi testada na v0.9 e deixada de lado por enquanto.)
- **Futuro:** pixel art, com o Teamfight Manager 2 como referência visual. Os sprites só precisam olhar para um lado (o outro é espelhado). 💡

---

## 11. Ideias para depois

💡
- Instalações e equipe técnica (treinador, olheiro, médico).
- Olheiros para descobrir benders e revelar atributos escondidos.
- Moral e confiança dos benders (o estresse já cobre parte disso).
- Multa por quebra de contrato.
- Lesões.
- Mais escolhas táticas e golpes especiais por elemento.
- Pixel art e animações.

---

## 12. Questões em aberto

- Torcida/fama como fonte de renda (bilheteria) no futuro?


---

## 12c. Equilíbrio com três divisões (03/11/2026)

Simulação de carreiras de 8 temporadas começando na Terceira:
- **Problema encontrado:** a renda da IA acompanhava a própria folha, então um time da Terceira sustentava elenco de Segunda; as divisões se aproximavam (Terceira de 47 para 59, Primeira caindo para 64). Também o mercado só tinha benders sem contrato do nível do time do jogador, e os times de cima repunham saídas com benders fracos.
- **Correções:**
  - a renda da IA tem **teto por divisão**, e a IA só contrata quem cabe nesse teto. Time no vermelho vende, e os bons benders sobem para quem pode pagar;
  - o mercado tem sempre pelo menos 1 bender sem contrato por elemento perto do nível de cada divisão;
  - se faltar um bender sem contrato à altura, a IA contrata um bender novo do nível da própria divisão.
- **Resultado:** notas médias estáveis em torno de **66 / 60 / 53–55**. A Terceira sobe um pouco nas primeiras temporadas (os jovens amadurecem) e depois para.
- Um técnico passivo na Terceira fecha as contas com os 45%; com 35%, afundava no vermelho.

## 12b. Revisão de equilíbrio (03/11/2026)

Simulação de 8 temporadas em 8 carreiras com um técnico automático razoável (patrocínios adequados, treino com descanso, reserva em exibições, renovações, sem comprar jogadores):
- **Dinheiro:** antes, o patrocínio sozinho pagava a folha e o caixa chegava a ¥380 mil. Agora o patrocínio cobre de 70% a 90% da folha; prêmios, metas e eventos fecham a conta. Um time forte na Primeira guarda ¥20–40 mil por temporada (dá para reforçar); um time fraco na Segunda fica perto de zero ou no vermelho se renovar todo mundo.
- **Notas:** o potencial não sobe mais com o treino, o que freava a inflação das notas. Primeira estável em torno de 66–69; a Segunda sobe de 57 para cerca de 60–63 (aproxima, mas não alcança).
- **Demissões:** caíram, e agora só acontecem em campanhas abaixo da expectativa.
- **Reputação:** já não chega a 100 ficando na Segunda.

## Histórico

- **v0.1**: simulação de batalha 3 contra 3, arenas redonda e quadrada, câmera a 15°.
- **v0.2**: liga de 8 times, treino e energia, mercado de benders sem contrato aberto a cada rodada, atributos Leitura de jogo e Temperamento, tática travada durante o round.
- **v0.3**: 2 divisões de 8 times (acesso e rebaixamento calculados), dinheiro, salários, renda da IA, prêmios, patrocínios com metas, pré-temporada com benders sem contrato, treino em Equipe ou Individual.
- **v0.5**: idade, potencial, envelhecimento, aposentadoria e contratos com renovação; carreira do técnico com propostas e demissão; relatório pós-partida e observação do rival.
- **v0.4**: janela de transferências completa (compra, venda, ofertas da IA, IA negociando entre si), virada de temporada com acesso e rebaixamento aplicados, renovação de patrocínios e histórico.
- **v0.25.7 / Doc, 05/11/2026**: "Agente livre" passa a se chamar "Sem contrato" em todo o jogo (aba do Mercado, selo da ficha, notícias, Guia, dicas e confirmação de dispensa).
- **v0.25.6 / Doc, 05/11/2026**: menos texto no fim de temporada, no desempate e na janela da semana; corrige o título da janela da semana, que tinha sumido na v0.25.2 (identificador repetido com o título da aba Treino).
- **v0.25.5 / Doc, 05/11/2026**: três dicas de primeira vez atualizadas para o fluxo novo (confiança no topo da tela, escalar arrastando, renovação no Mercado da pré-temporada).
- **v0.25.4 / Doc, 05/11/2026**: Guia com as abas Atributos, O bender, Time e carreira e Táticas da partida; ícone do jogo ao lado de cada termo.
- **v0.25.3 / Doc, 05/11/2026**: menos texto na pré-temporada (Patrocínios e Mercado), na Classificação e na ficha do bender; fecha a rodada do "menos texto".
- **v0.25.2 / Doc, 05/11/2026**: menos texto em Elenco, Treino e Finanças (explicações sob um "?", elemento só como ícone nas tabelas, etiquetas e blocos, ícones nos eventos).
- **v0.25.1 / Doc, 05/11/2026**: menos texto na partida (painéis laterais, Preparação e resumo do round); corrige a etiqueta de zona da partida, que tinha mudado de estilo na v0.25.
- **v0.25 / Doc, 05/11/2026**: início do "menos texto": Central e subtítulo do cabeçalho em etiquetas com ícone; observação do rival, relatório da partida e dinheiro da rodada em blocos curtos.
- **v0.24.4 / Doc, 05/11/2026**: coluna de popularidade (POP) na tabela da aba Treino, depois dos atributos.
- **v0.24.3 / Doc, 05/11/2026**: no Mercado, os benders de outros times ficam divididos também por divisão (sub-abas com contagem, abrindo na divisão do seu time); o seletor de divisão sai.
- **v0.24.2 / Doc, 05/11/2026**: Mercado da pré-temporada com abas (Sem contrato, Água, Terra, Fogo); a escalação sai da coluna lateral e "Começar temporada" deixa de exigir titular definido (são escalados sozinhos).
- **v0.24.1 / Doc, 05/11/2026**: a abertura "Sabe como funciona a Dobra Esportiva?" (partida ao vivo e texto) passa a ser a tela de título, com os botões de novo jogo, continuar e partida avulsa logo abaixo; a janela separada sai.
- **v0.24 / Doc, 05/11/2026**: tela de título (Novo jogo Livre/Carreira, Continuar, Partida avulsa); tela de times só com as grades; pré-temporada em telas próprias sem abas (Patrocínios → Mercado, com coluna lateral de escalação, contratos e pendências), em toda temporada; janela de transferências em 1 etapa (a IA contrata na abertura e ajusta ao começar a temporada); aba Mercado some na temporada; Patrocínios e Finanças viram a aba Finanças.
- **v0.23 / Doc, 05/11/2026**: retorno neutro das instruções: quadro "Instruções no round" no resumo (ganho e custo típicos de cada instrução, só do próprio time) e avisos curtos na arena (rajada, disco, rebate). Pontos de atenção da matriz ficam registrados até virarem problema.
- **v0.22.1 / Doc, 05/11/2026**: matriz das vantagens em 6 cenários (formações, posturas e escolhas de alvo); a punição de Manter distância em quem pressiona ficou mais suave (×1,15 e −3% de esquiva), porque passava do ponto fora da Aberta. Pressionar sempre contra o técnico da Primeira que lê o hábito: 42%.
- **v0.22 / Doc, 05/11/2026**: Manter distância pune quem pressiona (empurrão ×1,25 e menos esquiva), o que dá resposta à dupla terra + fogo pressionando (57%). O técnico rival lê o hábito do jogador nos últimos 12 rounds (formação e instruções repetidas) e prepara a resposta; pressionar sempre cai de 56% para 34% contra um técnico da Primeira.
- **v0.21 / Doc, 05/11/2026**: vantagens por elemento em duas instruções de cada elemento (terra firma ao pressionar; fogo rajadas ao pressionar e empurrão mais forte à distância; água ataque que persegue à distância e jato que rebate ao proteger). Fogo Pressionar caiu de 64% para 53%. Guia sem "Combina com"; "Sem instrução" virou "Padrão".
- **v0.20.5 / Doc, 05/11/2026**: lesão em partida com alerta como o da falta (texto LESÃO, apito e anel vermelho no bender) e um selo de lesão (círculo vermelho com cruz) ao lado do nome do bender machucado até ele ser substituído.
- **v0.20.4 / Doc, 05/11/2026**: a Observação do rival sai do quadro Próxima partida e ganha um quadro próprio logo abaixo, com o nome do rival (na cor dele) no título.
- **v0.20.3 / Doc, 05/11/2026**: "Simular rápido" e "Recomeçar" juntos à direita do botão principal.
- **v0.20.2 / Doc, 05/11/2026**: "Simular rápido" e "Recomeçar" com menos destaque (sem fundo nem borda, texto apagado).
- **v0.20.1 / Doc, 05/11/2026**: quadro Próxima partida enxuto: nomes com nota e retrospecto, o × com o tipo de arena embaixo; saem o texto da semana, a expectativa e a confiança da diretoria, que vão para um quadro **Diretoria** no topo da aba Patrocínios.
- **v0.20 / Doc, 05/11/2026**: a mesma janela abre depois do jogo como **Como foi a rodada** (ao concluir a rodada ou simular rápido): resultado, o bloco de finanças da Central (patrocínios, salários, prêmio, eventos, caixa, popularidade do time, confiança, lesões) e um cartão por bender com o domingo (jogou ou ficou no banco) e as barras de popularidade, energia e estresse; no simular rápido, os cartões mostram a semana toda. Na Central o relatório continua igual, agora com setas ↑/↓ em caixa, popularidade e confiança.
- **v0.19.1 / Doc, 05/11/2026**: na janela da semana, a seta entre o valor antigo e o novo indica a direção (↑ subiu, ↓ caiu, na cor de melhora ou piora); sem mudança, só o valor.
- **v0.19 / Doc, 05/11/2026**: (1) ao avançar para domingo abre a janela **Como foi a semana**: um cartão por bender com o plano (treino de quarta ou descanso, evento do dia) e barras animadas do valor antigo para o novo no atributo treinado, na popularidade (se mudou), na energia e no estresse (verde quando melhora, vermelho quando piora; estresse subindo é vermelho), selo de lesão nova, e no topo a variação da popularidade do time. (2) Evento beneficente: já dava a maior popularidade ao bender entre os eventos (+3 por evento, contra +1 a +2 dos outros), mas ao time dava o mesmo que qualquer evento (+0,15). Agora dá +0,375 de popularidade ao time, metade de uma vitória (+0,75); no calendário aparece a etiqueta "+ time".
- **v0.18 / Doc, 05/11/2026**: (1) ao fim da partida abre o resumo do último round jogado, inclusive em nocaute ("Resumo do round N · fim de partida", com o placar final e o tipo de vitória); pular para o fim também gera o resumo. (2) Confirmação antes de decisões definitivas: pular para o fim da partida, simular a partida sem jogar, recomeçar o jogo, encerrar etapa da janela, começar temporada, avançar para a próxima temporada, contratar, comprar, vender, dispensar, aceitar/recusar oferta por bender, assinar/encerrar patrocínio, renovar contrato, assumir outro time e aceitar proposta de técnico. (3) A instrução "Sem instrução" passa a se chamar "Padrão". (4) As fichas do arrastar na aba Treino mostram a popularidade (★) ao lado da energia (⚡).
- **v0.17.6 / Doc, 04/11/2026**: na instrução Marcar, cada rival aparece com o símbolo do elemento (● água, ■ terra, ▲ fogo) na cor do elemento.
- **v0.17.5 / Doc, 04/11/2026**: nomes da próxima partida mais perto do ×.
- **v0.17.4 / Doc, 04/11/2026**: nomes dos times centralizados no quadro da próxima partida.
- **v0.17.3 / Doc, 04/11/2026**: a partida continua com a aba em segundo plano (um relógio de reserva avança a simulação pelo tempo real e para no intervalo e na escolha do duelista, como em primeiro plano).
- **v0.17.2 / Doc, 04/11/2026**: o resumo do round fecha num ✕ (saem os botões "Ver a arena" e "Começar round" dele); a Preparação fica por trás.
- **v0.17.1 / Doc, 04/11/2026**: a partida da abertura roda em velocidade normal (1x).
- **v0.17 / Doc, 04/11/2026**: abertura "Sabe como funciona a Dobra Esportiva?" na primeira vez que o jogo abre, com uma partida ao vivo ao lado do texto.
- **v0.16.9 / Doc, 04/11/2026**: na HUD de preparação, clicar num bender (boneco do campo, linha em quadra ou do banco) abre a ficha em janela.
- **v0.16.8 / Doc, 04/11/2026**: a ficha do bender abre sempre numa janela, em qualquer lugar; vender e dispensar passam do Elenco para a folha salarial em Finanças.
- **v0.16.7 / Doc, 04/11/2026**: aba Elenco no estilo da HUD de preparação: campo com os titulares, lista de titulares e reservas, arrastar para escalar; clicar no campo ou na lista abre a ficha.
- **v0.16.6 / Doc, 04/11/2026**: aba Treino simplificada: o arrastar dos eventos passa para o calendário da semana no topo (com os detalhes de cada evento em etiquetas curtas); sai o bloco de cartões de evento.
- **v0.16.5 / Doc, 04/11/2026**: no mercado, o botão indisponível por caixa insuficiente mostra só "Comprar" (a coluna Orçamento já indica que não cabe).
- **v0.16.4 / Doc, 04/11/2026**: mercado sem as colunas de atributos (sem rolagem lateral); clicar num bender abre a ficha dele numa janela, como no Elenco.
- **v0.16.3 / Doc, 04/11/2026**: abas no Guia (Atributos; Táticas da partida com Postura do time e Instruções); saem os textos de temperamento da postura e de desobediência.
- **v0.16.2 / Doc, 04/11/2026**: o Guia deixa de mostrar números; as explicações dizem o que cada coisa faz, sem quantificar.
- **v0.16.1 / Doc, 04/11/2026**: arrastar e soltar os benders nos eventos da semana (sai a coluna de evento) e para substituir na HUD de preparação (do banco para o campo).
- **v0.16 / Doc, 04/11/2026**: calendário da semana: decisão na segunda, treino na quarta, eventos na terça, quinta, sexta ou sábado (até 1 por bender, além do treino), jogo no domingo; energia e estresse por dia; o cansaço da semana já pesa no jogo do domingo.
- **v0.15.1 / Doc, 04/11/2026**: golpe acima dos ombros também pode lesionar quem foi atingido (2% por golpe; são cerca de 8 por partida, o que soma perto de 1 lesão a mais por time por temporada).
- **v0.15 / Doc, 04/11/2026**: elenco de 6 a 9 benders, banco com substituições à vontade entre os rounds (sempre do mesmo elemento), lesão (partida e treino) com semanas fora, 318 nomes, salários a 75% da tabela para compensar o elenco maior.
- **v0.14 / Doc, 04/11/2026**: HUD de preparação: campo vertical das Zonas 1–3 com os benders posicionados pela formação (animação de arrasto ao trocar) e lista reduzida (elemento, nome, nota, energia, estresse, instrução).
- **v0.13.1 / Doc, 04/11/2026**: no desempate, o técnico escolhe quem duela (quem caiu na água não pode).
- **v0.13 / Doc, 04/11/2026**: temperamento em quadra (explosivo esquenta quando atrás, calmo fica frio quando não está atrás); "IA decide" vira "Leitura do bender" (a LEI decide); Duelo de elementos vira jogo defensivo que rebate ataques no ar.
- **v0.12.2 / Doc, 04/11/2026**: o Guia deixa de explicar quem vence quem entre as formações (o técnico descobre jogando); a observação do rival continua com postura e instruções típicas.
- **v0.12.1 / Doc, 04/11/2026**: nenhuma informação sobre a formação do rival ou sobre vantagem de formação aparece para o técnico; o relatório da partida mostra só a tática do seu time.
- **v0.12 / Doc, 04/11/2026**: formações em pedra, papel e tesoura; Escalonada sem faltas extras (âncora ataca mais devagar); Pressionar, Manter distância e Proteger com custos visíveis; mesma instrução nos três deixa o time previsível; técnico da IA reage à formação; leitura da formação do rival no resumo do round. Regras anteriores guardadas em `design/regras-partida-v0.11.2.md`.
- **v0.11.2 / Doc, 04/11/2026**: faltas na Zona 3 recuam o aliado mais à frente; com o time inteiro na Zona 3, o infrator fica 20 segundos fora.
- **v0.11.1 / Doc, 04/11/2026**: Regras da partida sem repetir o Guia; salário, contrato e valor vão para Finanças (folha salarial); seletores do treino com a mesma largura.
- **v0.11 / Doc, 04/11/2026**: abas Elenco e Treino separadas; ficha do bender com gráfico de competências e evolução semana a semana; escalação mais clara; potencial oculto; guia em janela; rival e resumo do round (mapa de calor, gráficos, leituras) na partida; painéis minimizáveis; orçamento no mercado.
- **v0.10 / Doc, 03/11/2026**: turno e returno (14 rodadas); treino, popularidade, fama e confiança valem metade por partida; metas de patrocínio ajustadas; recuperação natural de estresse −4 por semana.
- **Doc, 03/11/2026**: Guia ganha a seção Táticas da partida.
- **v0.9 / Doc, 03/11/2026**: nome do jogo passa a ser Sport Bend Manager; botão da janela de transferências no cabeçalho, ao lado de Recomeçar (tipografia pixel art testada e revertida).
- **v0.8 / Doc, 03/11/2026**: partida em tela cheia com HUD; táticas do adversário escondidas; narração em formato de chat.
- **v0.7 / Doc, 03/11/2026**: Terceira Divisão (24 times) e modos Livre e Carreira.
- **v0.6 / Doc, 03/11/2026**: revisão de equilíbrio (dinheiro, potencial, confiança, reputação na Segunda, contratação de emergência) e dicas de primeira vez.
- **Doc, 03/11/2026**: os times da IA negociam entre si; patrocínio sem multa, com consequência na renovação; diretriz de peso dos salários.
- **Doc, 03/11/2026**: idade, potencial e contratos.
- **Doc, 03/11/2026**: confiança da diretoria e demissão (no meio e no fim da temporada).
- **Doc, 03/11/2026**: carreira do técnico: reputação, expectativa da diretoria e propostas de outros times.
- **Doc, 03/11/2026**: observação do rival e relatório pós-partida.
- **Doc, 03/11/2026**: janela de transferências completa e virada de temporada (v0.4).
- **Doc, 03/11/2026**: popularidade do time (expectativa dos patrocinadores, torcida) e estresse dos benders.
- **Doc, 03/11/2026**: popularidade dos benders e eventos da semana (renda, energia, popularidade), com efeito em patrocínios, valor, luvas e arquibancada.
- **Doc, 03/11/2026**: novas escolhas de alvo, formação, instruções individuais e obediência pelo temperamento.
- **Doc, 03/11/2026**: alcance dos elementos (fogo forte de longe, terra forte de perto).
- **Doc, 03/11/2026**: energia mais leve (partida −15, treino −10, recuperação natural +10 por semana).
- **Doc, 03/11/2026**: nomes dos 16 times; campeão da Segunda tem acesso garantido.
- **Doc, 03/11/2026**: IA com renda fixa simplificada e podendo oferecer acima do valor de mercado; 2 divisões de 8 times com acesso e rebaixamento de 2 times.
