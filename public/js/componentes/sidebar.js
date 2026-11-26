setarTema(false)
document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-config-fundo" id="modalConfig" onclick="fecharModalConfig()">
        <div class="modal-config" onclick="event.stopPropagation()">
            <button type="button" class="modal-config-fechar" onclick="fecharModalConfig()">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <h2 class="modal-config-titulo">Configurações</h2>

            <div class="modal-config-linha">
                <span class="modal-config-texto">Modo escuro</span>
                <label class="modal-config-toggle">
                    <input type="checkbox" onchange="setarTema(true)" ${localStorage.TEMA === "escuro"?'checked':''}>
                    <span class="modal-config-slider"></span>
                </label>
            </div>

            <div class="modal-config-linha">
                <span class="modal-config-texto">Notificações</span>
                <label class="modal-config-toggle">
                    <input type="checkbox" onchange="alternarNotificacoes(this)">
                    <span class="modal-config-slider"></span>
                </label>
            </div>

            <p class="modal-config-subtitulo">Notificar quando:</p>

            <div class="modal-config-subs bloqueado" id="modalConfigSubs">
                <div class="modal-config-linha">
                    <span class="modal-config-texto">Iniciar leitura</span>
                    <label class="modal-config-toggle">
                        <input type="checkbox" disabled onchange="avisar(this, 'Iniciar leitura')">
                        <span class="modal-config-slider"></span>
                    </label>
                </div>
                <div class="modal-config-linha">
                    <span class="modal-config-texto">Finalizar leitura</span>
                    <label class="modal-config-toggle">
                        <input type="checkbox" disabled onchange="avisar(this, 'Finalizar leitura')">
                        <span class="modal-config-slider"></span>
                    </label>
                </div>
                <div class="modal-config-linha">
                    <span class="modal-config-texto">Falha na leitura</span>
                    <label class="modal-config-toggle">
                        <input type="checkbox" disabled onchange="avisar(this, 'Falha na leitura')">
                        <span class="modal-config-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
`);

function abrirModalConfig() {
    document.getElementById("modalConfig").classList.add("aberto");
}

function fecharModalConfig() {
    document.getElementById("modalConfig").classList.remove("aberto");
}

function avisar(input, nome) {
   
}

function alternarNotificacoes(input) {
    alert("Notificações " + (input.checked ? "ativadas" : "desativadas"));

    const subs = document.getElementById("modalConfigSubs");
    subs.classList.toggle("bloqueado", !input.checked);
    subs.querySelectorAll("input").forEach(function (sub) {
        sub.disabled = !input.checked;
    });
}

sidebar.innerHTML = `
 <a class="logo" href="dashboard.html"><img src="assets/icon/logo.png" alt=""></a>
            <div class="links">
                <a href="dashboard.html" id="linkDash" class="link">
                    <i class="fa-solid fa-house"></i> Dashboard
                </a>
                <a href="fretes.html" id="linkFrete" class="link">
                    <i class="fa-solid fa-box"></i> Fretes
                </a>
                <a href="veiculos.html" id="linkVeiculo" class="link">
                    <i class="fa-solid fa-truck"></i> Veículos
                </a>
                   <a href="comercial.html" id="linkFinancas" class="link">
                    <i class="fa-solid fa-wallet"></i> Comercial
                </a>
                <a href="funcionarios.html"  id="linkMoto"class="link">
                    <i class="fa-solid fa-user"></i> Funcionários
                </a>
             
            </div>
`;

userNav.innerHTML = `
 <button onclick="abrirModalConfig()" href="" class="userButton temaButton"> <i class="fa-solid   fa-gear"></i></button>

                    <a href="" class="buttonSair" onclick="sessionStorage.clear()">Sair</a>`;

const paginaAtual = window.location.pathname.split("/").pop();


const links = sidebar.querySelectorAll(".link");

links.forEach((link) => {
  const paginaLink = link.getAttribute("href");

  if (paginaAtual === paginaLink) {
    link.classList.add("ativo");
  }
});
function setarTema(button) {
    if (button) {
        const style = document.createElement("style");
        style.id = "transicaoTema";
        style.textContent = `* {
            transition: background-color 0.4s, color 0.4s, border-color 0.4s;
        }`;

        document.head.appendChild(style);

        localStorage.TEMA = localStorage.TEMA === "escuro" ? "claro" : "escuro";
    }

    if (localStorage.TEMA === "escuro") {
        document.documentElement.style.setProperty("--azul", "#3B9DFF");
        document.documentElement.style.setProperty("--azulEscuro", "#006FCA");
        document.documentElement.style.setProperty("--laranja", "#FF7800");
        document.documentElement.style.setProperty("--fundo", "#121212");
        document.documentElement.style.setProperty("--branco", "#1E1E1E");
        document.documentElement.style.setProperty("--cinza", "#A0A0A0");
        document.documentElement.style.setProperty("--cinza2", "#3A3F4B");
        document.documentElement.style.setProperty("--texto", "#F5F5F5");
    } else {
        document.documentElement.style.setProperty("--azul", "#006FCA");
        document.documentElement.style.setProperty("--azulEscuro", "#004D8D");
        document.documentElement.style.setProperty("--laranja", "#FF7800");
        document.documentElement.style.setProperty("--fundo", "#ededf3");
        document.documentElement.style.setProperty("--branco", "#FFFFFF");
        document.documentElement.style.setProperty("--cinza", "#9C9C9C");
        document.documentElement.style.setProperty("--cinza2", "#CAD1DF");
        document.documentElement.style.setProperty("--texto", "#222222");
    }

    if (button) {
        setTimeout(() => {
            document.getElementById("transicaoTema")?.remove();
        }, 400);
    }
}

// Carrega automaticamente o componente flutuante do BobIA nas telas com sidebar
if (!document.getElementById("script-bobia-component")) {
    const scriptBobia = document.createElement("script");
    scriptBobia.id = "script-bobia-component";
    scriptBobia.src = "js/componentes/bobia.js";
    document.body.appendChild(scriptBobia);
}


