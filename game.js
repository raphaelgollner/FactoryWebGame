// ==========================================
// 0. CONFIGURAÇÃO DE AMBIENTE DESKTOP (FS)
// ==========================================
let fs = null;
let path = null;
let caminhoDoSave = "";
let jogoIniciadoAtivo = false;

try {
    if (typeof require !== 'undefined') {
        fs = require('fs');
        path = require('path');
        const os = require('os');
        caminhoDoSave = path.join(os.homedir(), 'save_idle_factory.json');
    }
} catch (e) {
    console.log("Rodando via Navegador. Salvamento alternado para o LocalStorage.");
}

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

const INVENTARIO_INICIAL = {
    pesquisa_verde: 0, pesquisa_vermelha: 0,
    carvao: 50, minerio_ferro: 0, minerio_cobre: 0, 
    lingote_ferro: 0, lingote_cobre: 0, lingote_aco: 0,
    chapa_ferro: 100, chapa_cobre: 100, chapa_aco: 0,
    barra_ferro: 0, parafuso: 0, fio_cobre: 0,
    cabo_eletrico: 0, chapa_reforcada: 0
};

let inventario = { ...INVENTARIO_INICIAL };

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
    gerador_carvao: { nome: "Gerador a Carvão", imagem: "assets/coal-generator.png", tempoCiclo: 4000, custo: { chapa_ferro: 25, chapa_cobre: 25 }, entrada: { carvao: 1 }, saida: {}, geraEnergia: 50, textoInspecao: "Gera: 50 Energia<br>Usa: 15 / min" },
    mineradora_carvao: { nome: "Mineradora (Carvão)", imagem: "assets/miner.png", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { carvao: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 / min<br>Usa: 5 Energia" },
    mineradora_cobre: { nome: "Mineradora (Cobre)", imagem: "assets/miner.png", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { minerio_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 / min<br>Usa: 5 Energia" },
    mineradora_ferro: { nome: "Mineradora (Ferro)", imagem: "assets/miner.png", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { minerio_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 / min<br>Usa: 5 Energia" },
    fornalha_ferro: { nome: "Fornalha (Ferro)", imagem: "assets/smelter.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { minerio_ferro: 1 }, saida: { lingote_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 / min<br>Sai: 30 / min<br>Usa: 5 Energia" },
    fornalha_cobre: { nome: "Fornalha (Cobre)", imagem: "assets/smelter.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { minerio_cobre: 1 }, saida: { lingote_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 / min<br>Sai: 30 / min<br>Usa: 5 Energia" },
    fundicao_aco: { nome: "Fundição (Aço)", imagem: "assets/fundicao.png", tempoCiclo: 4000, custo: { chapa_ferro: 20 }, entrada: { minerio_ferro: 1, carvao: 1 }, saida: { lingote_aco: 2 }, consomeEnergia: 10, textoInspecao: "Entra: 15+15 / min<br>Sai: 30 / min<br>Usa: 10 Energia" },
    montadora_ferro: { nome: "Mont. (Chapa Ferro)", imagem: "assets/montadora.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { chapa_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 / min<br>Sai: 30 / min<br>Usa: 5 Energia" },
    montadora_barra: { nome: "Mont. (Barra Ferro)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { barra_ferro: 2 }, consomeEnergia: 5, textoInspecao: "Entra: 15 / min<br>Sai: 30 / min<br>Usa: 5 Energia" },
    montadora_parafuso: { nome: "Mont. (Parafusos)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { parafuso: 2 }, consomeEnergia: 5, textoInspecao: "Entra: 15 / min<br>Sai: 30 / min<br>Usa: 5 Energia" },
    montadora_cobre: { nome: "Mont. (Chapa Cobre)", imagem: "assets/montadora.png", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { lingote_cobre: 1 }, saida: { chapa_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 / min<br>Sai: 30 / min<br>Usa: 5 Energia" },
    montadora_fio: { nome: "Mont. (Fio Cobre)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_cobre: 1 }, saida: { fio_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 15 / min<br>Sai: 15 / min<br>Usa: 5 Energia" },
    montadora_cabo: { nome: "Mont. (Cabo Elétrico)", imagem: "assets/montadora.png", tempoCiclo: 2000, custo: { chapa_ferro: 15 }, entrada: { fio_cobre: 2 }, saida: { cabo_eletrico: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 60 / min<br>Sai: 30 / min<br>Usa: 5 Energia" },
    montadora_aco: { nome: "Mont. (Chapa Aço)", imagem: "assets/montadora.png", tempoCiclo: 4000, custo: { chapa_ferro: 15 }, entrada: { lingote_aco: 2 }, saida: { chapa_aco: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 / min<br>Sai: 15 / min<br>Usa: 5 Energia" },
    montadora_reforcada: { nome: "Mont. (Reforçada)", imagem: "assets/montadora.png", tempoCiclo: 12000, custo: { chapa_ferro: 20 }, entrada: { parafuso: 12, chapa_ferro: 6 }, saida: { chapa_reforcada: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 60+30 / min<br>Sai: 5 / min<br>Usa: 5 Energia" }
};

const ARVORE_PESQUISA = {
    parafuso: { titulo: "Parafusos", imagem: "assets/screws.png", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_parafuso", "card-venda-parafuso"], comprada: false },
    cabo: { titulo: "Cabo Elétrico", imagem: "assets/cable.png", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_cabo", "card-venda-cabo_eletrico"], comprada: false },
    aco: { titulo: "Lingote de Aço", imagem: "assets/steel-ingot.png", verde: 50, vermelho: 15, requisita: ["parafuso", "cabo"], destravaDOM: ["btn-fundicao_aco"], comprada: false },
    chapa_aco: { titulo: "Chapa de Aço", imagem: "assets/steel-sheet.png", verde: 50, vermelho: 50, requisita: ["aco"], destravaDOM: ["btn-montadora_aco", "card-venda-chapa_aco"], comprada: false },
    chapa_reforcada: { titulo: "Chapa Reforçada", imagem: "assets/reinforced-sheet.png", verde: 100, vermelho: 100, requisita: ["chapa_aco"], destravaDOM: ["btn-montadora_reforcada", "card-venda-reforcada"], comprada: false }
};

const LAYOUT_ARVORE = [ ["parafuso", "cabo"], ["aco"], ["chapa_aco"], ["chapa_reforcada"] ];

// ==========================================
// 2. FUNÇÕES DE INTERFACE E MODAIS
// ==========================================

function abrirArvore() { document.getElementById("modal-arvore").classList.remove("escondido"); renderizarArvore(); }
function fecharArvore() { document.getElementById("modal-arvore").classList.add("escondido"); }
function abrirComoJogar() { document.getElementById("modal-como-jogar").classList.remove("escondido"); }
function fecharComoJogar() { document.getElementById("modal-como-jogar").classList.add("escondido"); }

function abrirSistema() { 
    document.getElementById("titulo-modal-sistema").innerText = "Sistema";
    document.getElementById("grupo-botoes-save-interno").classList.remove("escondido");
    document.getElementById("modal-sistema").classList.remove("escondido"); 
}
function abrirOpcoes() {
    document.getElementById("titulo-modal-sistema").innerText = "Opções do Jogo";
    document.getElementById("grupo-botoes-save-interno").classList.add("escondido");
    document.getElementById("modal-sistema").classList.remove("escondido");
}
function fecharSistema() { document.getElementById("modal-sistema").classList.add("escondido"); }

function mudarEscalaJanela(fator) { document.body.style.zoom = fator; }

function renderizarArvore() {
    const container = document.getElementById("container-arvore-nodes");
    container.innerHTML = "";
    document.getElementById("modal-verde").innerText = inventario.pesquisa_verde;
    document.getElementById("modal-vermelha").innerText = inventario.pesquisa_vermelha;

    LAYOUT_ARVORE.forEach(coluna => {
        const divColuna = document.createElement("div"); divColuna.className = "coluna-tech";
        coluna.forEach(idNode => {
            const tech = ARVORE_PESQUISA[idNode];
            const divNode = document.createElement("div");
            let todasRequisicoesCompradas = true;
            tech.requisita.forEach(reqId => { if (!ARVORE_PESQUISA[reqId].comprada) todasRequisicoesCompradas = false; });

            if (tech.comprada) {
                divNode.className = "node-tech comprado";
                divNode.innerHTML = `<div class="node-tech-titulo"><img src="${tech.imagem}" class="icone-tech">${tech.titulo}</div><div style="color:#2ecc71; font-weight:bold;">Pesquisado ✔️</div>`;
            } else if (todasRequisicoesCompradas) {
                divNode.className = "node-tech disponivel";
                divNode.innerHTML = `<div class="node-tech-titulo"><img src="${tech.imagem}" class="icone-tech">${tech.titulo}</div><div class="node-tech-custo">Custo:<br>${tech.verde > 0 ? tech.verde + " Verde" : ''} ${tech.vermelho > 0 ? tech.vermelho + " Vermelho" : ''}</div><div style="font-size: 0.8em; color: #f1c40f;">(Clique para pesquisar)</div>`;
                divNode.onclick = () => comprarTecnologia(idNode);
            } else {
                divNode.className = "node-tech bloqueado";
                divNode.innerHTML = `<div class="node-tech-titulo">???</div><div class="node-tech-custo">Bloqueado</div><div style="font-size: 0.8em; color: #aaa;">Requer pesquisas anteriores</div>`;
            }
            divColuna.appendChild(divNode);
        });
        container.appendChild(divColuna);
    });
}

function comprarTecnologia(id) {
    const tech = ARVORE_PESQUISA[id];
    if (inventario.pesquisa_verde >= tech.verde && inventario.pesquisa_vermelha >= tech.vermelho) {
        inventario.pesquisa_verde -= tech.verde; inventario.pesquisa_vermelha -= tech.vermelho;
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
// 3. SISTEMA DE TRANSIÇÃO E SAVES
// ==========================================

function entrarNaFabrica() {
    jogoIniciadoAtivo = true;
    document.getElementById("tela-titulo").classList.add("escondido");
    document.getElementById("jogo-container-id").classList.remove("escondido");
    atualizarInterfaceDOM(true); // Força atualização do inventário na hora que entra
}

function voltarAoMenu() {
    salvarJogo(true);
    jogoIniciadoAtivo = false;
    document.getElementById("modal-sistema").classList.add("escondido");
    document.getElementById("jogo-container-id").classList.add("escondido");
    document.getElementById("tela-titulo").classList.remove("escondido");
    const btnCarregar = document.getElementById("btn-menu-carregar");
    if (btnCarregar) btnCarregar.disabled = !verificarSeExisteSave();
}

function iniciarNovoJogo() {
    if (confirm("Deseja iniciar uma nova fábrica? Isso resetará o progresso atual não salvo.")) {
        inventario = JSON.parse(JSON.stringify(INVENTARIO_INICIAL)); // Cópia limpa sem bugar memória
        for (const key of Object.keys(ARVORE_PESQUISA)) {
            ARVORE_PESQUISA[key].comprada = false;
            ARVORE_PESQUISA[key].destravaDOM.forEach(idDOM => {
                const el = document.getElementById(idDOM); if (el) el.classList.add("trancado");
            });
        }
        for (let c = 0; c < COLUNAS; c++) {
            for (let l = 0; l < LINHAS; l++) { 
                mapa[c][l] = null; 
                // Centraliza a área inicial 5x5 na nova grid isométrica 30x30
                if (c >= 12 && c <= 16 && l >= 12 && l <= 16) { terrenoBloqueado[c][l] = false; } 
                else { terrenoBloqueado[c][l] = true; }
            }
        }
        entrarNaFabrica();
        salvarJogo(true);
        mostrarNotificacao("Nova fábrica inicializada!", "sucesso");
    }
}

function carregarJogoMenu() {
    if (carregarJogo(true)) {
        entrarNaFabrica();
        mostrarNotificacao("Save carregado com sucesso!", "sucesso");
    }
}

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
    notif.innerHTML = mensagem;
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

function verificarSeExisteSave() {
    if (fs && caminhoDoSave) return fs.existsSync(caminhoDoSave);
    return localStorage.getItem('meu_save_fabrica_final') !== null;
}

function salvarJogo(silencioso = false) {
    const dadosSave = { inventario: inventario, terreno: terrenoBloqueado, arvore: {}, mapa: [] };
    for (const [key, tech] of Object.entries(ARVORE_PESQUISA)) { dadosSave.arvore[key] = tech.comprada; }
    for (let c = 0; c < COLUNAS; c++) {
        dadosSave.mapa[c] = [];
        for (let l = 0; l < LINHAS; l++) {
            let maq = mapa[c][l];
            dadosSave.mapa[c][l] = maq ? { tipo: maq.tipo, progresso: maq.progresso } : null;
        }
    }

    try {
        if (fs && caminhoDoSave) {
            fs.writeFileSync(caminhoDoSave, JSON.stringify(dadosSave, null, 4), 'utf-8');
        } else {
            localStorage.setItem('meu_save_fabrica_final', JSON.stringify(dadosSave));
        }
        if(!silencioso) mostrarNotificacao("Fábrica salva localmente!", "sucesso");
    } catch(err) { mostrarNotificacao("Erro ao salvar o arquivo."); }
}

function carregarJogo(silencioso = false) {
    let saveStr = null;
    if (fs && caminhoDoSave) {
        if (fs.existsSync(caminhoDoSave)) saveStr = fs.readFileSync(caminhoDoSave, 'utf-8');
    } else { saveStr = localStorage.getItem('meu_save_fabrica_final'); }

    if (!saveStr) { if(!silencioso) mostrarNotificacao("Nenhum arquivo de save encontrado!"); return false; }
    
    try {
        const dadosSave = JSON.parse(saveStr);
        inventario = dadosSave.inventario;
        terrenoBloqueado = dadosSave.terreno;

        for (const [key, comprada] of Object.entries(dadosSave.arvore)) {
            if(ARVORE_PESQUISA[key]) {
                ARVORE_PESQUISA[key].comprada = comprada;
                if (comprada) {
                    ARVORE_PESQUISA[key].destravaDOM.forEach(idDOM => {
                        const el = document.getElementById(idDOM); if (el) el.classList.remove("trancado");
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
        if (!document.getElementById("modal-arvore").classList.contains("escondido")) renderizarArvore();
        if(!silencioso) mostrarNotificacao("Progresso Restaurado!", "sucesso");
        return true;
    } catch(e) {
        mostrarNotificacao("Erro: Arquivo corrompido ou antigo. Resete.");
        return false;
    }
}

function resetarJogo() { 
    if(confirm("Apagar permanentemente o arquivo físico de save do computador?")) { 
        if (fs && caminhoDoSave && fs.existsSync(caminhoDoSave)) fs.unlinkSync(caminhoDoSave);
        else localStorage.removeItem('meu_save_fabrica_final');
        location.reload(); 
    } 
}

// ==========================================
// 4. MOTOR ISOMÉTRICO (PIXIJS)
// ==========================================

const TILE_W = 256; 
const TILE_H = 128;
const TILE_W_HALF = TILE_W / 2;
const TILE_H_HALF = TILE_H / 2;
const COLUNAS = 30; // Mapa massivo 30x30
const LINHAS = 30;

const app = new PIXI.Application({
    view: document.getElementById("telaDoJogo"),
    width: 720, 
    height: 720,
    backgroundColor: 0x111111, 
    resolution: window.devicePixelRatio || 1, 
    autoDensity: true 
});

const mundo = new PIXI.Container();
mundo.sortableChildren = true;
app.stage.addChild(mundo);
mundo.x = 360; // Centro horizontal da tela
mundo.y = -1432; // Desce a câmera diretamente para a sua base inicial

// Posição inicial da câmera para olhar para o centro exato do mapa (coluna 14, linha 14)
mundo.x = 360; 
mundo.y = -1432; // Desce a câmera diretamente para a sua base inicial

let mapa = []; let terrenoBloqueado = []; let modoExpansaoAtivo = false; let tipoExpansao = null; let objetosVisuais = []; 

for (let c = 0; c < COLUNAS; c++) {
    mapa[c] = []; terrenoBloqueado[c] = []; objetosVisuais[c] = [];
    for (let l = 0; l < LINHAS; l++) { 
        mapa[c][l] = null; 
        if (c >= 12 && c <= 16 && l >= 12 && l <= 16) { terrenoBloqueado[c][l] = false; } else { terrenoBloqueado[c][l] = true; }

        const blocoContainer = new PIXI.Container();
        // Mágica Isométrica 
        blocoContainer.x = (c - l) * TILE_W_HALF; 
        blocoContainer.y = (c + l) * TILE_H_HALF;
        blocoContainer.zIndex = c + l; 
        
        const fundo = PIXI.Sprite.from('assets/dirt.png');
        fundo.anchor.set(0.5, 0.5); 
        blocoContainer.addChild(fundo);
        
        const imgSprite = new PIXI.Sprite();
        // Ajuste no eixo Y para a máquina ficar perfeitamente "plantada" no chão
        imgSprite.anchor.set(0.5, 0.85); 
        imgSprite.y = 20; 
        blocoContainer.addChild(imgSprite);

        const barraFundo = new PIXI.Graphics();
        barraFundo.beginFill(0x000000, 0.5); barraFundo.drawRect(-30, -80, 60, 6); barraFundo.endFill();
        blocoContainer.addChild(barraFundo);
        const barraProgresso = new PIXI.Graphics(); blocoContainer.addChild(barraProgresso);

        mundo.addChild(blocoContainer);
        objetosVisuais[c][l] = { fundo, imgSprite, barraFundo, barraProgresso };
    }
}

// ==========================================
// 5. CÂMERA E MOUSE ISOMÉTRICO
// ==========================================
let maquinaSelecionada = null; let maquinaNaMao = null; 
let maquinaOrigemX = null; let maquinaOrigemY = null;

let isDraggingCamera = false;
let dragStartX = 0; let dragStartY = 0;
let cameraStartX = 0; let cameraStartY = 0;

const canvasDOM = document.getElementById("telaDoJogo");
canvasDOM.addEventListener("contextmenu", evento => evento.preventDefault());

window.addEventListener("mousemove", (evento) => {
    if (isDraggingCamera && jogoIniciadoAtivo) {
        mundo.x = cameraStartX + (evento.clientX - dragStartX);
        mundo.y = cameraStartY + (evento.clientY - dragStartY);
    }
});

window.addEventListener("mouseup", (evento) => {
    if (evento.button === 2) isDraggingCamera = false;
});

canvasDOM.addEventListener("mousedown", (evento) => {
    if (!jogoIniciadoAtivo) return;
    if (!document.getElementById("modal-arvore").classList.contains("escondido")) return;
    if (!document.getElementById("modal-como-jogar").classList.contains("escondido")) return;
    if (!document.getElementById("modal-sistema").classList.contains("escondido")) return; 

    if (evento.button === 2) {
        if (maquinaNaMao) { 
            if (maquinaOrigemX !== null && maquinaOrigemY !== null && !mapa[maquinaOrigemX][maquinaOrigemY]) { mapa[maquinaOrigemX][maquinaOrigemY] = maquinaNaMao; } 
            else { alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1); }
            maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null;
            mostrarNotificacao("Movimentação cancelada.", "sucesso"); 
        } else if (maquinaSelecionada || modoExpansaoAtivo) { 
            maquinaSelecionada = null; modoExpansaoAtivo = false; 
            document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado"));
        } else {
            // Inicia o arrasto da câmera com o botão direito
            isDraggingCamera = true;
            dragStartX = evento.clientX;
            dragStartY = evento.clientY;
            cameraStartX = mundo.x;
            cameraStartY = mundo.y;
        }
        return;
    }

    if (evento.button === 0) {
        const rect = canvasDOM.getBoundingClientRect();
        const scaleX = canvasDOM.width / rect.width;
        const scaleY = canvasDOM.height / rect.height;

        // Calcula a posição exata do clique compensando onde a câmera está
        const mouseX = ((evento.clientX - rect.left) * scaleX) - mundo.x;
        const mouseY = ((evento.clientY - rect.top) * scaleY) - mundo.y;

        // MATEMÁTICA ISOMÉTRICA REVERSA PERFEITA (Converte o clique na tela para dentro do losango)
        let mapX = (mouseX / TILE_W_HALF + (mouseY + TILE_H_HALF) / TILE_H_HALF) / 2;
        let mapY = ((mouseY + TILE_H_HALF) / TILE_H_HALF - mouseX / TILE_W_HALF) / 2;

        const col = Math.floor(mapX);
        const lin = Math.floor(mapY);
        
        const tooltip = document.getElementById("tooltip-maquina");
        tooltip.classList.add("escondido");

        // Se clicou fora da grade 30x30 ignora
        if (col < 0 || col >= COLUNAS || lin < 0 || lin >= LINHAS) return;

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
                } else { mostrarNotificacao("Escolha um bloco escuro que encoste na sua fábrica!"); }
            } else { modoExpansaoAtivo = false; }
            return; 
        }

        if (terrenoBloqueado[col][lin]) { mostrarNotificacao("Terreno Bloqueado pela Névoa!"); return; }

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
            tooltip.innerHTML = `<div style="font-weight:bold; font-size:1.1em; margin-bottom: 8px; color: #3498db; border-bottom: 1px solid #444; padding-bottom: 4px; display: flex; align-items: center; gap: 8px;"><img src="${ref.imagem}" width="24" height="24"> ${ref.nome}</div><div style="color: #ccc; margin-bottom: 8px;">${ref.textoInspecao}</div><div style="font-size: 0.9em; font-weight: bold; color: ${maq.ligada ? '#2ecc71' : '#e74c3c'}">Status: ${maq.ligada ? '<span style="color:#2ecc71;">●</span> Operando' : '<span style="color:#e74c3c;">●</span> Parada'}</div>`;
            tooltip.style.left = (evento.clientX + 15) + "px"; tooltip.style.top = (evento.clientY + 15) + "px"; tooltip.classList.remove("escondido");
        }
    }
});

function selecionarConstrucao(tipo) {
    modoExpansaoAtivo = false; maquinaSelecionada = tipo;
    if (maquinaNaMao && (tipo !== 'ferramenta_mover')) { 
        if (maquinaOrigemX !== null && maquinaOrigemY !== null && !mapa[maquinaOrigemX][maquinaOrigemY]) { mapa[maquinaOrigemX][maquinaOrigemY] = maquinaNaMao; } 
        else { alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1); }
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
    mostrarNotificacao("Clique na névoa escura vizinha à fábrica para expandir!", "sucesso");
}

function podePagar(custo) { for (const [item, qtd] of Object.entries(custo)) { if (inventario[item] < qtd) return false; } return true; }
function alterarInventario(custo, multiplicar = 1) { for (const [item, qtd] of Object.entries(custo)) { inventario[item] -= qtd * multiplicar; } }

// ==========================================
// 6. CLASSES E LÓGICA DE PRODUÇÃO
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
    if (!jogoIniciadoAtivo) return; 
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
// 7. RENDERIZAÇÃO E GAME LOOP
// ==========================================

let contadorFrames = 0;
function atualizarInterfaceDOM(forcar = false) {
    if (!jogoIniciadoAtivo && !forcar) return;
    contadorFrames++; if (contadorFrames % 10 !== 0 && !forcar) return; 
    const spanEnergia = document.getElementById("texto-energia");
    spanEnergia.innerText = `${energiaConsumida} / ${energiaGerada}`;
    spanEnergia.style.color = (energiaConsumida > 0 && energiaConsumida >= energiaGerada) ? "#e74c3c" : "#000";
    document.getElementById("texto-pesq-verde").innerText = inventario.pesquisa_verde;
    document.getElementById("texto-pesq-vermelha").innerText = inventario.pesquisa_vermelha;

    const div = document.getElementById("lista-inventario"); div.innerHTML = "";
    for (const [id_item, quantity] of Object.entries(inventario)) {
        if (id_item.includes("pesquisa")) continue; 
        if (quantity > 0 || ITENS[id_item] && ITENS[id_item].inicial) {
            const info = ITENS[id_item];
            div.innerHTML += `<div class="item-linha"><img src="${info.imagem}" class="icone-inv"><span>${info.nome}: <strong>${quantity}</strong></span></div>`;
        }
    }
}

app.ticker.add((delta) => {
    if (!jogoIniciadoAtivo) return; 
    const deltaTempo = app.ticker.deltaMS; 
    processarFabrica(deltaTempo);

    for (let c = 0; c < COLUNAS; c++) {
        for (let l = 0; l < LINHAS; l++) {
            const visual = objetosVisuais[c][l];
            visual.barraProgresso.clear();

            // Sombra no Terreno não liberado (Névoa)
            if (terrenoBloqueado[c][l]) {
                visual.fundo.tint = 0x333333; 
                let temVizinho = (c > 0 && !terrenoBloqueado[c-1][l]) || (c < COLUNAS-1 && !terrenoBloqueado[c+1][l]) || (l > 0 && !terrenoBloqueado[c][l-1]) || (l < LINHAS-1 && !terrenoBloqueado[c][l+1]);
                if (modoExpansaoAtivo && temVizinho) {
                    visual.fundo.tint = tipoExpansao === 'verde' ? 0x2ecc71 : 0xe74c3c;
                }
                visual.imgSprite.visible = false;
                visual.barraFundo.visible = false; 
                continue; 
            }

            visual.fundo.tint = 0xFFFFFF; // Terreno Claro Liberado

            let maquina = mapa[c][l];
            if (maquina) {
                const textura = PIXI.Texture.from(MAQUINAS[maquina.tipo].imagem);
                visual.imgSprite.texture = textura;
                
                // Força as imagens 64x64 das máquinas a terem um tamanho bom no novo terreno
                if (textura.width > 1) { 
                    visual.imgSprite.width = 160;   // Aumentado para 160
                    visual.imgSprite.height = 160;  // Aumentado para 160
                }
                
                visual.imgSprite.alpha = maquina.ligada ? 1.0 : 0.4;
                visual.imgSprite.visible = true; visual.barraFundo.visible = true;

                const ref = MAQUINAS[maquina.tipo]; let proporcao;
                if (ref.geraEnergia) { proporcao = Math.max(maquina.progresso / ref.tempoCiclo, 0); visual.barraProgresso.beginFill(0xf1c40f, 0.8); } 
                else { proporcao = Math.min(maquina.progresso / ref.tempoCiclo, 1); visual.barraProgresso.beginFill(0x2ecc71, 0.8); }
                visual.barraProgresso.drawRect(-30, -80, 60 * proporcao, 6); visual.barraProgresso.endFill();
            } else { visual.imgSprite.visible = false; visual.barraFundo.visible = false; }
        }
    }
    atualizarInterfaceDOM();
});

setInterval(() => { if (jogoIniciadoAtivo) salvarJogo(true); }, 30000);

window.onload = () => { 
    const btnCarregar = document.getElementById("btn-menu-carregar");
    if (btnCarregar) {
        btnCarregar.disabled = !verificarSeExisteSave();
    }
};