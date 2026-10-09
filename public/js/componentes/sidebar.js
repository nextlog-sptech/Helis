setarTema(false)
sidebar.innerHTML = `
 <a class="logo" href="dashboard.html"><img src="assets/icon/logo.svg" alt=""></a>
            <div class="links">
                <a href="dashboard.html" id="linkDash" class="link">
                    <i class="fa-solid fa-house"></i> Dasboard
                </a>
                <a href="fretes.html" id="linkFrete" class="link">
                    <i class="fa-solid fa-box"></i> Fretes
                </a>
                <a href="veiculos.html" id="linkVeiculo" class="link">
                    <i class="fa-solid fa-truck"></i> Veículos
                </a>
                <a href="motoristas.html"  id="linkMoto"class="link">
                    <i class="fa-solid fa-user"></i> Motoristas
                </a>
                <a href="financas.html" id="linkFinancas" class="link">
                    <i class="fa-solid fa-wallet"></i> Finanças
                </a>
            </div>
`;

userNav.innerHTML = `
 <button onclick="setarTema(true)" href="" class="userButton temaButton"> <i class="fa-regular   fa-sun"></i></button>
<a href="" class="userButton"><img src="https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51405259-stock-illustration-male-avatar-profile-picture-use.jpg" alt=""></a>
                    <a href="" class="buttonSair">Sair</a>`;

const paginaAtual = window.location.pathname.split("/").pop();

// Todos os links
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
