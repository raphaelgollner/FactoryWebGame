// ==========================================
// 0. CONFIGURAÇÃO DE AMBIENTE E DADOS
// ==========================================
let fs = null; let path = null; let ipcRenderer = null; let caminhoDoSave = ""; let caminhoConfig = ""; let jogoIniciadoAtivo = false;
try { 
    if (typeof require !== 'undefined') { 
        fs = require('fs'); path = require('path'); 
        ipcRenderer = require('electron').ipcRenderer; // Nova ponte com o Sistema Operacional
        caminhoDoSave = path.join(require('os').homedir(), 'save_idle_factory.json'); 
        caminhoConfig = path.join(require('os').homedir(), 'config_idle_factory.json');
    } 
} catch (e) { }

let confVideo = { resolucao: "1280x720", fullscreen: false };

const ITENS = { carvao: { nome: "Carvão", imagem: "assets/coal-ore.png", inicial: true }, minerio_ferro: { nome: "Min. Ferro", imagem: "assets/iron-ore.png" }, minerio_cobre: { nome: "Min. Cobre", imagem: "assets/copper-ore.png" }, lingote_ferro: { nome: "Ling. Ferro", imagem: "assets/iron-ingot.png" }, lingote_cobre: { nome: "Ling. Cobre", imagem: "assets/copper-ingot.png" }, lingote_aco: { nome: "Ling. Aço", imagem: "assets/steel-ingot.png" }, chapa_ferro: { nome: "Chapa Ferro", imagem: "assets/iron-sheet.png", inicial: true }, chapa_cobre: { nome: "Chapa Cobre", imagem: "assets/copper-sheet.png", inicial: true }, chapa_aco: { nome: "Chapa Aço", imagem: "assets/steel-sheet.png" }, barra_ferro: { nome: "Barra de Ferro", imagem: "assets/iron-rod.png" }, parafuso: { nome: "Parafusos", imagem: "assets/screws.png" }, fio_cobre: { nome: "Fio Cobre", imagem: "assets/copper-wire.png" }, cabo_eletrico: { nome: "Cabo Elétrico", imagem: "assets/cable.png" }, chapa_reforcada: { nome: "Chapa Reforçada", imagem: "assets/reinforced-sheet.png" } };
const INVENTARIO_INICIAL = { pesquisa_verde: 0, pesquisa_vermelha: 0, carvao: 50, minerio_ferro: 0, minerio_cobre: 0, lingote_ferro: 0, lingote_cobre: 0, lingote_aco: 0, chapa_ferro: 100, chapa_cobre: 100, chapa_aco: 0, barra_ferro: 0, parafuso: 0, fio_cobre: 0, cabo_eletrico: 0, chapa_reforcada: 0 };
let inventario = { ...INVENTARIO_INICIAL };
const PRECOS_PESQUISA = { chapa_ferro: { tipo: 'verde', valor: 1 }, chapa_cobre: { tipo: 'verde', valor: 1 }, barra_ferro: { tipo: 'verde', valor: 2 }, parafuso: { tipo: 'verde', valor: 2 }, fio_cobre: { tipo: 'verde', valor: 2 }, cabo_eletrico: { tipo: 'vermelha', valor: 1 }, chapa_aco: { tipo: 'vermelha', valor: 2 }, chapa_reforcada: { tipo: 'vermelha', valor: 4 } };
let energiaGerada = 0; let energiaConsumida = 0;

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
const ARVORE_PESQUISA = { parafuso: { titulo: "Parafusos", imagem: "assets/screws.png", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_parafuso", "card-venda-parafuso"], comprada: false }, cabo: { titulo: "Cabo Elétrico", imagem: "assets/cable.png", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_cabo", "card-venda-cabo_eletrico"], comprada: false }, aco: { titulo: "Lingote de Aço", imagem: "assets/steel-ingot.png", verde: 50, vermelho: 15, requisita: ["parafuso", "cabo"], destravaDOM: ["btn-fundicao_aco"], comprada: false }, chapa_aco: { titulo: "Chapa de Aço", imagem: "assets/steel-sheet.png", verde: 50, vermelho: 50, requisita: ["aco"], destravaDOM: ["btn-montadora_aco", "card-venda-chapa_aco"], comprada: false }, chapa_reforcada: { titulo: "Chapa Reforçada", imagem: "assets/reinforced-sheet.png", verde: 100, vermelho: 100, requisita: ["chapa_aco"], destravaDOM: ["btn-montadora_reforcada", "card-venda-reforcada"], comprada: false } };
const LAYOUT_ARVORE = [ ["parafuso", "cabo"], ["aco"], ["chapa_aco"], ["chapa_reforcada"] ];

// ==========================================
// 1. SISTEMA DE JANELAS E VÍDEO (NATIVO ELECTRON)
// ==========================================

function salvarConfig() {
    try { if (fs && caminhoConfig) { fs.writeFileSync(caminhoConfig, JSON.stringify(confVideo), 'utf-8'); } else { localStorage.setItem('config_idle_factory', JSON.stringify(confVideo)); } } catch(e) {}
}

function carregarConfig() {
    try {
        let saveStr = null;
        if (fs && caminhoConfig) { if (fs.existsSync(caminhoConfig)) saveStr = fs.readFileSync(caminhoConfig, 'utf-8'); } else { saveStr = localStorage.getItem('config_idle_factory'); }
        if (saveStr) {
            confVideo = JSON.parse(saveStr);
            document.getElementById("select-resolucao").value = confVideo.resolucao;
            if (ipcRenderer) {
                const [w, h] = confVideo.resolucao.split('x').map(Number);
                ipcRenderer.send('resize-window', w, h);
                if (confVideo.fullscreen) ipcRenderer.send('toggle-fullscreen');
            }
        }
    } catch(e) {}
}

function aplicarResolucao() {
    const val = document.getElementById("select-resolucao").value;
    confVideo.resolucao = val;
    if (ipcRenderer) {
        const [w, h] = val.split('x').map(Number);
        ipcRenderer.send('resize-window', w, h);
    }
    salvarConfig();
    mostrarNotificacao("Resolução Aplicada e Salva!", "sucesso");
}

function toggleFullscreen() {
    confVideo.fullscreen = !confVideo.fullscreen;
    if (ipcRenderer) { ipcRenderer.send('toggle-fullscreen'); }
    salvarConfig();
}

function sairDoJogo() {
    if(confirm("Deseja realmente sair do jogo? Progresso não salvo será perdido.")) {
        if (ipcRenderer) ipcRenderer.send('exit-game');
    }
}

function abrirOpcoesMenuInicial() {
    document.getElementById("botoes-sistema-in-game").classList.add("escondido");
    toggleJanela('sistema');
}

function tornarArrastavel(idJanela, idCabecalho) {
    const janela = document.getElementById(idJanela); const cabecalho = document.getElementById(idCabecalho);
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    cabecalho.onmousedown = (e) => {
        e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
        document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
        document.onmousemove = (ev) => {
            ev.preventDefault(); pos1 = pos3 - ev.clientX; pos2 = pos4 - ev.clientY; pos3 = ev.clientX; pos4 = ev.clientY;
            janela.style.top = (janela.offsetTop - pos2) + "px"; janela.style.left = (janela.offsetLeft - pos1) + "px";
        };
    };
}

window.onload = () => { 
    carregarConfig();
    tornarArrastavel("janela-construcao", "header-construcao"); tornarArrastavel("janela-inventario", "header-inventario"); tornarArrastavel("janela-pesquisa", "header-pesquisa"); tornarArrastavel("janela-ajuda", "header-ajuda"); tornarArrastavel("janela-sistema", "header-sistema");
    const btnCarregar = document.getElementById("btn-menu-carregar"); if (btnCarregar) btnCarregar.disabled = !verificarSeExisteSave(); 
};

function toggleJanela(nomeJanela) {
    const janela = document.getElementById(`janela-${nomeJanela}`);
    if (janela.classList.contains('escondido')) {
        if (nomeJanela === 'sistema') {
            if (jogoIniciadoAtivo) document.getElementById("botoes-sistema-in-game").classList.remove("escondido");
            else document.getElementById("botoes-sistema-in-game").classList.add("escondido");
            janela.style.left = "50%"; janela.style.top = "50%"; janela.style.transform = "translate(-50%, -50%)";
        } else {
            janela.style.transform = "none";
            janela.style.left = (window.innerWidth / 2 - janela.offsetWidth / 2) + "px";
            janela.style.top = (window.innerHeight / 2 - janela.offsetHeight / 2) + "px";
        }
        janela.classList.remove('escondido');
        if(nomeJanela === 'pesquisa') renderizarArvore(); 
    } else {
        janela.classList.add('escondido');
        if (nomeJanela === 'construcao') { maquinaSelecionada = null; document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado")); document.getElementById("tooltip-maquina").classList.add("escondido"); }
    }
}

function abrirAba(idJanela, idAba) {
    const janela = document.getElementById(idJanela);
    janela.querySelectorAll('.conteudo-aba').forEach(el => el.classList.add('escondido'));
    janela.querySelectorAll('.btn-aba').forEach(el => el.classList.remove('ativo'));
    document.getElementById(idAba).classList.remove('escondido');
    janela.querySelector(`[onclick="abrirAba('${idJanela}', '${idAba}')"]`).classList.add('ativo');
}

const keys = { w: false, a: false, s: false, d: false };
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleJanela('sistema');
    if (!jogoIniciadoAtivo) return;
    const k = e.key.toLowerCase(); if (keys.hasOwnProperty(k)) keys[k] = true; 
    if (k === 'b') toggleJanela('construcao'); if (k === 'i') toggleJanela('inventario'); if (k === 't') toggleJanela('pesquisa'); if (k === 'l') toggleJanela('ajuda');
});
window.addEventListener('keyup', (e) => { if (!jogoIniciadoAtivo) return; const k = e.key.toLowerCase(); if (keys.hasOwnProperty(k)) keys[k] = false; });

// ==========================================
// 2. FUNÇÕES DE PESQUISA E NOTIFICAÇÃO
// ==========================================
function renderizarArvore() { const container = document.getElementById("container-arvore-nodes"); container.innerHTML = ""; document.getElementById("texto-pesq-verde").innerText = inventario.pesquisa_verde; document.getElementById("texto-pesq-vermelha").innerText = inventario.pesquisa_vermelha; LAYOUT_ARVORE.forEach(coluna => { const divColuna = document.createElement("div"); divColuna.className = "coluna-tech"; coluna.forEach(idNode => { const tech = ARVORE_PESQUISA[idNode]; const divNode = document.createElement("div"); let todasReq = true; tech.requisita.forEach(reqId => { if (!ARVORE_PESQUISA[reqId].comprada) todasReq = false; }); if (tech.comprada) { divNode.className = "node-tech comprado"; divNode.innerHTML = `<div class="node-tech-titulo"><img src="${tech.imagem}" class="icone-tech">${tech.titulo}</div><div style="color:#2ecc71; font-weight:bold;">Pesquisado ✔️</div>`; } else if (todasReq) { divNode.className = "node-tech disponivel"; divNode.innerHTML = `<div class="node-tech-titulo"><img src="${tech.imagem}" class="icone-tech">${tech.titulo}</div><div style="margin-top:10px;">Custo:<br>${tech.verde > 0 ? tech.verde + " Vrd" : ''} ${tech.vermelho > 0 ? tech.vermelho + " Vrm" : ''}</div>`; divNode.onclick = () => comprarTecnologia(idNode); } else { divNode.className = "node-tech bloqueado"; divNode.innerHTML = `<div class="node-tech-titulo">???</div><div>Bloqueado</div>`; } divColuna.appendChild(divNode); }); container.appendChild(divColuna); }); }
function comprarTecnologia(id) { const tech = ARVORE_PESQUISA[id]; if (inventario.pesquisa_verde >= tech.verde && inventario.pesquisa_vermelha >= tech.vermelho) { inventario.pesquisa_verde -= tech.verde; inventario.pesquisa_vermelha -= tech.vermelho; tech.comprada = true; tech.destravaDOM.forEach(idDOM => { const el = document.getElementById(idDOM); if (el) el.classList.remove("trancado"); }); mostrarNotificacao(`Pesquisa: ${tech.titulo}`, "pesquisa"); renderizarArvore(); atualizarInterfaceDOM(true); } else { mostrarNotificacao("Pontos Insuficientes!"); } }
function mostrarNotificacao(mensagem, tipo = "erro") { const container = document.getElementById("container-notificacoes"); const notif = document.createElement("div"); notif.className = `notificacao ${tipo}`; notif.innerHTML = mensagem; container.appendChild(notif); setTimeout(() => { notif.style.opacity="0"; setTimeout(() => notif.remove(), 400); }, 3000); }
function gerarPesquisa(item_id, quantity) { let qtd = quantity === "tudo" ? inventario[item_id] : quantity; if (qtd > 0 && inventario[item_id] >= qtd) { const ref = PRECOS_PESQUISA[item_id]; const ganho = qtd * ref.valor; inventario[item_id] -= qtd; if (ref.tipo === 'verde') { inventario.pesquisa_verde += ganho; } else { inventario.pesquisa_vermelha += ganho; } mostrarNotificacao(`Vendidos! (+${ganho} Pts)`, "sucesso"); atualizarInterfaceDOM(true); } else { mostrarNotificacao(`Sem estoque de ${item_id}!`); } }
function selecionarConstrucao(tipo) { modoExpansaoAtivo = false; maquinaSelecionada = tipo; if (maquinaNaMao && (tipo !== 'ferramenta_mover')) { if (maquinaOrigemX !== null && maquinaOrigemY !== null && !mapa[maquinaOrigemX][maquinaOrigemY]) { mapa[maquinaOrigemX][maquinaOrigemY] = maquinaNaMao; } else { alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1); } maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null; } document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado")); const btn = document.getElementById(`btn-${tipo}`); if (btn) btn.classList.add("selecionado"); document.getElementById("tooltip-maquina").classList.add("escondido"); }
function comprarExpansao(tipo) { const custo = 50; if (tipo === 'verde' && inventario.pesquisa_verde < custo) { mostrarNotificacao("Faltam pontos básicos!"); return; } if (tipo === 'vermelho' && inventario.pesquisa_vermelha < custo) { mostrarNotificacao("Faltam pontos avançados!"); return; } modoExpansaoAtivo = true; tipoExpansao = tipo; maquinaSelecionada = null; document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado")); toggleJanela('construcao'); mostrarNotificacao("Clique na névoa vizinha!", "sucesso"); }

// ==========================================
// 3. FLUXO DE JOGO E SAVES
// ==========================================
function entrarNaFabrica() { 
    jogoIniciadoAtivo = true; 
    document.getElementById("tela-titulo").classList.add("escondido"); 
    document.getElementById("telaDoJogo").classList.remove("escondido"); 
    document.getElementById("hud-jogo").classList.remove("escondido"); 
    ajustarCameraParaCentroDoTerreno(); 
    atualizarInterfaceDOM(true); 
}
function voltarAoMenu() { salvarJogo(true); jogoIniciadoAtivo = false; document.querySelectorAll('.janela-arrastavel').forEach(el=>el.classList.add('escondido')); document.getElementById("hud-jogo").classList.add("escondido"); document.getElementById("telaDoJogo").classList.add("escondido"); document.getElementById("tela-titulo").classList.remove("escondido"); const btnCarregar = document.getElementById("btn-menu-carregar"); if (btnCarregar) btnCarregar.disabled = !verificarSeExisteSave(); }
function iniciarNovoJogo() { if (confirm("Iniciar nova fábrica?")) { inventario = JSON.parse(JSON.stringify(INVENTARIO_INICIAL)); for (const k of Object.keys(ARVORE_PESQUISA)) { ARVORE_PESQUISA[k].comprada = false; ARVORE_PESQUISA[k].destravaDOM.forEach(idDOM => { const el = document.getElementById(idDOM); if (el) el.classList.add("trancado"); }); } for (let c = 0; c < COLUNAS; c++) { for (let l = 0; l < LINHAS; l++) { mapa[c][l] = null; if (c >= 12 && c <= 16 && l >= 12 && l <= 16) terrenoBloqueado[c][l] = false; else terrenoBloqueado[c][l] = true; } } entrarNaFabrica(); salvarJogo(true); mostrarNotificacao("Nova fábrica!", "sucesso"); } }
function carregarJogoMenu() { if (carregarJogo(true)) { entrarNaFabrica(); mostrarNotificacao("Carregado!", "sucesso"); } }
function verificarSeExisteSave() { if (fs && caminhoDoSave) return fs.existsSync(caminhoDoSave); return localStorage.getItem('meu_save_fabrica_final') !== null; }
function salvarJogo(silencioso = false) { const dadosSave = { inventario: inventario, terreno: terrenoBloqueado, arvore: {}, mapa: [] }; for (const [k, t] of Object.entries(ARVORE_PESQUISA)) { dadosSave.arvore[k] = t.comprada; } for (let c = 0; c < COLUNAS; c++) { dadosSave.mapa[c] = []; for (let l = 0; l < LINHAS; l++) { let maq = mapa[c][l]; dadosSave.mapa[c][l] = maq ? { tipo: maq.tipo, progresso: maq.progresso } : null; } } try { if (fs && caminhoDoSave) { fs.writeFileSync(caminhoDoSave, JSON.stringify(dadosSave, null, 4), 'utf-8'); } else { localStorage.setItem('meu_save_fabrica_final', JSON.stringify(dadosSave)); } if(!silencioso) mostrarNotificacao("Salvo!", "sucesso"); } catch(e) {} }
function carregarJogo(silencioso = false) { let saveStr = null; if (fs && caminhoDoSave) { if (fs.existsSync(caminhoDoSave)) saveStr = fs.readFileSync(caminhoDoSave, 'utf-8'); } else { saveStr = localStorage.getItem('meu_save_fabrica_final'); } if (!saveStr) return false; try { const dadosSave = JSON.parse(saveStr); inventario = dadosSave.inventario; terrenoBloqueado = dadosSave.terreno; for (const [k, c] of Object.entries(dadosSave.arvore)) { if(ARVORE_PESQUISA[k]) { ARVORE_PESQUISA[k].comprada = c; if (c) { ARVORE_PESQUISA[k].destravaDOM.forEach(idDOM => { const el = document.getElementById(idDOM); if (el) el.classList.remove("trancado"); }); } } } for (let c = 0; c < COLUNAS; c++) { for (let l = 0; l < LINHAS; l++) { let dadosMaq = dadosSave.mapa[c][l]; if (dadosMaq) { let novaMaq = new Maquina(dadosMaq.tipo); novaMaq.progresso = dadosMaq.progresso; mapa[c][l] = novaMaq; } else { mapa[c][l] = null; } } } return true; } catch(e) { return false; } }

// ==========================================
// 4. MOTOR PIXI E CLASSES DE PRODUÇÃO
// ==========================================
const TILE_W = 128; const TILE_H = 64; const TILE_W_HALF = TILE_W / 2; const TILE_H_HALF = TILE_H / 2; const COLUNAS = 30; const LINHAS = 30;
PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST; 

const app = new PIXI.Application({ view: document.getElementById("telaDoJogo"), resizeTo: window, backgroundColor: 0x111111, resolution: window.devicePixelRatio || 1, autoDensity: true });
const mundo = new PIXI.Container(); mundo.sortableChildren = true; app.stage.addChild(mundo);

function ajustarCameraParaCentroDoTerreno() {
    const alturaCentro = (14 + 14) * TILE_H_HALF; 
    mundo.x = window.innerWidth / 2;
    mundo.y = (window.innerHeight / 2) - alturaCentro;
}

let mapa = []; let terrenoBloqueado = []; let modoExpansaoAtivo = false; let tipoExpansao = null; let objetosVisuais = []; 
for (let c = 0; c < COLUNAS; c++) {
    mapa[c] = []; terrenoBloqueado[c] = []; objetosVisuais[c] = [];
    for (let l = 0; l < LINHAS; l++) { 
        mapa[c][l] = null; if (c >= 12 && c <= 16 && l >= 12 && l <= 16) terrenoBloqueado[c][l] = false; else terrenoBloqueado[c][l] = true;
        const bloco = new PIXI.Container(); bloco.x = (c - l) * TILE_W_HALF; bloco.y = (c + l) * TILE_H_HALF; bloco.zIndex = c + l; 
        const fundo = PIXI.Sprite.from('assets/dirt.png'); fundo.anchor.set(0.5, 0.5); fundo.width = TILE_W; fundo.height = TILE_H; bloco.addChild(fundo);
        const imgSprite = new PIXI.Sprite(); imgSprite.anchor.set(0.5, 1); imgSprite.y = 32; imgSprite.visible = false; bloco.addChild(imgSprite);
        const barraFundo = new PIXI.Graphics(); barraFundo.beginFill(0x000000, 0.5); barraFundo.drawRect(-30, -50, 60, 6); barraFundo.endFill(); bloco.addChild(barraFundo);
        const barraProgresso = new PIXI.Graphics(); bloco.addChild(barraProgresso);
        mundo.addChild(bloco); objetosVisuais[c][l] = { fundo, imgSprite, barraFundo, barraProgresso };
    }
}

class Maquina {
    constructor(tipo) { this.tipo = tipo; this.progresso = 0; this.ligada = false; }
    atualizarGerador(dt) { const r = MAQUINAS[this.tipo]; if (this.progresso <= 0) { if (inventario.carvao >= 1) { inventario.carvao -= 1; this.progresso = r.tempoCiclo; this.ligada = true; } else this.ligada = false; } else { this.progresso -= dt; this.ligada = true; } }
    atualizarConsumidor(dt, powerOk) { const r = MAQUINAS[this.tipo]; if (!powerOk) { this.ligada = false; return; } let ok = true; for (const [i, q] of Object.entries(r.entrada)) if (inventario[i] < q) { ok = false; break; } if (ok) { this.ligada = true; this.progresso += dt; if (this.progresso >= r.tempoCiclo) { for (const [i, q] of Object.entries(r.entrada)) inventario[i] -= q; for (const [i, q] of Object.entries(r.saida)) inventario[i] += q; this.progresso -= r.tempoCiclo; } } else this.ligada = false; }
}

function processarFabrica(dt) {
    if (!jogoIniciadoAtivo) return; energiaGerada = 0; energiaConsumida = 0; let maqAtiv = [];
    for (let c = 0; c < COLUNAS; c++) for (let l = 0; l < LINHAS; l++) if (mapa[c][l]) maqAtiv.push(mapa[c][l]);
    maqAtiv.forEach(m => { if (MAQUINAS[m.tipo].geraEnergia) { m.atualizarGerador(dt); if (m.ligada) energiaGerada += MAQUINAS[m.tipo].geraEnergia; } });
    maqAtiv.forEach(m => { const r = MAQUINAS[m.tipo]; if (r.consomeEnergia) { if (energiaGerada - energiaConsumida >= r.consomeEnergia) { energiaConsumida += r.consomeEnergia; m.atualizarConsumidor(dt, true); } else m.atualizarConsumidor(dt, false); } });
}
function podePagar(custo) { for (const [i, q] of Object.entries(custo)) if (inventario[i] < q) return false; return true; }
function alterarInventario(custo, m = 1) { for (const [i, q] of Object.entries(custo)) inventario[i] -= q * m; }

// ==========================================
// 5. CÂMERA (WASD + ARRASTAR) E CONSTRUÇÃO
// ==========================================
let isDraggingCamera = false; let hasDragged = false; 
let dragStartX = 0; let dragStartY = 0; let cameraStartX = 0; let cameraStartY = 0;
let mouseXEdge = 0; let mouseYEdge = 0; const EDGE_THRESHOLD = 30;

const canvasDOM = document.getElementById("telaDoJogo");
canvasDOM.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener("mousemove", (evento) => { 
    if (!jogoIniciadoAtivo) return;
    mouseXEdge = evento.clientX; mouseYEdge = evento.clientY;

    if (isDraggingCamera) { 
        mundo.x = cameraStartX + (evento.clientX - dragStartX); 
        mundo.y = cameraStartY + (evento.clientY - dragStartY); 
        if (Math.abs(evento.clientX - dragStartX) > 5 || Math.abs(evento.clientY - dragStartY) > 5) {
            hasDragged = true; // Confirma que o mouse andou (não foi só um clique)
        }
    } 
});

window.addEventListener("mouseup", () => { isDraggingCamera = false; });
window.addEventListener("mouseout", () => { mouseXEdge = -1; mouseYEdge = -1; isDraggingCamera = false; });

canvasDOM.addEventListener("mousedown", (evento) => {
    if (!jogoIniciadoAtivo || evento.target.tagName !== 'CANVAS') return;

    if (evento.button === 2) { // Clique Direito: Cancela ferramentas e permite arrastar
        if (maquinaNaMao) { if (maquinaOrigemX !== null && maquinaOrigemY !== null && !mapa[maquinaOrigemX][maquinaOrigemY]) mapa[maquinaOrigemX][maquinaOrigemY] = maquinaNaMao; else alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1); maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null; mostrarNotificacao("Cancelado.", "sucesso"); return; } 
        else if (maquinaSelecionada || modoExpansaoAtivo) { maquinaSelecionada = null; modoExpansaoAtivo = false; document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado")); return; } 
    }

    // Inicia a Câmera livre com qualquer botão do mouse
    isDraggingCamera = true;
    hasDragged = false;
    dragStartX = evento.clientX; dragStartY = evento.clientY;
    cameraStartX = mundo.x; cameraStartY = mundo.y;
});

canvasDOM.addEventListener("mouseup", (evento) => {
    if (!jogoIniciadoAtivo || evento.target.tagName !== 'CANVAS') return;
    isDraggingCamera = false;

    // Se foi apenas um clique RÁPIDO com o Botão Esquerdo (sem arrastar) -> Constrói!
    if (evento.button === 0 && !hasDragged) {
        const rect = canvasDOM.getBoundingClientRect(); const scaleX = canvasDOM.width / rect.width; const scaleY = canvasDOM.height / rect.height;
        const mouseX = ((evento.clientX - rect.left) * scaleX) - mundo.x; const mouseY = ((evento.clientY - rect.top) * scaleY) - mundo.y;
        let mapX = (mouseX / TILE_W_HALF + (mouseY + TILE_H_HALF) / TILE_H_HALF) / 2; let mapY = ((mouseY + TILE_H_HALF) / TILE_H_HALF - mouseX / TILE_W_HALF) / 2;
        const col = Math.floor(mapX); const lin = Math.floor(mapY);
        const tooltip = document.getElementById("tooltip-maquina"); tooltip.classList.add("escondido");

        if (col < 0 || col >= COLUNAS || lin < 0 || lin >= LINHAS) return;

        if (modoExpansaoAtivo) { if (terrenoBloqueado[col][lin]) { let viz = (col > 0 && !terrenoBloqueado[col-1][lin]) || (col < COLUNAS-1 && !terrenoBloqueado[col+1][lin]) || (lin > 0 && !terrenoBloqueado[col][lin-1]) || (lin < LINHAS-1 && !terrenoBloqueado[col][lin+1]); if (viz) { let q = tipoExpansao === 'verde' ? 1 : 5; terrenoBloqueado[col][lin] = false; q--; while (q > 0) { let cd = []; for (let c = 0; c < COLUNAS; c++) for (let l = 0; l < LINHAS; l++) if (terrenoBloqueado[c][l]) if ((c>0&&!terrenoBloqueado[c-1][l])||(c<COLUNAS-1&&!terrenoBloqueado[c+1][l])||(l>0&&!terrenoBloqueado[c][l-1])||(l<LINHAS-1&&!terrenoBloqueado[c][l+1])) cd.push({c,l}); if (cd.length > 0) { let e = cd[Math.floor(Math.random() * cd.length)]; terrenoBloqueado[e.c][e.l] = false; q--; } else break; } modoExpansaoAtivo = false; mostrarNotificacao("Expandido!", "sucesso"); } else { mostrarNotificacao("Escolha um bloco escuro vizinho!"); } } return; }
        if (terrenoBloqueado[col][lin]) { mostrarNotificacao("Névoa!"); return; }

        if (maquinaSelecionada === "ferramenta_remover") { if (mapa[col][lin]) { const mqD = mapa[col][lin].tipo; alterarInventario(MAQUINAS[mqD].custo, -1); mapa[col][lin] = null; mostrarNotificacao("Removida", "sucesso"); atualizarInterfaceDOM(true); } return; }
        if (maquinaSelecionada === "ferramenta_mover") { if (!maquinaNaMao && mapa[col][lin]) { maquinaNaMao = mapa[col][lin]; maquinaOrigemX = col; maquinaOrigemY = lin; mapa[col][lin] = null; atualizarInterfaceDOM(true); } else if (maquinaNaMao && !mapa[col][lin]) { mapa[col][lin] = maquinaNaMao; maquinaNaMao = null; maquinaOrigemX = null; maquinaOrigemY = null; atualizarInterfaceDOM(true); } else if (maquinaNaMao && mapa[col][lin]) { mostrarNotificacao("Ocupado!"); } return; }

        if (maquinaSelecionada) { const custo = MAQUINAS[maquinaSelecionada].custo; if (!mapa[col][lin]) { if (podePagar(custo)) { alterarInventario(custo, 1); mapa[col][lin] = new Maquina(maquinaSelecionada); atualizarInterfaceDOM(true); } else { mostrarNotificacao("Sem materiais!"); } } else mostrarNotificacao("Ocupado!"); } 
        else if (!maquinaSelecionada && mapa[col][lin]) { let maq = mapa[col][lin]; let ref = MAQUINAS[maq.tipo]; tooltip.innerHTML = `<div style="font-weight:bold; font-size:1.1em; color:#3498db; padding-bottom:4px;">${ref.nome}</div><div style="color:#ccc; margin-bottom:8px;">${ref.textoInspecao}</div><div style="color:${maq.ligada?'#2ecc71':'#e74c3c'}">Status: ${maq.ligada?'● Operando':'● Parada'}</div>`; tooltip.style.left = (evento.clientX + 15) + "px"; tooltip.style.top = (evento.clientY + 15) + "px"; tooltip.classList.remove("escondido"); }
    }
});

// ==========================================
// 6. RENDER LOOP E INTERFACE
// ==========================================
let contadorFrames = 0;
function atualizarInterfaceDOM(forcar = false) {
    if (!jogoIniciadoAtivo && !forcar) return; contadorFrames++; if (contadorFrames % 10 !== 0 && !forcar) return; 
    document.getElementById("texto-energia").innerText = `${energiaConsumida} / ${energiaGerada}`; document.getElementById("texto-energia").style.color = (energiaConsumida > 0 && energiaConsumida >= energiaGerada) ? "#e74c3c" : "#fff";
    document.getElementById("texto-pesq-verde").innerText = inventario.pesquisa_verde; document.getElementById("texto-pesq-vermelha").innerText = inventario.pesquisa_vermelha;
    const div = document.getElementById("lista-inventario"); div.innerHTML = "";
    for (const [id, q] of Object.entries(inventario)) { if (!id.includes("pesquisa") && (q > 0 || (ITENS[id] && ITENS[id].inicial))) { const i = ITENS[id]; div.innerHTML += `<div class="item-linha"><img src="${i.imagem}" class="icone-inv"><span>${i.nome}: <strong>${q}</strong></span></div>`; } }
}

app.ticker.add((delta) => {
    if (!jogoIniciadoAtivo) return; 
    const dt = app.ticker.deltaMS; 
    
    const camSpeed = 15 * delta;
    let edgePanX = 0; let edgePanY = 0;

    if (mouseXEdge >= 0 && mouseYEdge >= 0 && !isDraggingCamera) {
        if (mouseXEdge < EDGE_THRESHOLD) edgePanX = 1; else if (mouseXEdge > window.innerWidth - EDGE_THRESHOLD) edgePanX = -1;
        if (mouseYEdge < EDGE_THRESHOLD) edgePanY = 1; else if (mouseYEdge > window.innerHeight - EDGE_THRESHOLD) edgePanY = -1;
    }

    if (keys.w || edgePanY === 1) mundo.y += camSpeed; if (keys.s || edgePanY === -1) mundo.y -= camSpeed; 
    if (keys.a || edgePanX === 1) mundo.x += camSpeed; if (keys.d || edgePanX === -1) mundo.x -= camSpeed;

    processarFabrica(dt);

    for (let c = 0; c < COLUNAS; c++) {
        for (let l = 0; l < LINHAS; l++) {
            const visual = objetosVisuais[c][l]; visual.barraProgresso.clear();
            if (terrenoBloqueado[c][l]) { visual.fundo.tint = 0x333333; visual.imgSprite.visible = false; visual.barraFundo.visible = false; continue; }
            visual.fundo.tint = 0xFFFFFF; 
            let maquina = mapa[c][l];
            if (maquina) {
                const ref = MAQUINAS[maquina.tipo];
                visual.imgSprite.texture = PIXI.Texture.from(ref.imagem);
                visual.imgSprite.alpha = maquina.ligada ? 1.0 : 0.6;
                visual.imgSprite.visible = true; visual.barraFundo.visible = true;
                let proporcao = ref.geraEnergia ? Math.max(maquina.progresso / ref.tempoCiclo, 0) : Math.min(maquina.progresso / ref.tempoCiclo, 1);
                visual.barraProgresso.beginFill(ref.geraEnergia ? 0xf1c40f : 0x2ecc71, 0.8);
                visual.barraProgresso.drawRect(-30, -50, 60 * proporcao, 6); visual.barraProgresso.endFill();
            } else { visual.imgSprite.visible = false; visual.barraFundo.visible = false; }
        }
    }
    atualizarInterfaceDOM();
});
setInterval(() => { if (jogoIniciadoAtivo) salvarJogo(true); }, 30000);