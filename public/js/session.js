function salvarSessao(usuario) {
    sessionStorage.ID_USUARIO = usuario.id;
    sessionStorage.NOME_USUARIO = usuario.nome;
    sessionStorage.EMAIL_USUARIO = usuario.email;
    sessionStorage.EMPRESA_ID = usuario.empresaId;
}

function validarSessao() {
    if (!sessionStorage.ID_USUARIO) {
        window.location.replace('login.html');
        return;
    }

    var nomeUsuario = document.getElementById('nome_usuario');
    var boasVindas = document.getElementById('boas_vindas');
    if (nomeUsuario) {
        nomeUsuario.textContent = sessionStorage.NOME_USUARIO;
    }
    if (boasVindas) {
        boasVindas.textContent = 'Bem-vindo, ' + sessionStorage.NOME_USUARIO;
    }
}

function limparSessao() {
    sessionStorage.removeItem('ID_USUARIO');
    sessionStorage.removeItem('NOME_USUARIO');
    sessionStorage.removeItem('EMAIL_USUARIO');
    sessionStorage.removeItem('EMPRESA_ID');
    window.location.replace('login.html');
}

// O sidebar está presente nas páginas internas do projeto.
if (document.getElementById('sidebar')) {
    validarSessao();
    // Valida também quando a página volta pelo botão Voltar do navegador.
    window.addEventListener('pageshow', validarSessao);
}
var paginaLogin = !!document.getElementById('form_login') || !!document.getElementById('ipt_user');

if (paginaLogin && sessionStorage.ID_USUARIO) {
    window.location.replace('dashboard.html');
}
