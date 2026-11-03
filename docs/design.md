# Sport Bend Manager: documento de design

**Sport Bend Manager** (nome provisório do projeto: Bender Manager; antes, Liga de Dominação) é um jogo de gestão de equipe de **dominação profissional** (pro-bending, de *A Lenda de Korra*), no navegador. Referência principal de gestão e visual: **Teamfight Manager 2**. O jogador é o técnico: não controla os benders em quadra; monta o elenco, planeja os treinos, cuida do dinheiro e escolhe a tática entre os rounds.

Este documento é a referência das regras. Quando uma regra mudar, ela muda aqui primeiro.

**Legenda de status:** ✅ implementado no protótipo · 🔨 decidido, a implementar · 💡 ideia para o futuro

Os números marcados como *iniciais* são pontos de partida para balancear.

---

## 1. Fluxo do jogador

1. **Escolhe o modo e a equipe** ✅
   - **Livre:** qualquer um dos 24 times das três divisões. Times com nota menor, e os das divisões de baixo, são um desafio maior.
   - **Carreira:** começa num time da **Terceira Divisão**, com pouca reputação (8). O objetivo é subir, se firmar e chegar ao título da Primeira. As regras são as mesmas do modo Livre; muda só o ponto de partida.
2. **Pré-temporada**
   - **Patrocínios:** escolhe até 2 entre as propostas. ✅
   - **Janela de transferências:** contrata, compra e vende benders, em 2 etapas. O botão para encerrar a etapa (e depois "Começar temporada") fica no cabeçalho, ao lado de Recomeçar, visível em todas as páginas da central. Durante a temporada, o mesmo lugar mostra "Ir para a partida" e "Simular rápido". ✅
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
- **Fase de pontos:** 7 rodadas em turno único (todos contra todos uma vez). ✅
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

- Cada time tem **até 5 benders** e precisa ter **pelo menos 1 de cada elemento** (água, terra, fogo). ✅
- Em cada partida jogam **3 titulares, um por elemento**. O jogador escolhe os titulares. ✅
- O elenco só muda durante a **janela de transferências**. ✅

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
| Salário de cada bender, pago a cada rodada (fixado no contrato, ver 6d) | ¥1.400 × ((nota − 30) ÷ 40)^1,5: nota 50 ≈ ¥500, nota 56 ≈ ¥730, nota 70 = ¥1.400, nota 80 ≈ ¥1.960 |
| Contratar agente livre (luvas) | 2 rodadas de salário |
| Comprar bender de outro time | valor de mercado |

(Valor de mercado e luvas também sobem com a popularidade do bender: ver 7b.)

- O salário **cresce mais rápido que a nota** (curva, não linear), para que um elenco médio da Segunda Divisão caiba no orçamento dela e uma estrela custe bem mais que um bender mediano. *Inicial.*
- **Valor de mercado:** 10 rodadas de salário (nota 70 = ¥14.000), ×1,25 se o bender for titular no time atual. *Inicial.*
- **Caixa inicial:** Primeira ¥20.000; Segunda ¥12.000; Terceira ¥7.000. *Inicial.*
- **Times da IA** não têm patrocinadores: recebem uma **renda simplificada por rodada** proporcional à própria folha (Primeira ×1,05, Segunda e Terceira ×0,95; ×0,8 acima de ¥40 mil; ×0,55 acima de ¥80 mil), **limitada por divisão** (1,35 × a renda de referência: Primeira ¥6.210, Segunda ¥3.645, Terceira ¥2.160 por rodada), mais os prêmios de vitória e playoffs como o jogador. ✅
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
| Fácil | Vencer 3 partidas · Conseguir 1 nocaute |
| Média | Vencer 5 partidas · Terminar entre os 4 primeiros · 3 nocautes |
| Difícil | Chegar à final · Terminar a fase de pontos em 1º · Vencer 3 partidas seguidas |
| Especial | Ser campeão · Nenhuma derrota em casa · Conseguir o acesso (só na Segunda e na Terceira) |

Os patrocinadores são marcas inventadas do universo (lojas, fábricas e serviços da Cidade República), nunca marcas reais.

---

## 6. Janela de transferências

✅

- Acontece **no início de cada temporada**, antes da 1ª rodada, em **2 etapas**. O técnico encerra a etapa 1 quando quiser; na etapa 2, "Começar temporada" fecha a janela.
- **A cada etapa:** os times da IA negociam, cerca de 30% dos agentes livres saem e entram novos, e chegam até **3 ofertas** pelos benders do técnico.
- O técnico pode:
  - **Contratar agentes livres**, pagando as luvas.
  - **Comprar benders de outros times** (de qualquer divisão), pagando o **valor de mercado**. O vendedor só aceita se continuar com pelo menos 1 bender do mesmo elemento e 3 no elenco.
  - **Vender** um bender direto, recebendo **80% do valor de mercado**, para o time com vaga e caixa que mais ganharia com ele.
  - **Aceitar ou recusar ofertas da IA.** As ofertas vão de 95% a 130% do valor (a maioria acima), e aparecem quando o bender seria titular no time interessado (chance alta) ou um bom reserva (chance baixa).
  - **Dispensar** um bender: ele vira agente livre, sem custo nem receita.
- Nunca é possível ficar sem bender de algum elemento.
- **A IA negocia entre si:** completa o elenco com agentes livres quando tem menos de 4; procura reforço (agente livre ou bender de outro time da IA) para o elemento do titular mais fraco, quando acha alguém pelo menos 4 pontos de nota melhor que caiba no caixa (deixando ¥3.000 de folga); dispensa o reserva mais fraco para abrir vaga; e, **se estiver no vermelho**, vende ou dispensa o reserva mais caro.
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
  - **A cada rodada:** vitória +5, derrota −6, ajustadas pela força do adversário (±0,5 a 0,6 por posição de diferença na expectativa; vitória de +2 a +8, derrota de −2 a −9); a partir da 3ª rodada, ±1 por posição acima ou abaixo da expectativa; −3 com o caixa no vermelho; −4 a mais em sequência de 3 derrotas. A Central mostra a barra com o estado (Firme, Atenção, Pressão, Por um fio) e avisa quando está baixa.
  - **Demissão no meio da temporada:** confiança zerada a partir da 4ª rodada. O técnico escolhe na hora um dos times que o aceitam (pelo menos 2, de nível menor) e termina a temporada no comando dele, com confiança 60 e sem os patrocínios do time anterior.
  - **Demissão no fim da temporada:** confiança abaixo de 20 *e* posição final pior que a expectativa (quem cumpre a expectativa não cai por confiança), ou rebaixamento com expectativa de 4º lugar ou melhor. As propostas normais são trocadas por propostas de resgate, e é preciso escolher uma para avançar.
  - **Toda demissão custa 6 pontos de reputação** e fica registrada no histórico.
  - **Referência simulada:** em 16 temporadas com um técnico descuidado (treino sem descanso), houve 1 demissão no meio e poucas no fim, sempre em campanhas ruins.

## 6c-2. Contratação de emergência

- Se faltar um elemento no elenco na pré-temporada e o caixa não pagar a luva, o técnico **ainda pode contratar um agente livre daquele elemento**; o caixa fica no vermelho. Assim o jogo nunca trava sem time completo.

## 6d. Idade, potencial e contratos

✅

**Idade**
- Benders nascem com idade entre 18 e 33 (a maioria entre 21 e 29). Jovens começam com atributos um pouco menores (−6 até 20 anos, −3 até 23).
- **Treino rende mais nos jovens:** ×1,5 até 20 anos, ×1,25 até 23, ×1 até 27, ×0,6 até 30, ×0,3 depois.
- **A cada virada de temporada,** todos fazem aniversário:
  - **Até 24 anos, abaixo do potencial:** amadurecem sozinhos, andando de 20% a 45% do caminho até o potencial.
  - **A partir dos 30:** declínio de cerca de 0,9 ponto por ano acima de 29 na Agilidade (com acaso), um pouco menos em Poder, metade na Firmeza e 30% na Precisão; ganham +0,5 em Leitura e Disciplina.
  - **Aposentadoria:** a partir dos 33 anos, com chance de 25% (+25% por ano a mais); aos 37, todos param. Os nomes dos aposentados voltam a ficar disponíveis.

**Potencial (POT)**
- A nota máxima que o bender pode alcançar. Na geração: até 20 anos, nota + 8 a 20; até 23, + 4 a 13; até 26, + 1 a 6; acima, + 0 a 2.
- O potencial **nunca sobe**. Ao alcançar o potencial, o treino rende só 15%; com 2 pontos acima dele, o treino para de render. Após o declínio, o potencial cai junto com a nota.

**Valor de mercado** × idade (até 21 ×1,35; até 25 ×1,15; até 29 ×1; até 31 ×0,75; depois ×0,5) × (1 + 2% por ponto de potencial acima da nota).

**Contratos**
- Cada bender tem contrato de **1 a 3 temporadas** com **salário fixo**: melhorar não aumenta o salário até a renovação.
- Agente livre contratado: salário pedido hoje; **3 temporadas se tiver até 21 anos, 2 nos demais casos**. Comprado de outro time: mantém contrato e salário.
- **Fim de contrato do técnico:** o bender aparece como "Encerrado" na pré-temporada. Pode ser renovado por 1, 2 ou 3 temporadas pelo salário que pede (salário de hoje × (1 + popularidade ÷ 250)). Sem renovação, **sai de graça** ao começar a temporada. Se a saída deixasse o time sem algum elemento, não dá para começar a temporada até resolver.
- **IA:** renova quem é útil (até 30 anos e até 6 pontos abaixo do pior titular, ou até 32 anos e no nível do pior titular, ou o único do elemento); libera o resto para o mercado.

**Mercado e IA**
- O mercado sempre tem pelo menos **2 promessas** de 17 a 19 anos e 2 benders de cada elemento.
- A IA às vezes aposta numa promessa (até 21 anos, potencial perto da nota do time) e repõe com agentes livres quem se aposentou ou saiu.

**Equilíbrio de longo prazo** (9 temporadas simuladas): nota média dos times da Primeira Divisão estável entre 67 e 69; a Segunda sobe de ~57 para ~64 e se aproxima; idade média se estabiliza perto dos 28 anos; aposentadorias começam por volta da 4ª temporada.

## 7. Treino e energia

**Tipo de treino** (escolhido a cada semana) ✅
- **Equipe:** um único foco para todo o elenco (um atributo, ou todos descansam). É um atalho para quem não quer configurar bender por bender; rende o mesmo que o treino individual.
- **Individual:** cada bender tem o seu foco ou descansa.

**Treino** ✅
- Treinar um atributo aumenta esse atributo. O ganho por semana fica em torno de +0,6 a +2,2, menor quanto mais alto o atributo já está e menor se o bender estiver cansado.
- Atributos treináveis: Poder, Precisão, Agilidade, Firmeza, Disciplina, Leitura de jogo.
- Temperamento não se treina.

**Energia** ✅ (0 a 100)
| Ação | Efeito |
|---|---|
| Recuperação natural (todos, toda semana) | +10 |
| Jogar uma partida | −15 |
| Treinar | −10 |
| Descansar | +35 |
| Ficar na reserva sem jogar | +8 |

- Com esses valores, **treinar 2 semanas e descansar 1** mantém a energia estável. Treinar toda semana derruba ~15 por rodada: é possível, mas o titular chega cansado ao fim da temporada.

- Energia baixa reduz o rendimento em quadra: com energia 100 o bender rende 100%; com energia 0, rende 78%.
- Os planos de treino da semana são aplicados depois da partida da rodada.

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
- **Muda com:** vitória +2 (+1 se for por nocaute), derrota −1,5, cada evento feito por um bender do time +0,3, semifinal +3, chegar à final +4, título +8, acesso +10, rebaixamento −10.
- **Expectativa dos patrocinadores:** valores das propostas × (0,85 + popularidade × 0,004), ou seja, popularidade 20 ≈ ×0,93 e 60 ≈ ×1,09. As **metas ficam mais exigentes**:
  | Popularidade do time | Propostas |
  |---|---|
  | abaixo de 35 | fácil, fácil, média, difícil |
  | 35 a 65 | fácil, média, média, difícil |
  | acima de 65 | média, média, difícil, difícil |
- **Arquibancada:** a lotação do lado de cada time vai de 35% (popularidade 0) a lotada (100).
- **Cobrança da torcida:** quanto mais popular o time, mais uma derrota estressa os benders (ver Estresse).

**Eventos da semana**: no plano semanal, no lugar de treinar ou descansar, um bender pode fazer um evento. Rende dinheiro e popularidade, custa energia e **não evolui atributos**. A **Exibição na praça** está sempre disponível; outros **2 eventos** sorteados aparecem a cada rodada. Alguns exigem popularidade mínima e têm vagas limitadas. Renda = (base + valor por ponto × popularidade) × multiplicador da divisão (60% na Segunda).

| Evento | Requisito | Vagas | Base | Por ponto de POP | Energia | POP |
|---|---|---|---|---|---|---|
| Exibição na praça | — | livres | ¥200 | ¥6 | −8 | +2 |
| Comercial de rádio | POP 40 | 1 | ¥600 | ¥20 | −6 | +3 |
| Sessão de autógrafos | POP 25 | 2 | ¥300 | ¥14 | −8 | +2 |
| Evento beneficente | — | 2 | ¥0 | ¥0 | −10 | +6 |
| Festival da Cidade República | POP 50 | 3 | ¥500 | ¥18 | −14 | +4 |
| Entrevista ao jornal | POP 30 | 1 | ¥200 | ¥8 | −3 | +3 |
| Aula numa escola de dominação | — | 1 | ¥400 | ¥4 | −10 | +3 |

- No **treino em equipe**, há a opção "Todos: Exibição na praça".
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

**O que alivia**
| Fonte | Estresse |
|---|---|
| Descansar | −15 |
| Vitória | −3 |
| Ficar na reserva sem jogar | −4 |
| Recuperação natural, toda semana | −3 |

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
| **Temperamento** (0 calmo a 100 explosivo) | Puxa a postura do bender para o seu jeito natural: ele segue 65% da ordem do técnico e 35% do próprio jeito. Explosivos cometem um pouco mais de faltas. Não se treina. |
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
- **Faltas** (pisar além da linha, golpe acima dos ombros) mandam o infrator uma zona para trás.

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
  | IA decide | cada bender escolhe pela vulnerabilidade, distância e o próprio alcance |
  | Foco no mais vulnerável | todos no rival mais perto de ser empurrado ou de cair |
  | Duelo de elementos | cada um no rival do mesmo elemento, salvo se outro estiver bem mais vulnerável |
  | Foco no mais perigoso | prioriza o rival com mais Poder |
  | Foco no mais próximo | prioriza quem está mais perto |
  | Caçar a estrela | prioriza o rival com os melhores atributos |

  As três últimas misturam o critério com a leitura de quem está vulnerável, para não virarem escolhas às cegas.
- **Formação:**
  - **Aberta:** o time se espalha pela largura.
  - **Compacta:** o time se junta no centro e se ajuda um pouco a focar o mesmo alvo. Custo: o golpe **respinga** em quem está colado no alvo (40% do empurrão).
  - **Escalonada:** um bender segura a linha (a terra, se estiver em quadra; senão quem tem mais Firmeza), finca o pé (+14 de Firmeza contra empurrões) e comete mais faltas de linha. Os outros dois ficam um pouco atrás e esquivam mais (+5%).
- **Instruções individuais** (uma por bender, por round):
  | Instrução | Efeito |
  |---|---|
  | Pressionar | joga colado na linha, prefere alvos próximos, ataca 10% mais rápido, 2,5× mais faltas de linha |
  | Manter distância | fica um pouco mais atrás, prefere alvos distantes, balança mais de lado, +8% de esquiva |
  | Mais agressivo / Mais cauteloso | puxa a postura daquele bender para Agressiva ou Defensiva |
  | Proteger | +10% de esquiva; na terra, tenta interceptar com um disco os ataques que vão num companheiro próximo |
  | Marcar [rival] | ataca só aquele rival enquanto ele estiver em quadra |
- **Obediência:** uma instrução que contraria o temperamento pode ser **ignorada no round inteiro**. Explosivos resistem a Mais cauteloso, Manter distância e Proteger; calmos resistem a Mais agressivo e Pressionar. A chance é 0 até 15 pontos do centro (50) e chega a 45% nos extremos (explosivo 90 mandado ser cauteloso: ~32%). Quem desobedece joga do próprio jeito (explosivo fica agressivo, calmo fica cauteloso). A tela mostra o risco antes de confirmar e avisa quando acontece.
- **Técnico da IA:** escolhe postura, formação e instruções conforme o estilo e o placar (estilo agressivo: escalonada e terra pressionando; equilibrado: compacta; defensivo: aberta e terra protegendo; perdendo: mais agressivo e compacto).
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

**Observação do rival** (na Central, junto da próxima partida)
- Últimos 5 resultados do rival na temporada.
- Tendência do técnico rival, conforme o estilo: postura e formação iniciais, instruções típicas e o que faz quando está perdendo (as mesmas regras que o técnico da IA segue).
- Energia e estresse médios dos titulares do rival e do seu time.
- Titulares do rival com nota, Poder, Firmeza, Agilidade, temperamento, energia e estresse; marcados o **mais perigoso** (maior Poder) e a **estrela** (maior nota).

**Relatório da sua partida** (nos resultados da rodada, tanto jogando quanto em "Simular rápido")
- **Destaque** da partida: pontuação = empurrões × 5 + quedas causadas × 10 + acertos × 0,03 + bloqueios × 0,02 + esquivas × 0,01 − faltas × 2 (acertos, bloqueios e esquivas são muito numerosos e pesam pouco).
- **Round a round:** quem venceu e como, e a tática dos dois times naquele round (postura, formação, escolha de alvo e instruções individuais).
- **Estatísticas** de cada bender dos dois times: acertos, precisão, empurrões, quedas causadas, esquivas, bloqueios, faltas, desobediências e estado de estresse.
- **Alertas:** muitas faltas do seu time (3 ou mais), desobediências e benders que jogaram estressados (50 ou mais).
- **Guia (aba da central):** atributos, estados do bender e uma seção **Táticas da partida** que explica cada postura, escolha de alvo, formação e instrução individual, além da desobediência. ✅
- **Histórico de temporadas:** ver 6b. 💡 (gráficos de evolução de atributos e caixa)

## 9c. Dicas de primeira vez ✅

- Na primeira visita, cada página da central (Central, Elenco e treino, Mercado, Patrocínios, Finanças, Classificação, Guia) mostra no topo um quadro curto com o essencial daquela página. O quadro some ao clicar em **Entendi**.
- A dica da **Central** é a de boas-vindas: o caminho de uma temporada (pré-temporada → elenco → semana → partida → fim da temporada) e a barra de confiança.
- A **primeira partida** mostra uma dica sobre rounds, tática entre os rounds e desobediência.
- O que já foi visto fica salvo no jogo. No **Guia**, o botão **Rever dicas** mostra todas de novo.

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
- **Problema encontrado:** a renda da IA acompanhava a própria folha, então um time da Terceira sustentava elenco de Segunda; as divisões se aproximavam (Terceira de 47 para 59, Primeira caindo para 64). Também o mercado só tinha agentes livres do nível do time do jogador, e os times de cima repunham saídas com benders fracos.
- **Correções:**
  - a renda da IA tem **teto por divisão**, e a IA só contrata quem cabe nesse teto. Time no vermelho vende, e os bons benders sobem para quem pode pagar;
  - o mercado tem sempre pelo menos 1 agente livre por elemento perto do nível de cada divisão;
  - se faltar um agente livre à altura, a IA contrata um bender novo do nível da própria divisão.
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
- **v0.2**: liga de 8 times, treino e energia, mercado de agentes livres aberto a cada rodada, atributos Leitura de jogo e Temperamento, tática travada durante o round.
- **v0.3**: 2 divisões de 8 times (acesso e rebaixamento calculados), dinheiro, salários, renda da IA, prêmios, patrocínios com metas, pré-temporada com agentes livres, treino em Equipe ou Individual.
- **v0.5**: idade, potencial, envelhecimento, aposentadoria e contratos com renovação; carreira do técnico com propostas e demissão; relatório pós-partida e observação do rival.
- **v0.4**: janela de transferências completa (compra, venda, ofertas da IA, IA negociando entre si), virada de temporada com acesso e rebaixamento aplicados, renovação de patrocínios e histórico.
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
