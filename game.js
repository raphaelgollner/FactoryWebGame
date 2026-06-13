// ==========================================
// 1. TEMPLATES E DADOS 
// ==========================================

const ITENS = {
    carvao: { nome: "Carvão", emoji: "🪨", inicial: true },
    minerio_ferro: { nome: "Min. Ferro", emoji: "🪙" },
    minerio_cobre: { nome: "Min. Cobre", emoji: "🟠" },
    lingote_ferro: { nome: "Ling. Ferro", emoji: "🧱" },
    lingote_cobre: { nome: "Ling. Cobre", emoji: "🟧" },
    lingote_aco: { nome: "Ling. Aço", emoji: "🦾" },
    chapa_ferro: { nome: "Chapa Ferro", emoji: "🛡️", inicial: true },
    chapa_cobre: { nome: "Chapa Cobre", emoji: "🔌", inicial: true },
    chapa_aco: { nome: "Chapa Aço", emoji: "🔳" },
    barra_ferro: { nome: "Barra de Ferro", emoji: "📏" },
    parafuso: { nome: "Parafusos", emoji: "🔩" },
    fio_cobre: { nome: "Fio Cobre", emoji: "🧵" },
    cabo_eletrico: { nome: "Cabo Elétrico", emoji: "🪢" },
    chapa_reforcada: { nome: "Chapa Reforçada", emoji: "🔰" }
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
    gerador_carvao: { nome: "Gerador a Carvão", emoji: "🏭", tempoCiclo: 4000, custo: { chapa_ferro: 25, chapa_cobre: 25 }, entrada: { carvao: 1 }, saida: {}, geraEnergia: 50, textoInspecao: "Gera: 50 ⚡ constantes<br>Consome: 15 🪨 / min" },
    mineradora_carvao: { nome: "Mineradora de Carvão", emoji: "⛏️", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { carvao: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 🪨 / min<br>Usa: 5 ⚡" },
    mineradora_cobre: { nome: "Mineradora de Cobre", emoji: "⛏️", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { minerio_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 🟠 / min<br>Usa: 5 ⚡" },
    mineradora_ferro: { nome: "Mineradora de Ferro", emoji: "⛏️", tempoCiclo: 1000, custo: { chapa_ferro: 10 }, entrada: {}, saida: { minerio_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Produz: 60 🪙 / min<br>Usa: 5 ⚡" },
    fornalha_ferro: { nome: "Fornalha (Lingote de Ferro)", emoji: "🔥", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { minerio_ferro: 1 }, saida: { lingote_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 🪙 / min<br>Sai: 30 🧱 / min<br>Usa: 5 ⚡" },
    fornalha_cobre: { nome: "Fornalha (Lingote de Cobre)", emoji: "🔥", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { minerio_cobre: 1 }, saida: { lingote_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 🟠 / min<br>Sai: 30 🟧 / min<br>Usa: 5 ⚡" },
    fundicao_aco: { nome: "Fundição (Lingote de Aço)", emoji: "🌋", tempoCiclo: 4000, custo: { chapa_ferro: 20 }, entrada: { minerio_ferro: 1, carvao: 1 }, saida: { lingote_aco: 2 }, consomeEnergia: 10, textoInspecao: "Entra: 15 🪙 + 15 🪨 / min<br>Sai: 30 🦾 / min<br>Usa: 10 ⚡" },
    montadora_ferro: { nome: "Montadora (Chapa de Ferro)", emoji: "⚙️", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { chapa_ferro: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 🧱 / min<br>Sai: 30 🛡️ / min<br>Usa: 5 ⚡" },
    montadora_barra: { nome: "Montadora (Barra de Ferro)", emoji: "⚙️", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { barra_ferro: 2 }, consomeEnergia: 5, textoInspecao: "Entra: 15 🧱 / min<br>Sai: 30 📏 / min<br>Usa: 5 ⚡" },
    montadora_parafuso: { nome: "Montadora (Parafusos)", emoji: "⚙️", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_ferro: 1 }, saida: { parafuso: 2 }, consomeEnergia: 5, textoInspecao: "Entra: 15 🧱 / min<br>Sai: 30 🔩 / min<br>Usa: 5 ⚡" },
    montadora_cobre: { nome: "Montadora (Chapa de Cobre)", emoji: "⚙️", tempoCiclo: 2000, custo: { chapa_ferro: 10 }, entrada: { lingote_cobre: 1 }, saida: { chapa_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 🟧 / min<br>Sai: 30 🔌 / min<br>Usa: 5 ⚡" },
    montadora_fio: { nome: "Montadora (Fio de Cobre)", emoji: "⚙️", tempoCiclo: 4000, custo: { chapa_ferro: 10 }, entrada: { lingote_cobre: 1 }, saida: { fio_cobre: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 15 🟧 / min<br>Sai: 15 🧵 / min<br>Usa: 5 ⚡" },
    montadora_cabo: { nome: "Montadora (Cabo Elétrico)", emoji: "⚙️", tempoCiclo: 2000, custo: { chapa_ferro: 15 }, entrada: { fio_cobre: 2 }, saida: { cabo_eletrico: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 60 🧵 / min<br>Sai: 30 🪢 / min<br>Usa: 5 ⚡" },
    montadora_aco: { nome: "Montadora (Chapa de Aço)", emoji: "⚙️", tempoCiclo: 4000, custo: { chapa_ferro: 15 }, entrada: { lingote_aco: 2 }, saida: { chapa_aco: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 30 🦾 / min<br>Sai: 15 🔳 / min<br>Usa: 5 ⚡" },
    montadora_reforcada: { nome: "Mont. (Chapa Reforçada)", emoji: "⚙️", tempoCiclo: 12000, custo: { chapa_ferro: 20 }, entrada: { parafuso: 12, chapa_ferro: 6 }, saida: { chapa_reforcada: 1 }, consomeEnergia: 5, textoInspecao: "Entra: 60 🔩 + 30 🛡️ / min<br>Sai: 5 🔰 / min<br>Usa: 5 ⚡" }
};

// ==========================================
// 2. SISTEMA DE ÁRVORE DE PESQUISA 
// ==========================================

const ARVORE_PESQUISA = {
    parafuso: { titulo: "🔩 Parafusos", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_parafuso", "card-venda-parafuso"], comprada: false },
    cabo: { titulo: "🪢 Cabo Elétrico", verde: 50, vermelho: 0, requisita: [], destravaDOM: ["btn-montadora_cabo", "card-venda-cabo_eletrico"], comprada: false },
    aco: { titulo: "🌋 Lingote de Aço", verde: 50, vermelho: 15, requisita: ["parafuso", "cabo"], destravaDOM: ["btn-fundicao_aco"], comprada: false },
    chapa_aco: { titulo: "🔳 Chapa de Aço", verde: 50, vermelho: 50, requisita: ["aco"], destravaDOM: ["btn-montadora_aco", "card-venda-chapa_aco"], comprada: false },
    chapa_reforcada: { titulo: "🔰 Chapa Reforçada", verde: 100, vermelho: 100, requisita: ["chapa_aco"], destravaDOM: ["btn-montadora_reforcada", "card-venda-reforcada"], comprada: false }
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

function fecharArvore() {
    document.getElementById("modal-arvore").classList.add("escondido");
}

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
                divNode.innerHTML = `<div class="node-tech-titulo">${tech.titulo}</div><div style="color:#2ecc71; font-weight:bold;">Pesquisado ✔️</div>`;
            } else if (todasRequisicoesCompradas) {
                divNode.className = "node-tech disponivel";
                divNode.innerHTML = `
                    <div class="node-tech-titulo">${tech.titulo}</div>
                    <div class="node-tech-custo">Custo:<br>${tech.verde > 0 ? tech.verde + ' 🟢' : ''} ${tech.vermelho > 0 ? tech.vermelho + ' 🔴' : ''}</div>
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

        mostrarNotificacao(`💡 Pesquisa Concluída: ${tech.titulo}`, "pesquisa");
        renderizarArvore(); 
    } else {
        mostrarNotificacao("❌ Pontos de Pesquisa Insuficientes!");
    }
}


// ==========================================
// 3. SISTEMA DE UI E SAVE/LOAD (NOVO)
// ==========================================

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
    notif.innerText = mensagem;
    container.appendChild(notif);
    setTimeout(() => {
        notif.classList.add("sumindo");
        setTimeout(() => notif.remove(), 400);
    }, 3000);
}

function gerarPesquisa(item_id, quantidade) {
    let qtdParaVender = quantidade === "tudo" ? inventario[item_id] : quantidade;
    if (qtdParaVender > 0 && inventario[item_id] >= qtdParaVender) {
        const dadosPesquisa = PRECOS_PESQUISA[item_id];
        const ganhoFinal = qtdParaVender * dadosPesquisa.valor;
        
        inventario[item_id] -= qtdParaVender;
        
        if (dadosPesquisa.tipo === 'verde') {
            inventario.pesquisa_verde += ganhoFinal;
            mostrarNotificacao(`+${ganhoFinal} Pesquisa Básica 🟢`, "sucesso");
        } else {
            inventario.pesquisa_vermelha += ganhoFinal;
            mostrarNotificacao(`+${ganhoFinal} Pesquisa Avançada 🔴`, "sucesso");
        }
    } else {
        mostrarNotificacao(`❌ Você não tem ${ITENS[item_id].nome} suficiente!`);
    }
}

// Funções de Salvar e Carregar
function salvarJogo(silencioso = false) {
    const dadosSave = {
        inventario: inventario,
        terreno: terrenoBloqueado,
        arvore: {},
        mapa: []
    };

    // Salva o status da Árvore
    for (const [key, tech] of Object.entries(ARVORE_PESQUISA)) {
        dadosSave.arvore[key] = tech.comprada;
    }

    // Salva o Mapa extraindo apenas os dados importantes das instâncias
    for (let c = 0; c < COLUNAS; c++) {
        dadosSave.mapa[c] = [];
        for (let l = 0; l < LINHAS; l++) {
            let maq = mapa[c][l];
            if (maq) {
                dadosSave.mapa[c][l] = { tipo: maq.tipo, progresso: maq.progresso };
            } else {
                dadosSave.mapa[c][l] = null;
            }
        }
    }

    localStorage.setItem('meu_save_fabrica', JSON.stringify(dadosSave));
    
    if(!silencioso) {
        mostrarNotificacao("💾 Progresso Salvo!", "sucesso");
    }
}

function carregarJogo(silencioso = false) {
    const saveStr = localStorage.getItem('meu_save_fabrica');
    if (!saveStr) {
        if(!silencioso) mostrarNotificacao("❌ Nenhum save encontrado!");
        return;
    }

    const dadosSave = JSON.parse(saveStr);

    inventario = dadosSave.inventario;
    terrenoBloqueado = dadosSave.terreno;

    // Restaura a Árvore e destranca o visual (DOM)
    for (const [key, comprada] of Object.entries(dadosSave.arvore)) {
        ARVORE_PESQUISA[key].comprada = comprada;
        if (comprada) {
            ARVORE_PESQUISA[key].destravaDOM.forEach(idDOM => {
                const elemento = document.getElementById(idDOM);
                if (elemento) elemento.classList.remove("trancado");
            });
        }
    }

    // Recria as instâncias das máquinas no Mapa
    for (let c = 0; c < COLUNAS; c++) {
        for (let l = 0; l < LINHAS; l++) {
            let dadosMaq = dadosSave.mapa[c][l];
            if (dadosMaq) {
                let novaMaq = new Maquina(dadosMaq.tipo);
                novaMaq.progresso = dadosMaq.progresso;
                mapa[c][l] = novaMaq;
            } else {
                mapa[c][l] = null;
            }
        }
    }

    if (!document.getElementById("modal-arvore").classList.contains("escondido")) {
        renderizarArvore();
    }

    if(!silencioso) mostrarNotificacao("📂 Progresso Carregado!", "sucesso");
}

function resetarJogo() {
    if(confirm("Tem certeza que deseja apagar todo o seu progresso? Isso não pode ser desfeito!")) {
        localStorage.removeItem('meu_save_fabrica');
        location.reload(); 
    }
}

// Funções para Expandir e Recolher os menus sanfonados
function expandirTudo() {
    // Pega todas as tags <details> dentro da aba de construir e as abre
    document.querySelectorAll('#aba-construir details').forEach(det => det.open = true);
}

function recolherTudo() {
    // Pega todas as tags <details> dentro da aba de construir e as fecha
    document.querySelectorAll('#aba-construir details').forEach(det => det.open = false);
}

// ==========================================
// 4. INICIANDO O PIXIJS E A GRADE
// ==========================================

const TAMANHO_CELULA = 60; const COLUNAS = 10; const LINHAS = 10;

const app = new PIXI.Application({
    view: document.getElementById("telaDoJogo"),
    width: COLUNAS * TAMANHO_CELULA, height: LINHAS * TAMANHO_CELULA,
    backgroundColor: 0x333333, resolution: window.devicePixelRatio || 1, autoDensity: true
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
        const texto = new PIXI.Text('', { fontSize: 30 });
        texto.anchor.set(0.5); texto.x = TAMANHO_CELULA / 2; texto.y = TAMANHO_CELULA / 2;
        blocoContainer.addChild(texto);
        const barraFundo = new PIXI.Graphics();
        barraFundo.beginFill(0x000000, 0.5); barraFundo.drawRect(0, TAMANHO_CELULA - 6, TAMANHO_CELULA, 6); barraFundo.endFill();
        blocoContainer.addChild(barraFundo);
        const barraProgresso = new PIXI.Graphics(); blocoContainer.addChild(barraProgresso);

        app.stage.addChild(blocoContainer);
        objetosVisuais[c][l] = { fundo, texto, barraFundo, barraProgresso };
    }
}

let maquinaSelecionada = null; 
let maquinaNaMao = null; 

function selecionarConstrucao(tipo) {
    modoExpansaoAtivo = false; 
    maquinaSelecionada = tipo;
    
    if (maquinaNaMao) {
        alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1);
        maquinaNaMao = null;
        mostrarNotificacao("Movimentação cancelada. Recursos devolvidos.", "sucesso");
    }

    document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado"));
    
    const btn = document.getElementById(`btn-${tipo}`);
    if (btn) btn.classList.add("selecionado");
    
    document.getElementById("tooltip-maquina").classList.add("escondido");
}

function comprarExpansao(tipo) {
    const custo = 50;
    if (tipo === 'verde' && inventario.pesquisa_verde < custo) { mostrarNotificacao("❌ Pesquisa Básica 🟢 Insuficiente!"); return; }
    if (tipo === 'vermelho' && inventario.pesquisa_vermelha < custo) { mostrarNotificacao("❌ Pesquisa Avançada 🔴 Insuficiente!"); return; }
    
    if (maquinaNaMao) {
        alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1);
        maquinaNaMao = null;
    }

    modoExpansaoAtivo = true; 
    tipoExpansao = tipo;
    maquinaSelecionada = null; 
    
    document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado"));
    document.getElementById("tooltip-maquina").classList.add("escondido");
    mostrarNotificacao("🗺️ Clique em um bloco 🔒 brilhante para expandir!", "sucesso");
}

function podePagar(custo) {
    for (const [item, qtd] of Object.entries(custo)) { if (inventario[item] < qtd) return false; }
    return true;
}
function alterarInventario(custo, multiplicar = 1) {
    for (const [item, qtd] of Object.entries(custo)) { inventario[item] -= qtd * multiplicar; }
}

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
// 6. INTERAÇÃO 
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
            alterarInventario(MAQUINAS[maquinaNaMao.tipo].custo, -1);
            maquinaNaMao = null;
            mostrarNotificacao("Mão limpa. Recursos devolvidos.", "sucesso");
            return;
        }
        if (maquinaSelecionada || modoExpansaoAtivo) {
            maquinaSelecionada = null; modoExpansaoAtivo = false;
            document.querySelectorAll(".btn-maquina").forEach(btn => btn.classList.remove("selecionado"));
            return;
        } 
        return;
    }

    if (evento.button === 0) {
        if (modoExpansaoAtivo) {
            if (terrenoBloqueado[col][lin]) {
                let temVizinho = (col > 0 && !terrenoBloqueado[col-1][lin]) || (col < COLUNAS-1 && !terrenoBloqueado[col+1][lin]) || 
                                 (lin > 0 && !terrenoBloqueado[col][lin-1]) || (lin < LINHAS-1 && !terrenoBloqueado[col][lin+1]);
                
                if (temVizinho) {
                    let custo = 50;
                    let quantidadeParaDesbloquear = (tipoExpansao === 'verde') ? 1 : 5;

                    if (tipoExpansao === 'verde' && inventario.pesquisa_verde >= custo) {
                        inventario.pesquisa_verde -= custo;
                    } else if (tipoExpansao === 'vermelho' && inventario.pesquisa_vermelha >= custo) {
                        inventario.pesquisa_vermelha -= custo;
                    } else {
                        mostrarNotificacao("❌ Pontos Insuficientes!");
                        modoExpansaoAtivo = false; return;
                    }

                    terrenoBloqueado[col][lin] = false;
                    quantidadeParaDesbloquear--;

                    while (quantidadeParaDesbloquear > 0) {
                        let candidatos = [];
                        for (let c = 0; c < COLUNAS; c++) {
                            for (let l = 0; l < LINHAS; l++) {
                                if (terrenoBloqueado[c][l]) {
                                    let v = (c > 0 && !terrenoBloqueado[c-1][l]) || (c < COLUNAS-1 && !terrenoBloqueado[c+1][l]) || 
                                            (l > 0 && !terrenoBloqueado[c][l-1]) || (l < LINHAS-1 && !terrenoBloqueado[c][l+1]);
                                    if (v) candidatos.push({c, l});
                                }
                            }
                        }
                        if (candidatos.length > 0) {
                            let escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
                            terrenoBloqueado[escolhido.c][escolhido.l] = false;
                            quantidadeParaDesbloquear--;
                        } else { break; }
                    }

                    modoExpansaoAtivo = false; 
                    mostrarNotificacao("🗺️ Terreno Expandido!", "sucesso");
                } else { mostrarNotificacao("⚠️ Escolha um bloco vizinho a um terreno já livre!"); }
            } else { modoExpansaoAtivo = false; }
            return; 
        }

        if (terrenoBloqueado[col][lin]) { mostrarNotificacao("🔒 Terreno Bloqueado! Compre expansões."); return; }

        if (maquinaSelecionada === "ferramenta_remover") {
            if (mapa[col][lin]) {
                const maqDel = mapa[col][lin].tipo;
                alterarInventario(MAQUINAS[maqDel].custo, -1);
                mapa[col][lin] = null;
                mostrarNotificacao("🗑️ Máquina Removida (Reembolsada)", "sucesso");
            }
            return;
        }

        if (maquinaSelecionada === "ferramenta_mover") {
            if (!maquinaNaMao && mapa[col][lin]) {
                maquinaNaMao = mapa[col][lin]; mapa[col][lin] = null;
                mostrarNotificacao("📦 Selecione o novo local");
            } else if (maquinaNaMao && !mapa[col][lin]) {
                mapa[col][lin] = maquinaNaMao; maquinaNaMao = null;
            } else if (maquinaNaMao && mapa[col][lin]) {
                mostrarNotificacao("⚠️ O destino está ocupado!");
            }
            return;
        }

        if (maquinaSelecionada && maquinaSelecionada !== 'expansao') {
            const custo = MAQUINAS[maquinaSelecionada].custo;
            if (!mapa[col][lin]) {
                if (podePagar(custo)) {
                    alterarInventario(custo, 1);
                    mapa[col][lin] = new Maquina(maquinaSelecionada);
                } else { mostrarNotificacao("❌ Materiais Insuficientes!"); }
            } else { mostrarNotificacao("⚠️ Esse espaço já está ocupado!"); }
        } 
        else if (!maquinaSelecionada && mapa[col][lin]) {
            let maq = mapa[col][lin]; let ref = MAQUINAS[maq.tipo];
            tooltip.innerHTML = `
                <div style="font-weight:bold; font-size:1.1em; margin-bottom: 8px; color: #3498db; border-bottom: 1px solid #444; padding-bottom: 4px;">
                    ${ref.emoji} ${ref.nome}
                </div>
                <div style="color: #ccc; margin-bottom: 8px;">${ref.textoInspecao}</div>
                <div style="font-size: 0.9em; font-weight: bold; color: ${maq.ligada ? '#2ecc71' : '#e74c3c'}">
                    Status: ${maq.ligada ? '🟢 Operando' : '🔴 Parada'}
                </div>
            `;
            tooltip.style.left = (evento.clientX + 15) + "px"; tooltip.style.top = (evento.clientY + 15) + "px";
            tooltip.classList.remove("escondido");
        }
    }
});

let contadorFrames = 0;
function atualizarInterfaceDOM() {
    contadorFrames++;
    if (contadorFrames % 10 !== 0) return; 

    const spanEnergia = document.getElementById("texto-energia");
    spanEnergia.innerText = `${energiaConsumida} / ${energiaGerada}`;
    spanEnergia.style.color = (energiaConsumida > 0 && energiaConsumida >= energiaGerada) ? "#e74c3c" : "#000";

    document.getElementById("texto-pesq-verde").innerText = inventario.pesquisa_verde;
    document.getElementById("texto-pesq-vermelha").innerText = inventario.pesquisa_vermelha;

    const div = document.getElementById("lista-inventario");
    div.innerHTML = "";
    for (const [id_item, quantidade] of Object.entries(inventario)) {
        if (id_item.includes("pesquisa")) continue; 
        if (quantidade > 0 || ITENS[id_item].inicial) {
            const info = ITENS[id_item];
            div.innerHTML += `
                <div class="item-linha">
                    <span>${info.emoji}</span> 
                    <span>${info.nome}: <strong>${quantidade}</strong></span>
                </div>
            `;
        }
    }
}

// ==========================================
// 7. O MOTOR DO JOGO (TICKER DO PIXIJS E AUTOSAVE)
// ==========================================

app.ticker.add((delta) => {
    const deltaTempo = app.ticker.deltaMS; 
    processarFabrica(deltaTempo);

    for (let c = 0; c < COLUNAS; c++) {
        for (let l = 0; l < LINHAS; l++) {
            const visual = objetosVisuais[c][l];
            visual.fundo.clear(); visual.barraProgresso.clear();

            if (terrenoBloqueado[c][l]) {
                let temVizinho = (c > 0 && !terrenoBloqueado[c-1][l]) || (c < COLUNAS-1 && !terrenoBloqueado[c+1][l]) || 
                                 (l > 0 && !terrenoBloqueado[c][l-1]) || (l < LINHAS-1 && !terrenoBloqueado[c][l+1]);

                if (modoExpansaoAtivo && temVizinho) {
                    visual.fundo.beginFill(0x2a2a36);
                    visual.fundo.lineStyle(2, tipoExpansao === 'verde' ? 0x2ecc71 : 0xe74c3c); 
                    visual.fundo.drawRect(0, 0, TAMANHO_CELULA, TAMANHO_CELULA); visual.fundo.endFill();
                    visual.texto.text = "✨"; visual.texto.style.fill = tipoExpansao === 'verde' ? "#2ecc71" : "#e74c3c";
                } else {
                    visual.fundo.beginFill(0x1a1a24); visual.fundo.lineStyle(2, 0x111111);
                    visual.fundo.drawRect(0, 0, TAMANHO_CELULA, TAMANHO_CELULA); visual.fundo.endFill();
                    visual.texto.text = "🔒"; visual.texto.style.fill = "#444444";
                }
                visual.barraFundo.visible = false; continue; 
            }

            visual.fundo.lineStyle(2, 0x444444); visual.fundo.drawRect(0, 0, TAMANHO_CELULA, TAMANHO_CELULA); visual.fundo.endFill();

            let maquina = mapa[c][l];
            if (maquina) {
                visual.texto.text = MAQUINAS[maquina.tipo].emoji;
                visual.texto.alpha = maquina.ligada ? 1.0 : 0.3;
                visual.barraFundo.visible = true;

                const ref = MAQUINAS[maquina.tipo];
                let proporcao;
                if (ref.geraEnergia) {
                    proporcao = Math.max(maquina.progresso / ref.tempoCiclo, 0);
                    visual.barraProgresso.beginFill(0xf1c40f, 0.8);
                } else {
                    proporcao = Math.min(maquina.progresso / ref.tempoCiclo, 1);
                    visual.barraProgresso.beginFill(0x2ecc71, 0.8);
                }
                visual.barraProgresso.drawRect(0, TAMANHO_CELULA - 6, TAMANHO_CELULA * proporcao, 6); visual.barraProgresso.endFill();
            } else {
                visual.texto.text = ""; visual.barraFundo.visible = false;
            }
        }
    }
    atualizarInterfaceDOM();
});

// Auto-Save a cada 30 segundos
setInterval(() => {
    salvarJogo(true); // 'true' para salvar sem aparecer o pop-up na tela
}, 30000);

// Auto-Load ao abrir a página
window.onload = () => {
    if (localStorage.getItem('meu_save_fabrica')) {
        carregarJogo(true);
    }
};