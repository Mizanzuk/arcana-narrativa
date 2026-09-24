(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={view:'welcome',module:'theory',idx:0,practiceIdx:0,slides:[],cardImages:{},member:null,session:null,prevFocus:null};
const sources={
 metmuseum:{title:'The Metropolitan Museum of Art – Tarot',url:'https://www.metmuseum.org/perspectives/tarot-2'},
 warburg:{title:'Warburg Institute – Tarot: Origins and Afterlives',url:'https://warburg.sas.ac.uk/news-events/news/tarot-origins-afterlives-opening-soon-warburg-institute'},
 w3c:{title:'W3C – WCAG 2.2, contraste mínimo',url:'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'},
 cambridge:{title:'Cambridge University Press – Golden Dawn e ocultismo ocidental',url:'https://www.cambridge.org/core/books/abs/cambridge-handbook-of-western-mysticism-and-esotericism/golden-dawn-and-the-oto/89C65341BF3D3912E35E25A6F3759B07'},
 britishSmith:{title:'British Museum – Pamela Colman Smith',url:'https://www.britishmuseum.org/collection/term/BIOG198979'},
 fortune:{title:'Dion Fortune – The Mystical Qabalah (p. 48)',book:true,pdf:'The Mystical Qabalah (Dion Fortune).pdf'},
 fortuneGematria:{title:'Dion Fortune – The Mystical Qabalah (p. 42)',book:true,pdf:'The Mystical Qabalah (Dion Fortune).pdf'},
 crowley:{title:'Aleister Crowley – O Livro de Thoth (p. 11)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyTree:{title:'Aleister Crowley – O Livro de Thoth (p. 23)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyPaths:{title:'Aleister Crowley – O Livro de Thoth (p. 25)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyAleph:{title:'Aleister Crowley – O Livro de Thoth (p. 44)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyMagician:{title:'Aleister Crowley – O Livro de Thoth (p. 56)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyPriestess:{title:'Aleister Crowley – O Livro de Thoth (pp. 58–59)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyCups:{title:'Aleister Crowley – O Livro de Thoth (p. 148)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleySwords:{title:'Aleister Crowley – O Livro de Thoth (pp. 155–156)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyCourt:{title:'Aleister Crowley – O Livro de Thoth (pp. 20–22)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleySuits:{title:'Aleister Crowley – O Livro de Thoth (p. 22)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyNumbers:{title:'Aleister Crowley – O Livro de Thoth (pp. 132–135)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyDecans:{title:'Aleister Crowley – O Livro de Thoth (p. 28)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyEmpress:{title:'Aleister Crowley – O Livro de Thoth (pp. 60–61)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyDeath:{title:'Aleister Crowley – O Livro de Thoth (p. 77)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyArt:{title:'Aleister Crowley – O Livro de Thoth (pp. 78–80)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyStar:{title:'Aleister Crowley – O Livro de Thoth (pp. 83–85)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyTitle:{title:'Aleister Crowley – O Livro de Thoth (p. 3)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyMinorIndex:{title:'Aleister Crowley – O Livro de Thoth (p. 5)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 crowleyGematria:{title:'Aleister Crowley – O Livro de Thoth (pp. 11–12)',book:true,pdf:'Aleister_Crowley_O_Livro_de_Thoth.pdf'},
 levi:{title:'Warburg Institute – Éliphas Lévi and the Occult Tarot',url:'https://warburg.sas.ac.uk/news-events/videos-podcasts/tarot-origins-afterlives-peter-forshaw-eliphas-levi-occult-tarot'},
 course:{title:'Página oficial da oficina – Arcana Narrativa',url:'https://mizanzuk.com/cursos/arcana-narrativa/'},
 apg:{title:'W3C WAI – Padrão acessível para diálogo modal',url:'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/'}
};
const majorNames=['O Louco','O Mago','A Sacerdotisa','A Imperatriz','O Imperador','O Hierofante','Os Amantes','A Carruagem','Ajustamento','O Eremita','Fortuna','Volúpia','O Enforcado','Morte','Arte','O Diabo','A Torre','A Estrela','A Lua','O Sol','O Aeon','O Universo'];
const majors=[
 ['Aleph','Ar','movimento antes da forma'],['Beth','Mercúrio','linguagem que abre passagem'],['Gimel','Lua','travessia entre polos'],['Daleth','Vênus','atração, nascimento e escolha'],['Heh','Áries','iniciativa e direção'],['Vav','Touro','forma, tradição e transmissão'],['Zayin','Gêmeos','escolha entre forças'],['Cheth','Câncer','condução e proteção'],['Lamed','Libra','ajuste e equilíbrio'],['Yod','Virgem','retirada e precisão'],['Kaph','Júpiter','mudança de escala'],['Teth','Leão','coragem e desejo vital'],['Mem','Água','suspensão e inversão'],['Nun','Escorpião','transformação irreversível'],['Samekh','Sagitário','mistura e integração'],['Ayin','Capricórnio','limite e desejo material'],['Peh','Marte','ruptura e liberação'],['Heh','Aquário','visão e futuro'],['Qoph','Peixes','sonho e incerteza'],['Resh','Sol','clareza e presença'],['Shin','Fogo','chamado e passagem'],['Tav','Saturno','conclusão e mundo concreto']
];
const sefirot=[['Kether',250,55,'origem, possibilidade'],['Chokmah',430,155,'impulso, força em movimento'],['Binah',70,155,'forma, limite, compreensão'],['Chesed',430,340,'expansão, ordem, cuidado'],['Geburah',70,340,'corte, rigor, mudança'],['Tiphereth',250,475,'centro, integração, identidade'],['Netzach',430,620,'desejo, vínculo, persistência'],['Hod',70,620,'linguagem, análise, técnica'],['Yesod',250,755,'imagem, memória, preparação'],['Malkuth',250,900,'corpo, lugar, consequência']];
const paths=[['Aleph',0,1,0],['Beth',0,2,1],['Gimel',0,5,2],['Daleth',1,2,3],['Heh',1,5,17],['Vav',1,3,5],['Zayin',2,5,6],['Cheth',2,4,7],['Teth',3,4,11],['Yod',3,5,9],['Kaph',3,6,10],['Lamed',4,5,8],['Mem',4,7,12],['Nun',5,6,13],['Samekh',5,8,14],['Ayin',5,7,15],['Peh',6,7,16],['Tzaddi',6,8,4],['Qoph',6,9,18],['Resh',7,8,19],['Shin',7,9,20],['Tav',8,9,21]];
const bookPages={
 8:[['crowley','A divisão de 78 cartas e quatro naipes é apresentada no começo do livro.']],
 9:[['crowleyPaths','Os trunfos e suas atribuições simbólicas.']],
 10:[['crowley','78 cartas, quatro naipes e quatro figuras por naipe.'],['crowleySwords','Três de Espadas: título, atribuição e descrição da imagem.']],
 11:[['crowleyCourt','As figuras da corte no sistema Thoth.']],
 17:[['crowleyTree','A articulação entre carta, letra e caminho na Árvore.']],
 18:[['crowleyPriestess','A Sacerdotisa, Gimel e Lua como exemplo de correspondência.']],
 20:[['fortune','Dion Fortune descreve as relações e caminhos da Árvore da Vida.'],['crowleyTree','Crowley descreve dez Sephiroth e 22 caminhos.']],
 21:[['crowleyPaths','Os trunfos como 22 caminhos, com letras e correspondências.']],
 22:[['crowleyNumbers','A relação entre número, sephirah e expressão em cada naipe.']],
 23:[['crowleySuits','Os quatro naipes associados a fogo, água, ar e terra.']],
 24:[['crowleyGematria','A seção introdutória discute a gematria.'],['fortuneGematria','As letras hebraicas como valores numéricos.']],
 25:[['crowleyAleph','Aleph, o Louco e o elemento Ar.']],
 27:[['crowleyTitle','Data e crédito de Frieda Harris na edição consultada.']],
 29:[['crowleyMinorIndex','O índice reúne os títulos das cartas menores.'],['crowleyCups','O Dois de Copas exemplifica a relação entre título, imagem e correspondência.']],
 30:[['crowleyDecans','A divisão do zodíaco em 36 decanos.'],['crowleyStar','A Estrela associada a Aquário.']],
 31:[['crowleyDecans','Três decanos de dez graus por signo.'],['crowleySwords','O Dois de Espadas e sua associação a Lua em Libra.']],
 32:[['crowleyMagician','Beth e Mercúrio na carta do Mago.'],['crowleyEmpress','Daleth e Vênus na Imperatriz.'],['crowleyDeath','Nun e Escorpião na carta da Morte.']],
 33:[['fortune','Dion Fortune descreve as relações e caminhos da Árvore da Vida.'],['crowleyTree','Crowley descreve dez Sephiroth e 22 caminhos.'],['crowleyCups','O Dois de Copas exemplifica a relação entre título, imagem e correspondência astrológica.']],
 34:[['crowleyArt','A carta Arte e a mistura de opostos na imagem.']]
};
const enrich={
 2:{title:'Tarô como\nlinguagem criativa',lede:'A imagem oferece matéria. A escrita transforma associação em escolha.',visual:'rws-3swords.webp',terms:['imagem','associação','escolha']},
 6:{title:'Quatro viradas',lede:'Das cartas de jogo às correspondências modernas, cada época acrescentou um novo uso.',visual:'visconti-world.webp'},
 7:{title:'Antes do oráculo,\num jogo',lede:'As primeiras referências documentadas apontam para cartas de jogo no norte da Itália.',visual:'visconti-world.webp',terms:['história factual']},
 10:{title:'56 variações\ndo cotidiano',lede:'Quatro naipes mostram ações, afetos, conflitos e recursos. No Três de Espadas, observe primeiro a rosa rompida pelas lâminas.',visual:'thoth/Thot-S-03.webp'},
 12:{title:'Três modos de ver',lede:'Marselha, Waite–Smith e Thoth mostram soluções visuais diferentes para o mesmo repertório.',visual:'thoth-spread.webp'},
 13:{title:'O melhor deck é aquele\nque você aprende a ver',lede:'Gosto, convivência e familiaridade valem mais do que escolher um baralho “correto”.',visual:'rws-magician.webp'},
 16:{title:'A Golden Dawn\nreuniu sistemas',lede:'Tarô, gematria, Cabala hermética e astrologia formaram uma rede de correspondências.',visual:'rose-cross.webp',terms:['quatro sistemas']},
 18:{title:'Quatro linguagens.\nUma carta.',lede:'A Sacerdotisa reúne uma imagem do tarô, Gimel e seu valor, a Lua e um caminho da Árvore. Observe o que cada camada acrescenta.',visual:'thoth/Thot-T-02.webp',terms:['A Sacerdotisa','Gimel','Lua']},
 19:{title:'Cabala hermética:\num mapa de relações.',lede:'Dez sephiroth marcam posições; 22 caminhos mostram passagens. A leitura hermética liga essa estrutura às cartas.',visual:'tree-kircher.webp',terms:['Sephiroth','caminhos']},
 20:{title:'Dez centros.\nVinte e dois caminhos.',lede:'Primeiro, observe a estrutura: as sephiroth marcam posições e os caminhos ligam os centros. As cartas, letras e qualidades astrológicas entram nas próximas telas.',visual:'tree-kircher.webp',terms:['Sephiroth','caminhos']},
 21:{title:'22 cartas.\n22 caminhos.',lede:'Cada Arcano Maior pode ocupar um caminho e receber uma letra e uma correspondência elementar, planetária ou zodiacal.',visual:'tree-kircher.webp'},
 22:{title:'Os números\ndescem pela Árvore.',lede:'Do Ás ao Dez, um mesmo lugar estrutural muda de expressão conforme o naipe.',special:'numbers'},
 24:{title:'Letras também\nsão números.',lede:'Na gematria hebraica, letras têm valores. Palavras podem ser comparadas por suas somas – com contexto e limites.',special:'gematria',terms:['gematria','Aleph','Bet','Gimel']},
 25:{title:'Aleph.\nO Louco.\nO primeiro passo.',lede:'Uma associação pode abrir uma pergunta: o que começa a se mover antes de ganhar forma?',visual:'thoth/Thot-T-00.webp',terms:['Aleph','Ar','O Louco']},
 27:{title:'Crowley +\nLady Frieda Harris',lede:'Crowley organizou o sistema; Harris traduziu suas orientações em imagens de grande densidade visual.',visual:'thoth-spread.webp'},
 28:{title:'Foi onde eu consegui\nver o sistema inteiro.',lede:'Este é o deck que eu pessoalmente consegui relacionar melhor a imagem, o número, a Cabala e a astrologia.',visual:'thoth-spread.webp'},
 29:{title:'A imagem dá a pista.\nO título sugere uma tese.',lede:'No Thoth, cor, geometria, símbolo e título podem concordar ou entrar em tensão.',visual:'thoth/Thot-C-02.webp'},
 30:{title:'Astrologia:\nqualidades e ritmos.',lede:'Planetas, signos, elementos e decanos acrescentam clima à imagem. Vamos aprender o vocabulário antes de combinar as camadas.',visual:'thoth/Thot-T-17.webp'},
 31:{title:'O vocabulário\ndo céu.',lede:'Sete planetas tradicionais, doze signos e quatro elementos; cada signo se divide em três decanos.',visual:'thoth/Thot-S-02.webp'},
 32:{title:'Correspondência\nacrescenta clima.',lede:'Mercúrio pode dar ao Mago linguagem e trânsito; Vênus pode dar à Imperatriz atração e fecundidade.',visual:'thoth/Thot-T-01.webp'},
 33:{title:'A Árvore da Vida',lede:'Explore as relações entre tarô, Cabala hermética, gematria e astrologia.',special:'tree'},
 34:{title:'Da Árvore\nà cena.',lede:'Depois de cruzar as camadas, volte à imagem e escolha uma relação que produza uma ação concreta.',visual:'thoth/Thot-T-14.webp'},
 35:{title:'Agora, escreva.',lede:'Use as correspondências como repertório e transforme uma pista visual em decisão narrativa.',visual:'hero.webp'},
 38:{title:'Um personagem\nem movimento.',lede:'Uma carta. Cinco minutos. Uma ação que revele desejo e recusa.',visual:'thoth/Thot-T-01.webp'},
 39:{title:'Três cartas.\nUma transformação.',lede:'Escreva a passagem entre elas, não três resumos separados.',visual:'thoth/Thot-T-13.webp'},
 40:{title:'Uma contradição\ntorna alguém real.',lede:'O Arcano Maior revela a autoimagem; o Menor, um hábito que a desmente.',visual:'thoth/Thot-T-06.webp'},
 41:{title:'Uma cena.\nUma decisão irreversível.',lede:'Lugar, pessoa, desejo e obstáculo. Quatro cartas, uma unidade de tempo.',visual:'thoth/Thot-T-16.webp'},
 42:{title:'Cruz Celta.\nDez posições.',lede:'Uma estrutura conhecida, adaptada aqui para mapear relações narrativas.',special:'celtic',visual:'tree-kircher.webp'},
 43:{title:'Uma tiragem\nse torna narrativa.',lede:'Cena, fricção, objetivo, causa, passado, virada, autoimagem, ambiente, medo e final possível.',special:'celtic',visual:'thoth/Thot-T-00.webp'}
};
const slideCopy={
1:['Arcana Narrativa','O baralho como repertório de imagens, personagens e estruturas narrativas.'],
3:['Duas horas para entender. Duas para experimentar.','Uma primeira parte para construir vocabulário; outra para escrever com as cartas.'],
4:['Um baralho, duas histórias','A história documentada das cartas e a história esotérica que lhes atribuiu novas camadas.'],
5:['As cartas vieram primeiro.','Jogo, oficinas e circulação documentada. As correspondências esotéricas vieram depois.'],
6:['Quatro viradas','Do jogo renascentista à cartomancia e aos sistemas simbólicos modernos.'],
8:['78 cartas. Dois níveis.','22 Arcanos Maiores e 56 Arcanos Menores.'],
9:['22 imagens de grande escala','Mudanças de estado, forças que excedem o personagem e viradas de arco.'],
10:['56 variações do cotidiano','Quatro naipes, números e figuras para ações, relações, recursos e conflitos.'],
11:['Números e figuras','Dez cartas numeradas e quatro figuras por naipe. No Thoth: Cavaleiro, Rainha, Príncipe e Princesa.'],
12:['Três marcos visuais','Marselha, Waite–Smith e Thoth: repertórios diferentes para olhar e narrar.'],
14:['Uma nova camada se abre','Etteilla publica um sistema e um baralho concebidos para a cartomancia.'],
15:['22 trunfos. 22 letras.','Uma aproximação esotérica que se tornou chave para novas correspondências.'],
16:['A Golden Dawn','Uma ordem iniciática de Londres reúne tradições em um currículo de correspondências.'],
17:['Quatro sistemas. Uma rede.','Tarô oferece imagens; Cabala hermética, um mapa; gematria, valores das letras; astrologia, qualidades celestes.'],
18:['Um exemplo reúne tudo.','A Sacerdotisa, Gimel, Lua e um caminho da Árvore: quatro pistas para criar uma cena.'],
19:['Cabala hermética','Dez centros e 22 caminhos formam o mapa de relações usado nesta oficina.'],
21:['22 cartas. 22 caminhos.','Letras e correspondências astrológicas conectam os Arcanos Maiores à Árvore.'],
22:['Os números descem pela Árvore.','Cada número repete uma posição; cada naipe muda sua expressão.'],
23:['Quatro naipes. Quatro elementos.','Paus, Copas, Espadas e Discos oferecem quatro qualidades de ação.'],
24:['Letras também são números.','Na gematria, palavras em hebraico podem ser comparadas por seus valores.'],
25:['Aleph. O Louco. Um começo.','Uma associação pode abrir uma pergunta narrativa em vez de dar uma resposta.'],
26:['Aleister Crowley','Ocultista e escritor, membro da Golden Dawn e figura controversa.'],
27:['Crowley + Lady Frieda Harris','Um sistema conceitual e um trabalho visual construído ao longo de anos.'],
29:['O Thoth torna visíveis as relações.','Cor, geometria, símbolo e título oferecem caminhos de leitura.'],
30:['Astrologia','No tarô hermético, o céu funciona como sistema de qualidades e ritmos.'],
31:['Um vocabulário mínimo','Planetas e signos qualificam caminhos; os 36 decanos ajudam a distinguir as cartas numeradas de Dois a Dez.'],
32:['Elementos, planetas e signos','As correspondências acrescentam clima, ritmo e tipo de ação.'],
33:['A Árvore da Vida','Explore as quatro linguagens reunidas em um mapa interativo.'],
34:['Da Árvore à cena.','Observe, relacione e escolha uma mudança concreta na história.'],
35:['Agora, escreva.','As cartas oferecem pistas; a escolha narrativa é sua.'],
36:['Tirar cartas, abrir caminhos','Jogos simples para criar personagens, conflitos, cenas e arcos.'],
37:['Descreva. Pergunte. Escolha.','Observar abre possibilidades; escolher uma transforma a associação em escrita.'],
44:['30 minutos de prática','Observe, escreva sem parar, depois releia para encontrar relações.'],
45:['Troque uma carta. Reescreva.','Mude apenas o que precisa mudar: desejo, obstáculo, final ou voz.'],
46:['Embaralhe. Corte. Escreva.','A carta não decide a história. Ela força uma escolha.']
};
const exercises=[
 {id:'uma',title:'Uma carta',subtitle:'Um personagem em movimento',count:1,positions:['Personagem'],theory:['Descreva antes de interpretar.','Pergunte o que a figura quer e o que se recusa a ver.','Escolha uma resposta e transforme em ação.'],prompt:'Que gesto pequeno denuncia um desejo que o personagem ainda não consegue admitir?',visual:'single'},
 {id:'tres',title:'Três cartas',subtitle:'Uma mudança de estado',count:3,positions:['Estado inicial','Pressão','Transformação'],theory:['As cartas não precisam representar passado, presente e futuro.','A carta do meio perturba o que já existe.','Escreva o elo causal entre a primeira e a última.'],prompt:'O que a pressão torna impossível continuar fingindo?',visual:'three'},
 {id:'contradicao',title:'Contradição',subtitle:'O personagem contra a própria história',count:2,positions:['Autoimagem · Arcano Maior','Hábito · Arcano Menor'],theory:['O Maior sugere a história que a pessoa conta sobre si.','O Menor oferece um gesto cotidiano que a desmente.','Uma ação pode revelar as duas cartas ao mesmo tempo.'],prompt:'Que atitude faria o personagem parecer coerente consigo e, ao mesmo tempo, contraditório?',visual:'three'},
 {id:'cena',title:'Gerador de cena',subtitle:'Quatro cartas, uma decisão',count:4,positions:['Lugar','Pessoa','Desejo','Obstáculo'],theory:['A cena acontece em uma unidade curta de tempo.','Converta símbolos abstratos em objetos, gestos, clima ou regras do lugar.','Termine com uma decisão que altere o rumo da história.'],prompt:'Qual escolha torna impossível voltar ao começo da cena?',visual:'four'},
 {id:'celtica',title:'Cruz Celta',subtitle:'Uma estrutura tradicional, uma leitura narrativa',count:10,positions:['Cena atual','Fricção','Objetivo consciente','Causa subterrânea','Passado recente','Virada próxima','Autoimagem','Ambiente','Esperança ou medo','Final possível'],theory:['Existem várias versões da Cruz Celta; defina as posições antes da tiragem.','Esta adaptação usa as cartas como mapa de forças simultâneas, não como previsão.','A décima posição sugere um final possível: aceite, recuse ou reescreva.'],prompt:'Qual relação entre duas posições transforma o final possível em uma escolha do personagem?',visual:'celtic'}
];
const suitNames={C:'Copas',D:'Discos',S:'Espadas',W:'Paus'};
const minorKeywords={C:{'02':['Amor','vínculo e acolhimento'],'03':['Abundância','crescimento e encontro'],'04':['Luxúria','conforto que pode estagnar'],'05':['Desapontamento','expectativa frustrada'],'06':['Prazer','harmonia compartilhada'],'07':['Deboche','excesso e dispersão'],'08':['Indolência','energia suspensa'],'09':['Felicidade','satisfação que floresce'],'0A':['Saciedade','plenitude que pesa'],'10':['Ás','água em potência'],'KN':['Cavaleiro','ação emocional intensa'],'PN':['Príncipe','imaginação em movimento'],'QU':['Rainha','escuta e contenção'],'PS':['Princesa','sensibilidade que começa']},D:{'02':['Mudança','recursos em circulação'],'03':['Trabalho','construção em conjunto'],'04':['Poder','estrutura e controle'],'05':['Preocupação','segurança ameaçada'],'06':['Sucesso','resultado compartilhado'],'07':['Fracasso','esforço que pede revisão'],'08':['Prudência','cuidado e método'],'09':['Ganho','acúmulo e autonomia'],'0A':['Riqueza','estabilidade material'],'10':['Ás','terra em potência'],'KN':['Cavaleiro','ritmo e persistência'],'PN':['Príncipe','organização e método'],'QU':['Rainha','nutrição e continuidade'],'PS':['Princesa','curiosidade prática']},S:{'02':['Paz','acordo provisório'],'03':['Dor','separação e percepção'],'04':['Trégua','pausa e estratégia'],'05':['Derrota','conflito e custo'],'06':['Ciência','clareza analítica'],'07':['Futilidade','plano que não se sustenta'],'08':['Interferência','muitas vozes e ruído'],'09':['Crueldade','ideia que fere'],'0A':['Ruína','fim de uma estrutura'],'10':['Ás','ar em potência'],'KN':['Cavaleiro','impulso e decisão'],'PN':['Príncipe','agilidade intelectual'],'QU':['Rainha','discernimento e distância'],'PS':['Princesa','ideia recém-nascida']},W:{'02':['Domínio','vontade que inicia'],'03':['Virtude','coragem que se organiza'],'04':['Conclusão','pausa depois do esforço'],'05':['Disputa','competição e choque'],'06':['Vitória','reconhecimento e avanço'],'07':['Valor','resistência sob pressão'],'08':['Rapidez','movimento acelerado'],'09':['Força','persistência defensiva'],'0A':['Opressão','responsabilidade em excesso'],'10':['Ás','fogo em potência'],'KN':['Cavaleiro','ação intensa e direta'],'PN':['Príncipe','entusiasmo e iniciativa'],'QU':['Rainha','calor e confiança'],'PS':['Princesa','faísca criativa']}};
const rankOrder=['10','02','03','04','05','06','07','08','09','0A','KN','PN','QU','PS'];
const mediaCard=(code)=>state.cardImages?.[`Thot-${code}.webp`]||(location.hostname==='127.0.0.1'&&location.port==='8000'?`assets/thoth/Thot-${code}.webp`:null);
function allCardCodes(){return [...Array(22)].map((_,i)=>`T-${String(i).padStart(2,'0')}`).concat(Object.keys(suitNames).flatMap(s=>rankOrder.map(r=>`${s}-${r}`)))}
function cardInfo(code){const [s,r]=code.split('-');if(s==='T'){const n=parseInt(r,10);return{name:majorNames[n],kind:'Arcano Maior',keys:majors[n]||['','', 'imagem em aberto']}}const key=r==='0A'?'10':r==='10'?'0A':r;const n=minorKeywords[s]?.[key]||['Carta','uma pista visual'];return{name:`${n[0]} de ${suitNames[s]}`,kind:'Arcano Menor',keys:['',suitNames[s],n[1]]}}
function cardName(code){return cardInfo(code).name}
function termButton(text,tag='Símbolo') {return `<button class="term" data-knowledge="${esc(text)}" data-tag="${esc(tag)}">${esc(text)}</button>`}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function visible(id){$$('.screen').forEach(x=>x.hidden=true);const el=$('#'+id);if(el)el.hidden=false;state.view=id;window.scrollTo(0,0)}
function setAuthMode(mode){state.authMode=mode;visible('auth');$('#auth-form').reset();$('#auth-status').textContent='';$('#password-label').hidden=mode!=='login';$('#auth-password').hidden=mode!=='login';$('#new-password-label').hidden=mode!=='password';$('#new-password').hidden=mode!=='password';$('#password-label').htmlFor='auth-password';$('#email-label').hidden=mode==='password';$('#auth-email').hidden=mode==='password';$('#auth-email').required=mode!=='password';$('#auth-password').required=mode==='login';$('#new-password').required=mode==='password';$('#auth-kicker').textContent=mode==='login'?'BEM-VINDA, BEM-VINDO':'ACESSO À OFICINA';$('#auth-title').textContent=mode==='login'?'Que bom ter você por aqui.':mode==='request'?'Vamos localizar sua inscrição.':'Escolha uma senha.';$('#auth-desc').textContent=mode==='login'?'Entre com o e-mail usado na inscrição.':mode==='request'?'Vamos enviar um link de acesso para o e-mail usado na inscrição.': 'Crie uma senha para entrar na oficina.';$('#auth-submit').innerHTML=mode==='login'?'Entrar <span>↗</span>':mode==='request'?'Enviar instruções <span>↗</span>':'Salvar senha <span>↗</span>';const secure=location.protocol==='https:'||location.hostname==='127.0.0.1'||location.hostname==='localhost';$$('#auth-form input').forEach(input=>input.disabled=!secure);$('#auth-submit').disabled=!secure;if(!secure)$('#auth-status').textContent='O acesso estará disponível assim que a conexão segura for ativada. Volte em alguns minutos.';else $('#auth-email').focus({preventScroll:true})}
function storageSession(){try{return JSON.parse(localStorage.getItem('arcana_session')||'null')}catch{return null}}
function apiBase(){return `${ARCANA_CFG.supabaseUrl}/functions/v1/${ARCANA_CFG.accessFunction}`}
async function functionCall(payload,token){const r=await fetch(apiBase(),{method:'POST',headers:{'Content-Type':'application/json','apikey':ARCANA_CFG.supabaseAnon,...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(payload)});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Não foi possível concluir agora.');return data}
async function authRequest(email){return functionCall({action:'request',email})}
async function login(email,password){const r=await fetch(`${ARCANA_CFG.supabaseUrl}/auth/v1/token?grant_type=password`,{method:'POST',headers:{'Content-Type':'application/json','apikey':ARCANA_CFG.supabaseAnon},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw new Error(d.msg||d.message||'E-mail ou senha não conferem.');return d}
async function checkMember(session){return functionCall({action:'check'},session.access_token)}
function authCompleteFromHash(){const hash=new URLSearchParams(location.hash.slice(1));const access=hash.get('access_token');const type=hash.get('type');if(access){const session={access_token:access,refresh_token:hash.get('refresh_token'),expires_at:Math.floor(Date.now()/1000)+Number(hash.get('expires_in')||3600),user:{email:hash.get('user_email')||''}};localStorage.setItem('arcana_session',JSON.stringify(session));history.replaceState(null,'',location.pathname+location.search);if(type==='invite'||type==='recovery'){setAuthMode('password')}else resumeSession(session)}}
async function resumeSession(session){try{const member=await checkMember(session);if(!member.enrolled){localStorage.removeItem('arcana_session');throw new Error('Esta conta não está vinculada à inscrição da oficina. Use o e-mail do cadastro.')}const content=await functionCall({action:'content'},session.access_token);state.slides=content.slides||[];state.cardImages=content.cardImages||{};state.session=session;state.member=member;$('#user-email').textContent=session.user?.email||member.email||'';$('#user-email').hidden=false;$('#logout').hidden=false;$('#open-toc').hidden=false;$('#member-name').textContent=session.user?.email?`· ${session.user.email}`:'';visible('choose-mode')}catch(e){setAuthMode('login');$('#auth-status').textContent=e.message}}
async function handleAuth(event){event.preventDefault();const mode=state.authMode,status=$('#auth-status'),submit=$('#auth-submit');status.textContent='';submit.disabled=true;try{if(mode==='request'){const email=$('#auth-email').value.trim();if(!email)throw new Error('Informe o e-mail usado na inscrição.');await authRequest(email);status.textContent='Se encontrarmos uma inscrição com esse e-mail, as instruções chegarão em alguns minutos.'}
 else if(mode==='login'){const session=await login($('#auth-email').value.trim(),$('#auth-password').value);localStorage.setItem('arcana_session',JSON.stringify(session));await resumeSession(session)}
 else if(mode==='password'){const s=storageSession();const password=$('#new-password').value;if(password.length<10)throw new Error('Use uma senha com pelo menos 10 caracteres.');const r=await fetch(`${ARCANA_CFG.supabaseUrl}/auth/v1/user`,{method:'PUT',headers:{'Content-Type':'application/json','apikey':ARCANA_CFG.supabaseAnon,Authorization:`Bearer ${s?.access_token}`},body:JSON.stringify({password})});if(!r.ok)throw new Error('Não foi possível salvar a senha. Solicite um novo link.');$('#auth-status').textContent='Senha salva. Abrindo a oficina…';await resumeSession(s)}
 }catch(e){status.textContent=e.message}finally{submit.disabled=false}}
function openKnowledge(title,body,links=[],category='IDEIA EM CONTEXTO'){
 state.prevFocus=document.activeElement;
 $('#knowledge-title').textContent=title;
 $('#knowledge-category').textContent=category;
 $('#knowledge-body').innerHTML=body;
 $('#knowledge-cards').innerHTML='';
 $('#knowledge-links').innerHTML=links.length?'<h3>FONTES</h3>'+links.map(x=>{
  const source=typeof x==='string'?{title:x,url:x}:x;
  return source.book?`<span class="book-source">${esc(source.title)}</span>`:`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a>`;
 }).join(''):'';
 $('#knowledge').classList.add('open');$('#knowledge').setAttribute('aria-hidden','false');
 document.body.style.overflow='hidden';$('#main').inert=true;$('.topbar').inert=true;$('#toc-dialog').inert=true;if($('#tree-explorer'))$('#tree-explorer').inert=true;
 $('.knowledge-panel').focus();$('#knowledge').addEventListener('keydown',panelKeys);
}
function closeKnowledge(){if(!$('#knowledge').classList.contains('open'))return;$('#knowledge').classList.remove('open');$('#knowledge').setAttribute('aria-hidden','true');document.body.style.overflow=window.ArcanaTree?.isOpen()?'hidden':'';$('#main').inert=!!window.ArcanaTree?.isOpen();$('.topbar').inert=!!window.ArcanaTree?.isOpen();$('#toc-dialog').inert=false;if($('#tree-explorer'))$('#tree-explorer').inert=false;$('#knowledge').removeEventListener('keydown',panelKeys);state.prevFocus?.focus?.()}
function panelKeys(e){if(e.key==='Escape'){e.stopPropagation();closeKnowledge()}if(e.key==='Tab'){const a=$$('.knowledge-panel a,.knowledge-panel button').filter(x=>!x.disabled);if(!a.length)return;const first=a[0],last=a[a.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}
function makeLinks(n,webSources=[]){const out=[];const pages=bookPages[n]||[];for(const [key,description]of pages){const p=sources[key];if(p)out.push({...p,title:p.title+` · ${description}`})}for(const url of webSources){if(out.some(x=>x.url===url))continue;let found=Object.values(sources).find(x=>x.url===url);if(found){out.push(found);continue}let title=new URL(url).hostname;if(url.includes('commons.wikimedia.org/wiki/File:')){const file=decodeURIComponent(url.split('File:')[1]).replace(/\.(jpe?g|png|svg)$/i,'').replace(/_/g,' ').replace(/^RWS1909 - /,'Waite–Smith · ');title=`Imagem – ${file} · Wikimedia Commons`}out.push({title,url})}return out}
function imageUrl(path){
 if(!path)return '';
 if(path.startsWith('https://')||path.startsWith('assets/'))return path;
 if(path.startsWith('thoth/'))return state.cardImages?.[path.split('/').pop()]||(location.hostname==='127.0.0.1'&&location.port==='8000'?`assets/${path}`:'');
 return `assets/${path}`;
}
function visualMarkup(n,path){
 const alt={
  'hero.webp':'Cartas de tarô abertas em semicírculo sobre uma mesa escura',
  'visconti-world.webp':'Carta O Mundo do tarô Visconti-Sforza',
  'marseille-magician.webp':'O Mago em um tarô de Marselha',
  'rws-magician.webp':'O Mago no tarô Waite–Smith',
  'etteilla-astres.webp':'Carta Les Astres de um baralho Grand Etteilla',
  'rose-cross.webp':'Rosa-Cruz que reúne símbolos da Golden Dawn',
  'tree-kircher.webp':'Diagrama histórico da Árvore da Vida de Athanasius Kircher',
  'crowley.webp':'Retrato de Aleister Crowley',
  'thoth-spread.webp':'Cartas do Tarot de Thoth abertas sobre uma mesa'
 };
 const cardName=path.startsWith('thoth/')?cardInfo(path.split('/').pop().replace('Thot-','').replace('.webp','')).name:'';
 const imageAlt=path==='thoth/Thot-S-03.webp'?'Três de Espadas – Dor, do Tarot de Thoth, pintado por Lady Frieda Harris':cardName?`${cardName} do Tarot de Thoth, pintado por Lady Frieda Harris`:alt[path]||'Imagem do tarô relacionada ao tema';
 const src=imageUrl(path);
 return src?`<img src="${esc(src)}" alt="${esc(imageAlt)}" loading="lazy">`:'';
}
function compareVisual(){
 const items=[['Marselha','marseille-magician.webp'],['Waite–Smith','rws-magician.webp'],['Thoth','thoth/Thot-T-01.webp']];
 return `<div class="card-comparison">${items.map(([label,path])=>`<figure>${visualMarkup(12,path)}<figcaption>${esc(label)}</figcaption></figure>`).join('')}</div>`;
}
function suitsVisual(){
 const items=[['Paus','thoth/Thot-W-02.webp'],['Copas','thoth/Thot-C-02.webp'],['Espadas','thoth/Thot-S-02.webp'],['Discos','thoth/Thot-D-02.webp']];
 return `<div class="suit-comparison">${items.map(([label,path])=>`<figure>${visualMarkup(23,path)}<figcaption>${esc(label)}</figcaption></figure>`).join('')}</div>`;
}
function numbersVisual(){
 const items=['Kether','Chokmah','Binah','Chesed','Geburah','Tiphereth','Netzach','Hod','Yesod','Malkuth'];
 return `<ol class="number-map" aria-label="Dez posições numéricas na Árvore da Vida">${items.map((name,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><b>${name}</b></li>`).join('')}</ol>`;
}
function showSlide(){
 const list=state.module==='theory'?state.slides.slice(0,35):state.slides.slice(35);
 if(!list.length)return;
 state.idx=Math.max(0,Math.min(state.idx,list.length-1));
 const d=list[state.idx],n=d.number,extra=enrich[n]||{};
 const mainTexts=d.texts.filter(t=>!/^(A PROPOSTA|ESTRUTURA DO ENCONTRO|PARTE 1|PARTE 2|FECHAMENTO|FIM|[0-9]+|[A-Z0-9 ·–.,:+/()]+)$/.test(t.trim()));
 const title=extra.title||slideCopy[n]?.[0]||d.title;
 const lede=extra.lede||slideCopy[n]?.[1]||mainTexts.slice(1,3).join(' · ')||d.detail.split('.')[0]+'.';
 const special=extra.special||'';
 const keywords=extra.terms||[];
 let visual='';
 if(n===33)visual=renderTree();
 else if(n===24)visual=renderGematria();
 else if(n===12)visual=compareVisual();
 else if(n===23)visual=suitsVisual();
 else if(n===22)visual=numbersVisual();
 else visual=visualMarkup(n,extra.visual||visualFor(n));
 const accentedTitle=esc(title).split('\n').map((x,i)=>`${i?'<br>':''}${i===1?`<span class="accent">${esc(x)}</span>`:esc(x)}`).join('');
 $('#slide').innerHTML=n===33?visual:`<div class="slide-copy"><h1 data-open-detail="${n}" tabindex="0" role="button" aria-label="Abrir explicação de ${esc(title.replace(/\n/g,' '))}">${accentedTitle}</h1><p class="slide-lede" data-open-detail="${n}" tabindex="0" role="button" aria-label="Abrir explicação de ${esc(title.replace(/\n/g,' '))}">${esc(lede)}</p>${keywords.length?`<div class="slide-keywords">${keywords.map(k=>termButton(k)).join('')}</div>`:''}</div>${visual?`<div class="slide-visual ${special?'interactive-visual':''}">${visual}</div>`:''}`;
 $('#slide-current').textContent=String(state.idx+1).padStart(2,'0');
 $('#slide-total').textContent=String(list.length).padStart(2,'0');
 $('#lesson-module').textContent=state.module==='theory'?'TEORIA':'PRÁTICA';
 $('#progress-line span').style.width=`${((state.idx+1)/list.length)*100}%`;
 $('#prev-slide').disabled=state.idx===0;$('#next-slide').disabled=state.idx===list.length-1;
 $('#prev-slide').style.opacity=state.idx===0?'.42':'1';$('#next-slide').style.opacity=state.idx===list.length-1?'.42':'1';
 updateDots();
 if(n===24)bindGematria();if(n===33)bindTree();
}
function sectionLabel(n){if(n===33)return'SÍNTESE · ÁRVORE DA VIDA';if(n===18)return'SÍNTESE GUIADA';if(n===34||n===35)return'DA TEORIA À PRÁTICA';if(n===1)return'ABERTURA';if(n<=3)return'PONTO DE PARTIDA';if(n<=17)return'HISTÓRIA E ESTRUTURA';if(n<=25)return'ÁRVORE · GEMATRIA';if(n<=35)return'ASTROLOGIA';if(n<=37)return'ENTRADA NO LABORATÓRIO';return'EXERCÍCIOS DE ESCRITA'}
function visualFor(n){const map={1:'hero.webp',2:'rws-3swords.webp',3:'thoth-spread.webp',4:'visconti-world.webp',5:'visconti-world.webp',6:'visconti-world.webp',7:'visconti-world.webp',8:'thoth-spread.webp',9:'marseille-magician.webp',10:'thoth/Thot-S-03.webp',11:'thoth/Thot-S-PN.webp',13:'rws-magician.webp',14:'etteilla-astres.webp',15:'tree-kircher.webp',16:'rose-cross.webp',17:'rose-cross.webp',18:'thoth/Thot-T-02.webp',19:'tree-kircher.webp',21:'tree-kircher.webp',25:'thoth/Thot-T-00.webp',26:'crowley.webp',27:'thoth-spread.webp',28:'thoth-spread.webp',29:'thoth/Thot-C-02.webp',30:'thoth/Thot-T-17.webp',31:'thoth/Thot-S-02.webp',32:'thoth/Thot-T-01.webp',33:'thoth/Thot-C-02.webp',34:'thoth/Thot-T-14.webp',35:'hero.webp',36:'hero.webp',37:'rws-3swords.webp',38:'thoth/Thot-T-01.webp',39:'thoth/Thot-T-13.webp',40:'thoth/Thot-T-06.webp',41:'thoth/Thot-T-16.webp',42:'tree-kircher.webp',43:'thoth/Thot-T-00.webp',44:'thoth-spread.webp',45:'thoth/Thot-T-13.webp',46:'hero.webp'};return map[n]||'thoth-spread.webp'}
function updateDots(){const list=state.module==='theory'?state.slides.slice(0,35):state.slides.slice(35);$('#chapter-dots').innerHTML=list.map((s,i)=>`<button aria-label="Tela ${i+1}: ${esc(enrich[s.number]?.title?.replace(/\n/g,' ')||slideCopy[s.number]?.[0]||s.title)}" class="${i===state.idx?'active':i<state.idx?'done':''}" data-goto="${i}"></button>`).join('')}
function detailForSlide(n){const d=state.slides.find(x=>x.number===n);if(!d)return;let body=`<p>${esc(d.detail||'Esta tela propõe uma pausa para observar como a ideia pode mover uma história.')}</p>`;if(n===10)body='<p>Os 56 Arcanos Menores se distribuem em quatro naipes. Cada naipe reúne dez cartas numeradas e quatro figuras da corte. Essa estrutura permite observar uma situação em escala menor, por meio de uma imagem concreta.</p><p>O exemplo mostrado é o <b>Três de Espadas do Tarot de Thoth</b>, pintado por Lady Frieda Harris. Crowley a intitula <b>Dor</b> (Sorrow na carta em inglês). Sua descrição identifica uma espada reta que intercepta duas espadas curvas; o choque rompe a rosa central, enquanto uma tempestade se forma no fundo.</p><p>Para escrever, comece pelo que se vê: algo delicado no centro, duas formas antes unidas e uma terceira força que as atravessa. Quem interrompe o acordo? Escolha uma consequência concreta e transforme a composição em cena.</p><p>Mais adiante, veremos como o número três, o elemento Ar e a atribuição astrológica de Saturno em Libra acrescentam outras perguntas a esta imagem.</p>';
if(n===7)body+='<p>Distinção de método: a função lúdica é documentada antes da história esotérica. A leitura criativa usa as duas camadas com propósitos diferentes.</p>';if(n===18||n===20||n===21||n===24||n===25||n===32||n===33)body+='<p>As correspondências desta seção pertencem a uma tradição esotérica moderna. São um vocabulário simbólico útil para associação e escrita; não comprovam uma origem histórica secreta das cartas.</p>';const links=makeLinks(n,d.sources||[]);openKnowledge(enrich[n]?.title?.replace(/\n/g,' ')||slideCopy[n]?.[0]||d.title,body,links,sectionLabel(n))}
function renderTree(){return '<div id="tree-anchor" class="tree-anchor"></div>'}
function bindTree(){window.ArcanaTree.setup({sefirot,paths,majorNames,majors,cardInfo,mediaCard,openKnowledge,sources})}
const translit={A:['א','Aleph',1],B:['ב','Bet',2],C:['כ','Kaf',20],D:['ד','Dalet',4],E:['ה','He',5],F:['פ','Pe',80],G:['ג','Gimel',3],H:['ה','He',5],I:['י','Yod',10],J:['י','Yod',10],K:['כ','Kaf',20],L:['ל','Lamed',30],M:['מ','Mem',40],N:['נ','Nun',50],O:['ו','Vav',6],P:['פ','Pe',80],Q:['כ','Kaf',20],R:['ר','Resh',200],S:['ס','Samekh',60],T:['ת','Tav',400],U:['ו','Vav',6],V:['ו','Vav',6],W:['ו','Vav',6],X:['ס','Samekh',60],Y:['י','Yod',10],Z:['ז','Zayin',7]};
const astSigns=['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes'];
function calculateGematria(word){const chars=norm(word).toUpperCase().replace(/[^A-Z]/g,'').split('');if(!chars.length)return null;const letters=chars.map(c=>translit[c]).filter(Boolean),sum=letters.reduce((a,x)=>a+x[2],0),major=(sum-1)%22,sign=(sum-1)%12;return{sum,letters,major,sign}}
function renderGematria(){return `<div class="mini-tool"><label for="gematria-input">Escreva uma palavra (associação lúdica com transliteração simplificada)</label><div class="mini-tool-row"><input id="gematria-input" type="text" maxlength="48" placeholder="ex.: caminho"><button id="gematria-run">Relacionar ↗</button></div><div id="gematria-result" class="gematria-result" role="status" aria-live="polite">O resultado mostra uma associação para escrita – não uma tradução comprovada.</div></div>`}
function bindGematria(){const input=$('#gematria-input'),button=$('#gematria-run'),result=$('#gematria-result');if(!input||!button)return;const run=()=>{const r=calculateGematria(input.value);if(!r){result.textContent='Digite uma palavra em letras latinas.';return}const letters=r.letters.map(x=>`${x[0]} ${x[1]} ${x[2]}`).join(' · ');const m=majors[r.major],name=majorNames[r.major],sign=astSigns[r.sign];result.innerHTML=`<span>${esc(letters)}</span><br><b>Soma aproximada: ${r.sum}</b><br><button class="term" data-knowledge="O Louco" data-tag="Correspondência exploratória">Relação de escrita: ${esc(name)} · ${esc(m[1])} · ${esc(sign)} ↗</button><br><small>Mapeamento lúdico para escrita; uma transliteração simplificada não equivale à gematria de uma palavra hebraica original.</small>`;result.querySelector('button').onclick=()=>openKnowledge('Uma associação para investigar',`<p>A aproximação translitera letras latinas para letras hebraicas e soma seus valores tradicionais: <b>${r.sum}</b>.</p><p>Para oferecer uma pista de escrita, o número é reduzido ao ciclo 1–22 e associado a <b>${name}</b> (${m[0]}, ${m[1]}). Uma segunda redução identifica <b>${sign}</b>.</p><p>Essa é uma ferramenta de associação inventada para a oficina. A transliteração depende de convenções e não substitui a grafia hebraica, a língua ou o contexto. Use o resultado como pergunta criativa, não como prova ou diagnóstico.</p>`,[sources.crowleyGematria,sources.crowleyAleph],'FERRAMENTA DE ESCRITA · GEMATRIA')};button.onclick=run;input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();run()}}}
function showPractice(){const e=exercises[state.practiceIdx];$('#exercise').innerHTML=`<header class="exercise-heading"><div><p class="eyebrow">EXERCÍCIO ${String(state.practiceIdx+1).padStart(2,'0')} <span>·</span> SIMULAÇÃO</p><h1>${esc(e.title)}</h1></div><p>${esc(e.subtitle)}</p></header><div class="exercise-body"><section class="exercise-theory"><h2>Antes de tirar as cartas</h2><ol>${e.theory.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p>${termButton('A tiragem não decide a história','Princípio de leitura')}. Ela oferece uma estrutura para escolher e escrever.</p><div class="mini-tool"><label>Foco da escrita (opcional)</label><input id="focus-prompt" type="text" maxlength="90" placeholder="Uma pergunta ou ideia que você quer explorar"></div></section><section class="simulator"><div class="simulator-top"><h2>SIMULAÇÃO · ${e.count} ${e.count===1?'CARTA':'CARTAS'}</h2><select class="deck-select" aria-label="Baralho da simulação"><option value="thoth">Tarot de Thoth</option></select></div><button id="draw-cards" class="button button-primary draw-button">TIRAR CARTAS <span>↗</span></button><div id="spread" class="spread ${e.visual}" aria-live="polite" aria-label="Cartas sorteadas"></div><div id="interpretation" class="interpretation" hidden></div></section></div><div class="slide-nav"><button id="prev-exercise" class="slide-step">← Anterior</button><span class="slide-count">${String(state.practiceIdx+1).padStart(2,'0')} <i>/</i> ${String(exercises.length).padStart(2,'0')}</span><button id="next-exercise" class="slide-step">Próximo →</button></div>`;$('#draw-cards').onclick=()=>drawExercise(e);$('#prev-exercise').onclick=()=>{state.practiceIdx=(state.practiceIdx+exercises.length-1)%exercises.length;showPractice()};$('#next-exercise').onclick=()=>{state.practiceIdx=(state.practiceIdx+1)%exercises.length;showPractice()};$$('#practice-nav button').forEach((b,i)=>b.classList.toggle('active',i===state.practiceIdx));$$('[data-knowledge]').forEach(x=>x.onclick=()=>knowledgeFromTerm(x.dataset.knowledge,x.dataset.tag));}
function drawExercise(e){const codes=allCardCodes(),picked=[];while(picked.length<e.count){const c=codes[Math.floor(Math.random()*codes.length)];if(!picked.includes(c))picked.push(c)}const spread=$('#spread');spread.className=`spread ${e.visual}`;spread.innerHTML=picked.map((c,i)=>{const info=cardInfo(c),src=mediaCard(c);return `<div class="card-slot" data-position="${i+1}">${src?`<img class="card-image" src="${esc(src)}" alt="${esc(info.name)} do Tarot de Thoth">`:'<div class="card-image card-unavailable" aria-hidden="true">✳</div>'}<span class="card-position">${esc(e.positions[i])}</span><span class="card-name">${esc(info.name)}</span></div>`}).join('');const focus=$('#focus-prompt').value.trim();const inter=$('#interpretation');inter.hidden=false;const prompts=picked.map((c,i)=>{const card=cardInfo(c),p=e.positions[i];return `<p><b>${esc(p)} · ${esc(card.name)}</b><br>Observe ${esc(card.keys[2]||'a composição da carta')}. Que objeto, gesto ou decisão isso poderia produzir numa cena?</p>`}).join('');inter.innerHTML=`<h3>UMA HIPÓTESE NARRATIVA</h3>${prompts}<p class="reading-prompt">${esc(e.prompt)}${focus?`<br><br><b>Seu foco:</b> ${esc(focus)}`:''}</p><p>Escolha uma relação entre as cartas e escreva a cena. Você pode recusar qualquer associação que não mova a história.</p>`;inter.scrollIntoView({behavior:'smooth',block:'nearest'})}
function knowledgeFromTerm(term,tag='IDEIA EM CONTEXTO'){const key=norm(term);let body=`<p><b>${esc(term)}</b> funciona aqui como uma pista para observar a imagem e tomar uma decisão de escrita.</p><p>O objetivo é criar relações possíveis, não encontrar uma leitura única ou prever acontecimentos.</p>`,links=[];let category=tag;
if(key.includes('gematria')||key.includes('translit')){body='<p>Gematria é uma técnica de atribuir valores numéricos a letras hebraicas e comparar palavras em seus contextos linguísticos e religiosos.</p><p>Quando uma palavra em português é transliterada para outro alfabeto, as escolhas de som e ortografia alteram o resultado. Por isso, a calculadora desta oficina se identifica como uma aproximação lúdica para gerar perguntas narrativas – não como gematria tradicional.</p>';links=[sources.crowleyGematria,sources.fortuneGematria]}
else if(key.includes('arvore')||key.includes('sephiroth')||key.includes('caminho')){body='<p>A Árvore da Vida que aparece aqui é a versão hermética ocidental, adaptada para o currículo da Golden Dawn. A tradição cabalística judaica é diversa e anterior a essa apropriação.</p><p>Os dez centros (Sephiroth) e os 22 caminhos formam um diagrama de relações. Nesta oficina, a estrutura vira um mapa para pensar transformação, tensão e movimento entre ideias.</p>';links=[sources.crowleyTree,sources.fortune]}
else if(key.includes('crowley')||key.includes('harris')||key.includes('frieda')){body='<p>Aleister Crowley reorganizou correspondências da Golden Dawn em seu sistema de tarô. Lady Frieda Harris pintou as cartas do Thoth entre 1937 e 1943 a partir de suas orientações.</p><p>Ivan escolheu esse baralho por ter conseguido tornar visíveis as correspondências como um sistema único. Qualquer deck pode servir: a familiaridade com as imagens é mais importante que a escolha de uma tradição específica.</p>';links=[sources.cambridge,sources.crowleyTitle,sources.warburg]}
else if(key.includes('sacerdotisa')||key.includes('gimel')||key.includes('lua')){body='<p>No sistema Golden Dawn, a Sacerdotisa é associada à letra Gimel, à Lua e ao caminho entre Kether e Tiphereth. Crowley preserva muitas relações do sistema, com alterações específicas.</p><p>Como pergunta narrativa: que travessia se passa entre uma possibilidade e uma identidade já formada?</p>';links=[sources.crowleyPriestess]}
else if(key.includes('aleph')||key.includes('louco')){body='<p>O Louco corresponde à letra Aleph e ao elemento Ar na tabela usada por Crowley. Em uma oficina de escrita, essa relação pode sugerir começo, deslocamento ou movimento ainda sem forma.</p><p>É uma convenção simbólica da tradição esotérica moderna, não um fato sobre a origem histórica dos tarôs.</p>';links=[sources.crowleyAleph]}
else if(key.includes('historia factual')){body='<p>As referências mais antigas ao tarô situam os baralhos no norte da Itália do século XV, como parte de jogos de cartas. As leituras ocultistas são posteriores.</p>';links=[sources.metmuseum,sources.warburg]}
else if(key.includes('quatro sistemas')){body='<p>Na tradição da Golden Dawn, cartas, letras, Árvore da Vida e astrologia formam uma rede de correspondências. A oficina usa essa rede como repertório de relações simbólicas para a escrita.</p>';links=[sources.cambridge,sources.crowleyTree]}
else if(key.includes('tarot')||key.includes('imagem')||key.includes('escolha')||key.includes('associacao')){body+='<p>A página oficial define a oficina como uso do tarô enquanto repertório visual e estrutura para criar. A prática começa descrevendo gesto, cenário e tensão antes de procurar uma interpretação pronta.</p>';links=[sources.course]}
openKnowledge(term,body,links,category)}
function buildIndex(){const theory=state.module==='theory';const list=theory?state.slides.slice(0,35):exercises;$('#toc-title').textContent=theory?'Teoria':'Exercícios';$('#toc-list').innerHTML=list.map((s,i)=>`<button data-index="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(theory?(enrich[s.number]?.title?.replace(/\n/g,' ')||slideCopy[s.number]?.[0]||s.title):s.title)}</b></button>`).join('');$$('#toc-list button').forEach(b=>b.onclick=()=>{if(theory){state.idx=+b.dataset.index;$('#toc-dialog').close();visible('lesson');showSlide()}else{state.practiceIdx=+b.dataset.index;$('#toc-dialog').close();visible('practice');showPractice()}})}
function startModule(name){state.module=name;if(name==='practice'){state.practiceIdx=0;visible('practice');$('#practice-nav').innerHTML=exercises.map((e,i)=>`<button data-exercise="${i}">${String(i+1).padStart(2,'0')} · ${esc(e.title)}</button>`).join('');$$('#practice-nav button').forEach(b=>b.onclick=()=>{state.practiceIdx=+b.dataset.exercise;showPractice()});showPractice()}else{state.idx=0;visible('lesson');showSlide()}}
$('#auth-form').addEventListener('submit',handleAuth);
$$('[data-view="login"]').forEach(x=>x.onclick=()=>setAuthMode('login'));$$('[data-view="request"]').forEach(x=>x.onclick=()=>setAuthMode('request'));$$('[data-view="welcome"]').forEach(x=>x.onclick=()=>visible('welcome'));
$('#logout').onclick=()=>{localStorage.removeItem('arcana_session');state.member=null;state.session=null;$('#user-email').hidden=true;$('#logout').hidden=true;$('#open-toc').hidden=true;visible('welcome')};
$$('[data-module]').forEach(b=>b.onclick=()=>startModule(b.dataset.module));
$('#lesson-back').onclick=()=>visible('choose-mode');$('#practice-back').onclick=()=>visible('choose-mode');$('#prev-slide').onclick=()=>{state.idx--;showSlide()};$('#next-slide').onclick=()=>{state.idx++;showSlide()};
$('#slide').addEventListener('click',e=>{const goto=e.target.closest('[data-goto]');if(goto){state.idx=+goto.dataset.goto;showSlide();return}const t=e.target.closest('[data-knowledge]');if(t){knowledgeFromTerm(t.dataset.knowledge,t.dataset.tag);return}const d=e.target.closest('[data-open-detail]');if(d)detailForSlide(+d.dataset.openDetail)});
$('#chapter-dots').addEventListener('click',e=>{const b=e.target.closest('[data-goto]');if(b){state.idx=+b.dataset.goto;showSlide()}});
$$('[data-close-knowledge]').forEach(x=>x.onclick=closeKnowledge);$('#open-toc').onclick=()=>{state.module=state.view==='practice'?'practice':'theory';buildIndex();$('#toc-dialog').showModal()};$('#lesson-map').onclick=()=>{buildIndex();$('#toc-dialog').showModal()};$('#practice-index').onclick=()=>{state.module='practice';buildIndex();$('#toc-dialog').showModal()};$('#close-toc').onclick=()=>$('#toc-dialog').close();$('#toc-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
document.addEventListener('keydown',e=>{if(state.view==='lesson'&&!window.ArcanaTree?.isOpen()&&!$('#knowledge').classList.contains('open')&&!$('#toc-dialog').open){if(e.key==='ArrowRight'){state.idx++;showSlide()}if(e.key==='ArrowLeft'){state.idx--;showSlide()}if((e.key==='Enter'||e.key===' ')&&e.target.hasAttribute('data-open-detail')){e.preventDefault();detailForSlide(+e.target.dataset.openDetail)}}});

const localPreview=location.hostname==='127.0.0.1'&&location.port==='8000';if(localPreview){fetch('data/slides.json').then(r=>r.json()).then(slides=>{state.slides=slides;state.member={email:'Prévia local'};$('#member-name').textContent='· prévia local';visible('choose-mode')}).catch(()=>visible('welcome'))}else{const session=storageSession();if(session&&session.access_token&&session.expires_at>Date.now()/1000)resumeSession(session);authCompleteFromHash()}
})();
