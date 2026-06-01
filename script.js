// ==========================================
// VARIÁVEIS DE ESTADO (MEMÓRIA DO JOGO)
// ==========================================
let umidade = 50;
let saude = 100;
let sustentabilidade = 100;
let pontos = 0;
let temPraga = false;
let tempoParaColheita = 0;

// ==========================================
// MAPEAMENTO DOS ELEMENTOS DO HTML (DOM)
// ==========================================
const txtAgua = document.getElementById('txt-agua');
const txtSaude = document.getElementById('txt-saude');
const txtSustentavel = document.getElementById('txt-sustentavel');
const txtPontos = document.getElementById('txt-pontos');
const alertaPraga = document.getElementById('alerta-praga');
const iconePlanta = document.getElementById('icone-planta');
const btnColheita = document.getElementById('btn-colheita');
const log = document.getElementById('log');

const barraAgua = document.getElementById('agua-barra');
const barraSaude = document.getElementById('saude-barra');
const barraSustentavel = document.getElementById('sustentavel-barra');

// ==========================================
// LOOP PRINCIPAL (Roda sozinho a cada 3 segundos)
// ==========================================
setInterval(() => {
    // 1. O tempo passa e a terra vai secando
    umidade = Math.max(0, umidade - 8);
    
    // 2. Chance aleatória (25%) de aparecer lagartas se a planta não estiver pronta
    if (!temPraga && Math.random() < 0.25 && tempoParaColheita < 5) {
        temPraga = true;
        adicionarLog("⚠️ ALERTA: Lagartas atacando a plantação!");
    }

    // 3. Consequência do ataque das pragas
    if (temPraga) {
        saude = Math.max(0, saude - 12);
    }

    // 4. Consequência de secar ou encharcar a planta
    if (umidade < 20 || umidade > 80) {
        saude = Math.max(0, saude - 8);
        adicionarLog("⚠️ A umidade está inadequada! A saúde da planta está caindo.");
    }

    // 5. Se a planta estiver saudável, ela cresce
    if (saude > 50 && tempoParaColheita < 5) {
        tempoParaColheita++;
        mudarEstagioPlanta();
    }

    // 6. Condição de Game Over (Planta Morreu)
    if (saude <= 0) {
        iconePlanta.innerText = "🥀";
        adicionarLog("❌ A planta morreu. Recarregue a página para tentar de novo.");
        desativarBotoes();
    }

    // Atualiza tudo visualmente na tela
    atualizarTela();
}, 3000);

// ==========================================
// AÇÕES DO JOGADOR (Ativadas pelos botões)
// ==========================================

// Função para Regar
function regar() {
    umidade = Math.min(100, umidade + 25);
    adicionarLog("💧 Você irrigou a lavoura.");
    atualizarTela();
}

// Função de Controle Biológico (Sustentável)
function controleBiologico() {
    if (temPraga) {
        temPraga = false;
        sustentabilidade = Math.min(100, sustentabilidade + 5); // Bônus ecológico
        adicionarLog("🐞 Joaninhas soltas! Controle biológico feito com equilíbrio.");
    } else {
        adicionarLog("Não há pragas para combater no momento.");
    }
    atualizarTela();
}

// Função de Defensivo Químico (Tradicional)
function controleQuimico() {
    if (temPraga) {
        temPraga = false;
        sustentabilidade = Math.max(0, sustentabilidade - 25); // Penalidade pesada no meio ambiente
        adicionarLog("🧪 Defensivo aplicado. Pragas eliminadas, mas afetou o ecossistema.");
    } else {
        adicionarLog("Não há pragas para combater no momento.");
    }
    atualizarTela();
}

// Função para Colher e pontuar
function colher() {
    // Fórmula que valoriza o equilíbrio: Saúde + Sustentabilidade
    let pontosGanhos = Math.round((saude + sustentabilidade) * 5);
    pontos += pontosGanhos;
    adicionarLog(`🎉 Colheita realizada! Você ganhou ${pontosGanhos} pontos pelo seu manejo.`);
    
    // Reseta o ciclo para plantar de novo
    tempoParaColheita = 0;
    saude = 100;
    umidade = 50;
    iconePlanta.innerText = "🌱";
    btnColheita.disabled = true;
    atualizarTela();
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Atualiza os textos e o tamanho das barras de progresso
function atualizarTela() {
    txtAgua.innerText = umidade;
    txtSaude.innerText = saude;
    txtSustentavel.innerText = sustentabilidade;
    txtPontos.innerText = pontos;

    barraAgua.style.width = umidade + "%";
    barraSaude.style.width = saude + "%";
    barraSustentavel.style.width = sustentabilidade + "%";

    if (temPraga) {
        alertaPraga.innerText = "🐛 PRAGA DETECTADA (Lagartas)";
    } else {
        alertaPraga.innerText = "";
    }

    // Libera o botão de colheita se chegar ao estágio final
    if (tempoParaColheita >= 5 && saude > 0) {
        btnColheita.disabled = false;
    }
}

// Muda o emoji da planta conforme ela cresce
function mudarEstagioPlanta() {
    if (tempoParaColheita == 1) iconePlanta.innerText = "🌱";
    if (tempoParaColheita == 3) iconePlanta.innerText = "🌿";
    if (tempoParaColheita == 5) {
        iconePlanta.innerText = "🌳";
        adicionarLog("✨ A planta está pronta para a colheita!");
    }
}

// Cria a lista de mensagens (Log) na tela
function adicionarLog(texto) {
    log.innerHTML = texto + "<br>" + log.innerHTML;
}

// Trava o jogo caso a planta morra
function desativarBotoes() {
    document.querySelectorAll('button').forEach(b => b.disabled = true);
}6