// ==========================================
// 1. TEMPLATES E DADOS 
// ==========================================

const ITENS = {
    carvao: { nome: "Carvão", imagem: "assets/coal-ore.png", inicial: true },
    minerio_ferro: { nome: "Min. Ferro", imagem: "assets/iron-ore.png" },
    minerio_cobre: { nome: "Min. Cobre", imagem: "assets/copper-ore.png" },
    lingote_ferro: { nome: "Ling. Ferro", imagem: "assets/iron-ingot.png" },
    lingote_cobre: { nome: "Ling. Cobre", imagem: "assets/copper-ingot.png" },
    lingote_aco: { nome: "Ling. Aço", imagem: "assets/steel-ingot.png" },
    chapa_ferro: { nome: "Chapa Ferro", imagem: "assets/iron-sheet.png", inicial: true },
    chapa_cobre: { nome: "Chapa Cobre", imagem: "assets/copper-sheet.png", inicial: true },
    chapa_aco: { nome: "Chapa Aço", imagem: "assets/steel-sheet.png" },
    barra_ferro: { nome: "Barra de Ferro", imagem: "assets/iron-rod.png" },
    parafuso: { nome: "Parafusos", imagem: "assets/screws.png" },
    fio_cobre: { nome: "Fio Cobre", imagem: "assets/copper-wire.png" },
    cabo_eletrico: { nome: "Cabo Elétrico", imagem: "assets/cable.png" },
    chapa_reforcada: { nome: "Chapa Reforçada", imagem: "assets/reinforced-sheet.png" }
};

let inventario = {
    pesquisa_verde: 0, pesquisa_vermelha: 0,
    carvao: 50, minerio_ferro: 0, minerio_cobre: 0, 
    lingote_ferro: 0, lingote_cobre: 0, lingote_aco: 0,
    chapa_ferro: 100, chapa_cobre: 100, chapa_aco: 0,
    barra_ferro: 0, parafuso: 0, fio_cobre: 0,
    cabo_eletrico: 0, chapa_reforcada: 0
};

const PRECOS_PESQUISA = { 
    chapa_ferro: { tipo: 'verde', valor: 1 }, 
    chapa_cobre: { tipo: 'verde', valor: 1 }, 
    barra_ferro: { tipo: 'verde', valor: 2 },
    parafuso: { tipo: 'verde', valor: 2 }, 
    fio_cobre: { tipo: 'verde', valor: 2 },
    cabo_eletrico: { tipo: 'vermelha', valor: 1 },
    chapa_aco: { tipo: 'vermelha', valor: 2 }, 
    chapa_reforcada: { tipo: 'vermelha', valor: 4 }
};

let energiaGerada = 0;
let energiaConsumida = 0;

const MAQUINAS = {
    gerador_carvao: { nome: "Gerador a Carvão", imagem: "assets/coal-generator.png", tempoCiclo: 4000, custo: { chapa_ferro: 25, chapa_cobre: 25 }, entrada: { carvao: 1 }, saida: {}, geraEnergia: 50, textoInspecao: "Gera: 50 Energia<br>Usa: 15 <img src='assets/coal-ore.png' class='icone-texto'> / min" },
    mineradora_carvao: { nome: "Mineradora (Carvão)", imagem: "assets/miner.png", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { carvao: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 <img src='assets/coal-ore.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    mineradora_cobre: { nome: "Mineradora (Cobre)", imagem: "assets/miner.png", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { minerio_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 <img src='assets/copper-ore.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    mineradora_ferro: { nome: "Mineradora (Ferro)", imagem: "assets/miner.png", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { minerio_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 <img src='assets/iron-ore.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    fornalha_ferro: { nome: "Fornalha (Ferro)", imagem: "assets/smelter.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { minerio_ferro: 1 }, saida: { lingote_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 <img src='assets/iron-ore.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/iron-ingot.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    fornalha_cobre: { nome: "Fornalha (Cobre)", imagem: "assets/smelter.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { minerio_cobre: 1 }, saida: { lingote_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 <img src='assets/copper-ore.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/copper-ingot.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    fundicao_aco: { nome: "Fundição (Aço)", imagem: "assets/fundicao.png", tempoCiclo: 4000, custo: { chapa_ferro: 20 }, entrada: { minerio_ferro: 1, carvao: 1 }, saida: { lingote_aco: 2 }, consomeEnergia: 10, textoInspecao: "Entra: 15 <img src='assets/iron-ore.png' class='icone-texto'> + 15 <img src='assets/coal-ore.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/steel-ingot.png' class='icone-texto'> / min<br>Usa: 10 Energia" },
    montadora_ferro: { nome: "Mont. (Chapa Ferro)", imagem: "assets/montadora.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { chapa_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 <img src='assets/iron-ingot.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/iron-sheet.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    montadora_barra: { nome: "Mont. (Barra Ferro)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { barra_ferro: 2 }, consomeEnergia: 5, textoInspecao: "Entra: 15 <img src='assets/iron-ingot.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/iron-rod.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    montadora_parafuso: { nome: "Mont. (Parafusos)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { parafuso: 2 }, consomeEnergia: 5, textoInspecao: "Entra: 15 <img src='assets/iron-ingot.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/screws.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    montadora_cobre: { nome: "Mont. (Chapa Cobre)", imagem: "assets/montadora.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { lingote_cobre: 1 }, saida: { chapa_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 <img src='assets/copper-ingot.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/copper-sheet.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    montadora_fio: { nome: "Mont. (Fio Cobre)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_cobre: 1 }, saida: { fio_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 15 <img src='assets/copper-ingot.png' class='icone-texto'> / min<br>Sai: 15 <img src='assets/copper-wire.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    montadora_cabo: { nome: "Mont. (Cabo Elétrico)", imagem: "assets/montadora.png", tempoCiclo: 2000, custo: { chapa_ferro: 15 }, entrada: { fio_cobre: 2 }, saida: { cabo_eletrico: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 60 <img src='assets/copper-wire.png' class='icone-texto'> / min<br>Sai: 30 <img src='assets/cable.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    montadora_aco: { nome: "Mont. (Chapa Aço)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 15 }, entrada: { lingote_aco: 2 }, saida: { chapa_aco: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 <img src='assets/steel-ingot.png' class='icone-texto'> / min<br>Sai: 15 <img src='assets/steel-sheet.png' class='icone-texto'> / min<br>Usa: 5 Energia" },
    montadora_reforcada: { nome: "Mont. (Reforçada)", imagem: "assets/montadora.png", tempoCiclo: 12000, custo: { chapa_ferro: 20 }, entrada: { parafuso: 12, chapa_ferro: 6 }, saida: { chapa_reforcada: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 60 <img src='assets/screws.png' class='icone-texto'> + 30 <img src='assets/iron-sheet.png' class='icone-texto'> / min<br>Sai: 5 <img src='assets/reinforced-sheet.png' class='icone-texto'> / min<br>Usa: 5 Energia" }
};

// ==========================================
// 2. SISTEMA DE ÁRVORE DE PESQUISA 
// ==========================================

const ARVORE_PESQUISA = {
    parafuso: { titulo: "Parafusos", imagem: "assets/screws.png", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_parafuso", "card-venda-parafuso"], comprada: false },
    cabo: { titulo: "Cabo Elétrico", imagem: "assets/cable.png", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_cabo", "card-venda-cabo_eletrico"], comprada: false },
    aco: { titulo: "Lingote de Aço", imagem: "assets/steel-ingot.png", verde: 50, vermelho: 15, requisita: ["parafuso", "cabo"], destravaDOM: ["btn-fundicao_aco"], comprada: false },
    chapa_aco: { titulo: "Chapa de Aço", imagem: "assets/steel-sheet.png", verde: 50, vermelho: 50, requisita: ["aco"], destravaDOM: ["btn-montadora_aco", "card-venda-chapa_aco"], comprada: false },
    chapa_reforcada: { titulo: "Chapa Reforçada", imagem: "assets/reinforced-sheet.png", verde: 100, vermelho: 100, requisita: ["chapa_aco"], destravaDOM: ["btn-montadora_reforcada", "card-venda-reforcada"], comprada: false }
};

const LAYOUT_ARVORE = [
    ["parafuso", "cabo"], 
    ["aco"],              
    ["chapa_aco"],        
    ["chapa_reforcada"]   
];

function abrirArvore() {
    document.getElementById("modal-arvore").classList.remove("escondido");
    renderizarArvore();
}
function fecharArvore() { document.getElementById("modal-arvore").classList.add("escondido"); }

function renderizarArvore() {
    const container = document.getElementById("container-arvore-nodes");
    container.innerHTML = "";
    document.getElementById("modal-verde").innerText = inventario.pesquisa_verde;
    document.getElementById("modal-vermelha").innerText = inventario.pesquisa_vermelha;

    LAYOUT_ARVORE.forEach(coluna => {
        const divColuna = document.createElement("div");
        divColuna.className = "coluna-tech";

        coluna.forEach(idNode => {
            const tech = ARVORE_PESQUISA[idNode];
            const divNode = document.createElement("div");
            
            let todasRequisicoesCompradas = true;
            tech.requisita.forEach(reqId => { if (!ARVORE_PESQUISA[reqId].comprada) todasRequisicoesCompradas = false; });

            if (tech.comprada) {
                divNode.className = "node-tech comprado";
                divNode.innerHTML = `
                    <div class="node-tech-titulo"><img src="${tech.imagem}" class="icone-tech">${tech.titulo}</div>
                    <div style="color:#2ecc71; font-weight:bold;">Pesquisado ✔️</div>
                `;
            } else if (todasRequisicoesCompradas) {
                divNode.className = "node-tech disponivel";
                divNode.innerHTML = `
                    <div class="node-tech-titulo"><img src="${tech.imagem}" class="icone-tech">${tech.titulo}</div>
                    <div class="node-tech-custo">Custo:<br>${tech.verde > 0 ? tech.verde + " <img src='assets/research-green.png' class='icone-texto'>" : ''} ${tech.vermelho > 0 ? tech.vermelho + " <img src='assets/research-red.png' class='icone-texto'>" : ''}</div>
                    <div style="font-size: 0.8em; color: #f1c40f;">(Clique para pesquisar)</div>
                `;
                divNode.onclick = () => comprarTecnologia(idNode);
            } else {
                divNode.className = "node-tech bloqueado";
                divNode.innerHTML = `
                    <div class="node-tech-titulo">???</div>
                    <div class="node-tech-custo">Bloqueado</div>
                    <div style="font-size: 0.8em; color: #aaa;">Requer pesquisas anteriores</div>
                `;
            }
            divColuna.appendChild(divNode);
        });
        container.appendChild(divColuna);
    });
}

function comprarTecnologia(id) {
    const tech = ARVORE_PESQUISA[id];
    if (inventario.pesquisa_verde >= tech.verde && inventario.pesquisa_vermelha >= tech.vermelho) {
        inventario.pesquisa_verde -= tech.verde;
        inventario.pesquisa_vermelha -= tech.vermelho;
        tech.comprada = true;
        tech.destravaDOM.forEach(idDOM => {
            const elemento = document.getElementById(idDOM);
            if (elemento) elemento.classList.remove("trancado");
        });
        mostrarNotificacao(`Pesquisa Concluída: ${tech.titulo}`, "pesquisa");
        renderizarArvore(); 
    } else { mostrarNotificacao("Pontos Insuficientes!"); }
}

// ==========================================
// 3. SISTEMA DE UI
// ==========================================

function expandirTudo() { document.querySelectorAll('#aba-construir details').forEach(det => det.open = true); }
function recolherTudo() { document.querySelectorAll('#aba-construir details').forEach(det => det.open = false); }
function mudarAba(abaNome) {
    document.querySelectorAll('.aba-conteudo').forEach(el => el.classList.remove('ativo'));
    document.querySelectorAll('.aba-btn').forEach(el => el.classList.remove('ativo'));
    document.getElementById(`aba-${abaNome}`).classList.add('ativo');
    document.getElementById(`aba-btn-${abaNome}`).classList.add('ativo');
}

function mostrarNotificacao(mensagem, tipo = "erro") {
    const container = document.getElementById("container-notificacoes");
    const notif = document.createElement("div");
    notif.className = `notificacao ${tipo}`;
    notif.innerHTML = mensagem; // Alterado para innerHTML para suportar ícones nas notificações
    container.appendChild(notif);
    setTimeout(() => { notif.classList.add("sumindo"); setTimeout(() => notif.remove(), 400); }, 3000);
}

function gerarPesquisa(item_id, quantity) {
    let qtdParaVender = quantity === "tudo" ? inventario[item_id] : quantity;
    if (qtdParaVender > 0 && inventario[item_id] >= qtdParaVender) {
        const dadosPesquisa = PRECOS_PESQUISA[item_id];
        const ganhoFinal = qtdParaVender * dadosPesquisa.valor;
        inventario[item_id] -= qtdParaVender;
        if (dadosPesquisa.tipo === 'verde') { inventario.pesquisa_verde += ganhoFinal; mostrarNotificacao(`+${ganhoFinal} Básica`, "sucesso"); } 
        else { inventario.pesquisa_vermelha += ganhoFinal; mostrarNotificacao(`+${ganhoFinal} Avançada`, "sucesso"); }
    } else { mostrarNotificacao(`Faltam itens!`); }
}

function salvarJogo(silencioso = false) {
    const dadosSave = { inventario: inventario, terreno: terrenoBloqueado, arvore: {}, mapa: [] };
    for (const [key, tech] of Object.entries(ARVORE_PESQUISA)) { dadosSave.arvore[key] = tech.comprada; }
    for (let c = 0; c < COLUNAS; c++) {
        dadosSave.mapa[c] = [];
        for (let l = 0; l < LINHAS; l++) {
            let maq = mapa[c][l];
            if (maq) { dadosSave.mapa[c][l] = { tipo: maq.tipo, progresso: maq.progresso }; } 
            else { dadosSave.mapa[c][l] = null; }
        }
    }
    localStorage.setItem('meu_save_fabrica_final', JSON.stringify(dadosSave));
    if(!silencioso) { mostrarNotificacao("Progresso Salvo!", "sucesso"); }
}

function carregarJogo(silencioso = false) {
    const saveStr = localStorage.getItem('meu_save_fabrica_final');
    if (!saveStr) { if(!silencioso) mostrarNotificacao("Nenhum save encontrado!"); return; }
    
    try {
        const dadosSave = JSON.parse(saveStr);
        if (!dadosSave.inventario || !dadosSave.terreno) throw new Error("Incompatível");

        inventario = dadosSave.inventario;
        terrenoBloqueado = dadosSave.terreno;

        for (const [key, comprada] of Object.entries(dadosSave.arvore)) {
            if(ARVORE_PESQUISA[key]) {
                ARVORE_PESQUISA[key].comprada = comprada;
                if (comprada) {
                    ARVORE_PESQUISA[key].destravaDOM.forEach(idDOM => {
                        const elemento = document.getElementById(idDOM);
                        if (elemento) elemento.classList.remove("trancado");
                    });
                }
            }
        }

        for (let c = 0; c < COLUNAS; c++) {
            for (let l = 0; l < LINHAS; l++) {
                let dadosMaq = dadosSave.mapa[c][l];
                if (dadosMaq) {
                    let novaMaq = new Maquina(dadosMaq.tipo); novaMaq.progresso = dadosMaq.progresso; mapa[c][l] = novaMaq;
                } else { mapa[c][l] = null; }
            }
        }
        if (!document.getElementById("modal-arvore").classList.contains("escondido")) { renderizarArvore(); }
        if(!silencioso) mostrarNotificacao("Progresso Carregado!", "sucesso");
    } catch(e) {
        mostrarNotificacao("Erro: Save antigo. Resete o jogo.");
    }
}

function resetarJogo() { if(confirm("Apagar todo o save?")) { localStorage.removeItem('meu_save_fabrica_final'); location.reload(); } }

// ==========================================
// 4. INICIANDO O PIXIJS E A GRADE
// ==========================================

const TAMANHO_CELULA = 60; const COLUNAS = 10; const LINHAS = 10;

const app = new PIXI.Application({
    view: document.getElementById("telaDoJogo"),
    width: COLUNAS * TAMANHO_CELULA, 
    height: LINHAS * TAMANHO_CELULA,
    backgroundColor: 0x111111, 
    resolution: window.devicePixelRatio || 1, 
    autoDensity: true 
});

let mapa = []; let terrenoBloqueado = []; let modoExpansaoAtivo = false; let tipoExpansao = null; let objetosVisuais = []; 

for (let c = 0; c < COLUNAS; c++) {
    mapa[c] = []; terrenoBloqueado[c] = []; objetosVisuais[c] = [];
    for (let l = 0; l < LINHAS; l++) { 
        mapa[c][l] = null; 
        if (c >= 3 && c <= 5 && l >= 3 && l <= 5) { terrenoBloqueado[c][l] = false; } else { terrenoBloqueado[c][l] = true; }

        const blocoContainer = new PIXI.Container();
        blocoContainer.x = c * TAMANHO_CELULA; blocoContainer.y = l * TAMANHO_CELULA;
        const fundo = new PIXI.Graphics(); blocoContainer.addChild(fundo);
        
        const imgSprite = new PIXI.Sprite();
        imgSprite.anchor.set(0.5); imgSprite.x = TAMANHO_CELULA / 2; imgSprite.y = TAMANHO_CELULA / 2;
        blocoContainer.addChild(imgSprite);

        const barraFundo = new PIXI.Graphics();
        barraFundo.beginFill(0x000000, 0.5); barraFundo.drawRect(0, TAMANHO_CELULA - 6, TAMANHO_CELULA, 6); barraFundo.endFill();
        blocoContainer.addChild(barraFundo);
        const barraProgresso = new PIXI.Graphics(); blocoContainer.addChild(barraProgresso);

        app.stage.addChild(blocoContainer);
        objetosVisuais[c][l] = { fundo, imgSprite, barraFundo, barraProgresso };
    }
}

let maquinaSelecionada = null; let maquinaNaMao = null; 
let maquinaOrigemX = null; let maquinaOrigemY = null;

function selecionarConstrucao(tipo) {
    modoExpansaoAtivo = false; maquinaSelecionada = tipo;
    if (maquinaNaMao && (tipo !== 'ferramenta_mover')) { 
        if (maquinaOrigemX !== null && maquinaOrigemY !== null && !mapa[maquinaOrigemX][maquinaOrigemY]) {
            mapa[maquinaOrigemX][maquinaOrigemY] = maquinaNaMao;
        } else { alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1); }
        maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null;
    }
    document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado"));
    const btn = document.getElementById(`btn-${tipo}`); if (btn) btn.classList.add("selecionado");
    document.getElementById("tooltip-maquina").classList.add("escondido");
}

function comprarExpansao(tipo) {
    const custo = 50;
    if (tipo === 'verde' && inventario.pesquisa_verde < custo) { mostrarNotificacao("Pontos Básicos Insuficientes!"); return; }
    if (tipo === 'vermelho' && inventario.pesquisa_vermelha < custo) { mostrarNotificacao("Pontos Avançados Insuficientes!"); return; }
    
    if (maquinaNaMao) { 
        if (maquinaOrigemX !== null && maquinaOrigemY !== null && !mapa[maquinaOrigemX][maquinaOrigemY]) { mapa[maquinaOrigemX][maquinaOrigemY] = maquinaNaMao; } 
        else { alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1); }
        maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null;
    }
    modoExpansaoAtivo = true; tipoExpansao = tipo; maquinaSelecionada = null; 
    document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado"));
    document.getElementById("tooltip-maquina").classList.add("escondido");
    mostrarNotificacao("Clique em um bloco brilhante para expandir!", "sucesso");
}

function podePagar(custo) { for (const [item, qtd] of Object.entries(custo)) { if (inventario[item] < qtd) return false; } return true; }
function alterarInventario(custo, multiplicar = 1) { for (const [item, qtd] of Object.entries(custo)) { inventario[item] -= qtd * multiplicar; } }

// ==========================================
// 5. CLASSES E LÓGICA DE PRODUÇÃO
// ==========================================

class Maquina {
    constructor(tipo) { this.tipo = tipo; this.progresso = 0; this.ligada = false; }
    atualizarGerador(deltaTempo) {
        const ref = MAQUINAS[this.tipo];
        if (this.progresso <= 0) {
            if (inventario.carvao >= 1) { inventario.carvao -= 1; this.progresso = ref.tempoCiclo; this.ligada = true; } 
            else { this.ligada = false; }
        } else { this.progresso -= deltaTempo; this.ligada = true; }
    }
    atualizarConsumidor(deltaTempo, temEnergiaSuficiente) {
        const ref = MAQUINAS[this.tipo];
        if (!temEnergiaSuficiente) { this.ligada = false; return; }
        let temIngredientes = true;
        for (const [item, qtd] of Object.entries(ref.entrada)) { if (inventario[item] < qtd) { temIngredientes = false; break; } }
        if (temIngredientes) {
            this.ligada = true; this.progresso += deltaTempo;
            if (this.progresso >= ref.tempoCiclo) {
                for (const [item, qtd] of Object.entries(ref.entrada)) inventario[item] -= qtd;
                for (const [item, qtd] of Object.entries(ref.saida)) inventario[item] += qtd;
                this.progresso -= ref.tempoCiclo;
            }
        } else { this.ligada = false; }
    }
}

function processarFabrica(deltaTempo) {
    energiaGerada = 0; energiaConsumida = 0; let maquinasAtivas = [];
    for (let c = 0; c < COLUNAS; c++) { for (let l = 0; l < LINHAS; l++) { if (mapa[c][l]) maquinasAtivas.push(mapa[c][l]); } }
    maquinasAtivas.forEach(m => { if (MAQUINAS[m.tipo].geraEnergia) { m.atualizarGerador(deltaTempo); if (m.ligada) energiaGerada += MAQUINAS[m.tipo].geraEnergia; } });
    maquinasAtivas.forEach(m => {
        const ref = MAQUINAS[m.tipo];
        if (ref.consomeEnergia) {
            if (energiaGerada - energiaConsumida >= ref.consomeEnergia) { energiaConsumida += ref.consomeEnergia; m.atualizarConsumidor(deltaTempo, true); } 
            else { m.atualizarConsumidor(deltaTempo, false); }
        }
    });
}

// ==========================================
// 6. INTERAÇÃO E RENDERIZAÇÃO
// ==========================================

const canvasDOM = document.getElementById("telaDoJogo");
canvasDOM.addEventListener("contextmenu", evento => evento.preventDefault());

canvasDOM.addEventListener("mousedown", (evento) => {
    if (!document.getElementById("modal-arvore").classList.contains("escondido")) return;

    const rect = canvasDOM.getBoundingClientRect();
    const col = Math.floor((evento.clientX - rect.left) / TAMANHO_CELULA);
    const lin = Math.floor((evento.clientY - rect.top) / TAMANHO_CELULA);
    const tooltip = document.getElementById("tooltip-maquina");

    tooltip.classList.add("escondido");

    if (evento.button === 2) {
        if (maquinaNaMao) { 
            if (maquinaOrigemX !== null && maquinaOrigemY !== null && !mapa[maquinaOrigemX][maquinaOrigemY]) { mapa[maquinaOrigemX][maquinaOrigemY] = maquinaNaMao; } 
            else { alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1); }
            maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null;
            mostrarNotificacao("Mão limpa. Movimentação cancelada.", "sucesso"); return; 
        }
        if (maquinaSelecionada || modoExpansaoAtivo) { maquinaSelecionada = null; modoExpansaoAtivo = false; document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado")); return; } 
        return;
    }

    if (evento.button === 0) {
        if (modoExpansaoAtivo) {
            if (terrenoBloqueado[col][lin]) {
                let temVizinho = (col > 0 && !terrenoBloqueado[col-1][lin]) || (col < COLUNAS-1 && !terrenoBloqueado[col+1][lin]) || 
                                 (lin > 0 && !terrenoBloqueado[col][lin-1]) || (lin < LINHAS-1 && !terrenoBloqueado[col][lin+1]);
                if (temVizinho) {
                    let custo = 50; let qDesb = (tipoExpansao === 'verde') ? 1 : 5;
                    if (tipoExpansao === 'verde' && inventario.pesquisa_verde >= custo) { inventario.pesquisa_verde -= custo; } 
                    else if (tipoExpansao === 'vermelho' && inventario.pesquisa_vermelha >= custo) { inventario.pesquisa_vermelha -= custo; } 
                    else { mostrarNotificacao("Pontos Insuficientes!"); modoExpansaoAtivo = false; return; }

                    terrenoBloqueado[col][lin] = false; qDesb--;
                    while (qDesb > 0) {
                        let cand = [];
                        for (let c = 0; c < COLUNAS; c++) { for (let l = 0; l < LINHAS; l++) { if (terrenoBloqueado[c][l]) { let v = (c > 0 && !terrenoBloqueado[c-1][l]) || (c < COLUNAS-1 && !terrenoBloqueado[c+1][l]) || (l > 0 && !terrenoBloqueado[c][l-1]) || (l < LINHAS-1 && !terrenoBloqueado[c][l+1]); if (v) cand.push({c, l}); } } }
                        if (cand.length > 0) { let es = cand[Math.floor(Math.random() * cand.length)]; terrenoBloqueado[es.c][es.l] = false; qDesb--; } else { break; }
                    }
                    modoExpansaoAtivo = false; mostrarNotificacao("Terreno Expandido!", "sucesso");
                } else { mostrarNotificacao("Escolha um bloco vizinho!"); }
            } else { modoExpansaoAtivo = false; }
            return; 
        }

        if (terrenoBloqueado[col][lin]) { mostrarNotificacao("Terreno Bloqueado!"); return; }

        if (maquinaSelecionada === "ferramenta_remover") {
            if (mapa[col][lin]) { const mqD = mapa[col][lin].tipo; alterarInventario(MAQUINAS[mqD].custo, -1); mapa[col][lin] = null; mostrarNotificacao("Máquina Removida", "sucesso"); } return;
        }
        if (maquinaSelecionada === "ferramenta_mover") {
            if (!maquinaNaMao && mapa[col][lin]) { maquinaNaMao = mapa[col][lin]; maquinaOrigemX = col; maquinaOrigemY = lin; mapa[col][lin] = null; mostrarNotificacao("Selecione o novo local"); } 
            else if (maquinaNaMao && !mapa[col][lin]) { mapa[col][lin] = maquinaNaMao; maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null; } 
            else if (maquinaNaMao && mapa[col][lin]) { mostrarNotificacao("O destino está ocupado!"); } return;
        }

        if (maquinaSelecionada) {
            const custo = MAQUINAS[maquinaSelecionada].custo;
            if (!mapa[col][lin]) { if (podePagar(custo)) { alterarInventario(custo, 1); mapa[col][lin] = new Maquina(maquinaSelecionada); } else { mostrarNotificacao("Materiais Insuficientes!"); } } else { mostrarNotificacao("Ocupado!"); }
        } 
        else if (!maquinaSelecionada && mapa[col][lin]) {
            let maq = mapa[col][lin]; let ref = MAQUINAS[maq.tipo];
            
            tooltip.innerHTML = `
                <div style="font-weight:bold; font-size:1.1em; margin-bottom: 8px; color: #3498db; border-bottom: 1px solid #444; padding-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                    <img src="${ref.imagem}" width="24" height="24"> ${ref.nome}
                </div>
                <div style="color: #ccc; margin-bottom: 8px;">${ref.textoInspecao}</div>
                <div style="font-size: 0.9em; font-weight: bold; color: ${maq.ligada ? '#2ecc71' : '#e74c3c'}">
                    Status: ${maq.ligada ? '<span style="color:#2ecc71;">●</span> Operando' : '<span style="color:#e74c3c;">●</span> Parada'}
                </div>
            `;
            tooltip.style.left = (evento.clientX + 15) + "px"; tooltip.style.top = (evento.clientY + 15) + "px"; tooltip.classList.remove("escondido");
        }
    }
});

let contadorFrames = 0;
function atualizarInterfaceDOM() {
    contadorFrames++; if (contadorFrames % 10 !== 0) return; 
    const spanEnergia = document.getElementById("texto-energia");
    spanEnergia.innerText = `${energiaConsumida} / ${energiaGerada}`;
    spanEnergia.style.color = (energiaConsumida > 0 && energiaConsumida >= energiaGerada) ? "#e74c3c" : "#000";
    document.getElementById("texto-pesq-verde").innerText = inventario.pesquisa_verde;
    document.getElementById("texto-pesq-vermelha").innerText = inventario.pesquisa_vermelha;

    const div = document.getElementById("lista-inventario"); div.innerHTML = "";
    for (const [id_item, quantidade] of Object.entries(inventario)) {
        if (id_item.includes("pesquisa")) continue; 
        if (quantidade > 0 || ITENS[id_item].inicial) {
            const info = ITENS[id_item];
            div.innerHTML += `<div class="item-linha"><img src="${info.imagem}" class="icone-inv"><span>${info.nome}: <strong>${quantidade}</strong></span></div>`;
        }
    }
}

// ==========================================
// 7. O MOTOR DO JOGO 
// ==========================================

app.ticker.add((delta) => {
    const deltaTempo = app.ticker.deltaMS; 
    processarFabrica(deltaTempo);

    for (let c = 0; c < COLUNAS; c++) {
        for (let l = 0; l < LINHAS; l++) {
            const visual = objetosVisuais[c][l];
            visual.fundo.clear(); visual.barraProgresso.clear();

            if (terrenoBloqueado[c][l]) {
                let temVizinho = (c > 0 && !terrenoBloqueado[c-1][l]) || (c < COLUNAS-1 && !terrenoBloqueado[c+1][l]) || (l > 0 && !terrenoBloqueado[c][l-1]) || (l < LINHAS-1 && !terrenoBloqueado[c][l+1]);
                if (modoExpansaoAtivo && temVizinho) {
                    visual.fundo.beginFill(0x2a2a36, 1.0); visual.fundo.lineStyle(2, tipoExpansao === 'verde' ? 0x2ecc71 : 0xe74c3c); visual.fundo.drawRect(0, 0, TAMANHO_CELULA, TAMANHO_CELULA); visual.fundo.endFill();
                } else {
                    visual.fundo.beginFill(0x13131a, 1.0); visual.fundo.lineStyle(2, 0x111111); visual.fundo.drawRect(0, 0, TAMANHO_CELULA, TAMANHO_CELULA); visual.fundo.endFill();
                }
                
                if (mapa[c][l]) {
                    const textura = PIXI.Texture.from(MAQUINAS[mapa[c][l].tipo].imagem);
                    visual.imgSprite.texture = textura;
                    if (textura.width > 1) { 
                        visual.imgSprite.width = TAMANHO_CELULA - 12; 
                        visual.imgSprite.height = TAMANHO_CELULA - 12; 
                    }
                    visual.imgSprite.alpha = mapa[c][l].ligada ? 1.0 : 0.4;
                    visual.imgSprite.visible = true;
                } else {
                    visual.imgSprite.visible = false;
                }
                visual.barraFundo.visible = false; continue; 
            }

            visual.fundo.beginFill(0x2e2e3a, 1.0);
            visual.fundo.lineStyle(2, 0x444444, 0.6); 
            visual.fundo.drawRect(0, 0, TAMANHO_CELULA, TAMANHO_CELULA); 
            visual.fundo.endFill();

            let maquina = mapa[c][l];
            if (maquina) {
                const textura = PIXI.Texture.from(MAQUINAS[maquina.tipo].imagem);
                visual.imgSprite.texture = textura;
                
                if (textura.width > 1) { 
                    visual.imgSprite.width = TAMANHO_CELULA - 12; 
                    visual.imgSprite.height = TAMANHO_CELULA - 12; 
                }
                
                visual.imgSprite.alpha = maquina.ligada ? 1.0 : 0.4;
                visual.imgSprite.visible = true; visual.barraFundo.visible = true;

                const ref = MAQUINAS[maquina.tipo]; let proporcao;
                if (ref.geraEnergia) { proporcao = Math.max(maquina.progresso / ref.tempoCiclo, 0); visual.barraProgresso.beginFill(0xf1c40f, 0.8); } 
                else { proporcao = Math.min(maquina.progresso / ref.tempoCiclo, 1); visual.barraProgresso.beginFill(0x2ecc71, 0.8); }
                visual.barraProgresso.drawRect(0, TAMANHO_CELULA - 6, TAMANHO_CELULA * proporcao, 6); visual.barraProgresso.endFill();
            } else { visual.imgSprite.visible = false; visual.barraFundo.visible = false; }
        }
    }
    atualizarInterfaceDOM();
});

setInterval(() => { salvarJogo(true); }, 30000);
window.onload = () => { if (localStorage.getItem('meu_save_fabrica_final')) { carregarJogo(true); } };