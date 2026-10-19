// Componente BobIA - Suporte Operacional Helis / NextLog
(function () {
    // Evita duplicar se carregado mais de uma vez
    if (document.getElementById('bobia-widget-container')) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'bobia-widget-container';
    container.className = 'bobia-widget-container';

    container.innerHTML = `
        <div class="bobia-modal" id="bobia-modal" role="dialog" aria-label="Suporte BobIA">
            <div class="bobia-header">
                <div class="bobia-header-info">
                    <img src="assets/icon/bobia.svg" alt="Avatar BobIA" class="bobia-header-avatar">
                    <div class="bobia-header-text">
                        <span class="bobia-header-title">BobIA</span>
                        <span class="bobia-header-subtitle">
                            <span class="bobia-status-dot"></span> Suporte Operacional
                        </span>
                    </div>
                </div>
                <div class="bobia-header-actions">
                    <button class="bobia-header-btn" id="bobia-btn-clear" title="Limpar conversa">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                    <button class="bobia-header-btn" id="bobia-btn-close" title="Fechar">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <div class="bobia-messages" id="bobia-messages">
                <div class="bobia-message-row bobia">
                    <img src="assets/icon/bobia.svg" alt="BobIA" class="bobia-msg-avatar">
                    <div class="bobia-bubble">
                        <p>Olá! Sou o <strong>BobIA</strong>, assistente de operações da NextLog. Como posso ajudar com seus fretes, veículos ou métricas hoje?</p>
                    </div>
                </div>
            </div>

            <div class="bobia-quick-suggestions" id="bobia-suggestions">
                <button type="button" class="bobia-suggestion-chip" data-pergunta="Como interpreto meus alertas de frete?">Alertas de frete</button>
                <button type="button" class="bobia-suggestion-chip" data-pergunta="Onde acompanho o faturamento?">Faturamento</button>
                <button type="button" class="bobia-suggestion-chip" data-pergunta="Como filtrar veículos por status?">Filtrar veículos</button>
            </div>

            <div class="bobia-footer">
                <form class="bobia-form" id="form-bobia">
                    <input type="text" id="input-bobia" class="bobia-input" placeholder="Pergunte ao suporte..." autocomplete="off">
                    <button type="submit" class="bobia-send-btn" id="btn-enviar-bobia" title="Enviar mensagem">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>

        <button class="bobia-launcher" id="bobia-launcher" aria-label="Abrir suporte BobIA">
            <span class="bobia-launcher-tooltip">Suporte BobIA</span>
            <img src="assets/icon/bobia.svg" alt="Suporte BobIA" class="bobia-launcher-avatar">
            <i class="fa-solid fa-xmark bobia-launcher-close-icon"></i>
            <span class="bobia-launcher-badge"></span>
        </button>
    `;

    document.body.appendChild(container);

    // Seleção de elementos
    const launcher = document.getElementById('bobia-launcher');
    const modal = document.getElementById('bobia-modal');
    const btnClose = document.getElementById('bobia-btn-close');
    const btnClear = document.getElementById('bobia-btn-clear');
    const formBobIA = document.getElementById('form-bobia');
    const inputBobIA = document.getElementById('input-bobia');
    const messagesContainer = document.getElementById('bobia-messages');
    const suggestions = document.getElementById('bobia-suggestions');

    // Alternar abertura
    function toggleChat(abrir) {
        const ativo = typeof abrir === 'boolean' ? abrir : !container.classList.contains('ativo');
        container.classList.toggle('ativo', ativo);
        if (ativo) {
            setTimeout(() => inputBobIA.focus(), 150);
            scrollMessagesToBottom();
        }
    }

    launcher.addEventListener('click', () => toggleChat());
    btnClose.addEventListener('click', () => toggleChat(false));

    // Limpar conversa
    btnClear.addEventListener('click', () => {
        messagesContainer.innerHTML = `
            <div class="bobia-message-row bobia">
                <img src="assets/icon/bobia.svg" alt="BobIA" class="bobia-msg-avatar">
                <div class="bobia-bubble">
                    <p>Conversa reiniciada. Em que posso te ajudar agora?</p>
                </div>
            </div>
        `;
    });

    // Rolagem suave até o final das mensagens
    function scrollMessagesToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Adicionar mensagem na lista
    function adicionarMensagem(texto, remetente = 'usuario') {
        const row = document.createElement('div');
        row.className = `bobia-message-row ${remetente}`;

        if (remetente === 'bobia') {
            const avatar = document.createElement('img');
            avatar.src = 'assets/icon/bobia.svg';
            avatar.alt = 'BobIA';
            avatar.className = 'bobia-msg-avatar';
            row.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.className = 'bobia-bubble';

        // Formatação simples de parágrafos e markdown bold
        const paragrafos = texto.split('\n').filter(p => p.trim() !== '');
        if (paragrafos.length > 0) {
            paragrafos.forEach(p => {
                const pEl = document.createElement('p');
                pEl.innerHTML = formatarTexto(p);
                bubble.appendChild(pEl);
            });
        } else {
            const pEl = document.createElement('p');
            pEl.innerHTML = formatarTexto(texto);
            bubble.appendChild(pEl);
        }

        row.appendChild(bubble);
        messagesContainer.appendChild(row);
        scrollMessagesToBottom();
        return row;
    }

    // Formatação leve de markdown (*texto* ou **texto**)
    function formatarTexto(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    // Indicador "Pensando..."
    let typingRow = null;
    function mostrarDigitando(mostrar) {
        if (mostrar) {
            if (!typingRow) {
                typingRow = document.createElement('div');
                typingRow.className = 'bobia-message-row bobia';
                typingRow.innerHTML = `
                    <img src="assets/icon/bobia.svg" alt="BobIA" class="bobia-msg-avatar">
                    <div class="bobia-typing-indicator ativo">
                        <span class="bobia-typing-dot"></span>
                        <span class="bobia-typing-dot"></span>
                        <span class="bobia-typing-dot"></span>
                    </div>
                `;
                messagesContainer.appendChild(typingRow);
                scrollMessagesToBottom();
            }
        } else if (typingRow) {
            typingRow.remove();
            typingRow = null;
        }
    }

    // Envio de pergunta
    async function enviarPergunta(perguntaTexto) {
        const pergunta = (perguntaTexto || inputBobIA.value || '').trim();
        if (!pergunta) return;

        adicionarMensagem(pergunta, 'usuario');
        inputBobIA.value = '';
        mostrarDigitando(true);

        try {
            let resultado;
            if (typeof window.perguntarBobIA === 'function') {
                resultado = await window.perguntarBobIA(pergunta);
            } else {
                const res = await fetch('/bobia/perguntar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pergunta })
                });
                const dados = await res.json();
                if (!res.ok) throw new Error(dados.erro || 'Erro ao consultar o BobIA.');
                resultado = dados.resultado;
            }

            mostrarDigitando(false);
            adicionarMensagem(resultado || 'Resposta recebida.', 'bobia');
        } catch (erro) {
            mostrarDigitando(false);
            adicionarMensagem(erro.message || 'Desculpe, não consegui obter essa resposta no momento.', 'bobia');
        }
    }

    formBobIA.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarPergunta();
    });

    // Chips de sugestão
    if (suggestions) {
        suggestions.addEventListener('click', (e) => {
            const chip = e.target.closest('.bobia-suggestion-chip');
            if (chip && chip.dataset.pergunta) {
                enviarPergunta(chip.dataset.pergunta);
            }
        });
    }
})();
