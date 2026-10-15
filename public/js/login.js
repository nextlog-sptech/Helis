const inputSenha = document.getElementById('ipt_password');
const toggleSenha = document.getElementById('toggle-senha');
const inputUsuario = document.getElementById('ipt_user');
const botaoEntrar = document.getElementById('botao_entrar');
const formularioLogin = document.getElementById('form_login');

function mostrarMensagem(mensagem, tipo) {
  const elementoMensagem = document.getElementById('mensagem_login');
  if (!elementoMensagem) {
    return;
  }

  elementoMensagem.className = 'mensagem-login' + (tipo ? ` ${tipo}` : '');
  elementoMensagem.textContent = mensagem;
}

if (toggleSenha && inputSenha) {
  toggleSenha.addEventListener('click', () => {
    const mostrandoSenha = inputSenha.type === 'text';
    inputSenha.type = mostrandoSenha ? 'password' : 'text';

    toggleSenha.classList.toggle('fa-eye', !mostrandoSenha);
    toggleSenha.classList.toggle('fa-eye-slash', mostrandoSenha);
    toggleSenha.setAttribute('aria-label', mostrandoSenha ? 'Mostrar senha' : 'Ocultar senha');
    toggleSenha.setAttribute('aria-pressed', String(!mostrandoSenha));
  });
}

async function realizarLogin() {
  if (!botaoEntrar || botaoEntrar.disabled || !inputUsuario || !inputSenha) {
    return;
  }

  const identificador = inputUsuario.value.trim();
  const senha = inputSenha.value;

  if (!identificador || !senha) {
    const mensagem = 'Informe seu e-mail ou CNPJ e a senha.';
    mostrarMensagem(mensagem);
    alert(mensagem);
    return;
  }

  botaoEntrar.disabled = true;
  mostrarMensagem('');

  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identificador, senha })
    });
    const resultado = await resposta.json();

    if (!resposta.ok) {
      const mensagemErro = resultado.mensagem || 'Não foi possível realizar o login.';
      mostrarMensagem(mensagemErro);
      alert(mensagemErro);
      return;
    }

    if (typeof salvarSessao === 'function') {
      salvarSessao(resultado.usuario);
    }

    mostrarMensagem('Login realizado com sucesso!', 'sucesso');
    alert(resultado.mensagem || 'Login realizado com sucesso.');
    window.location.replace('dashboard.html');
  } catch (erro) {
    console.error('Erro na requisição de login:', erro);
    const mensagemErro = 'Não foi possível conectar ao servidor.';
    mostrarMensagem(mensagemErro);
    alert(mensagemErro);
  } finally {
    botaoEntrar.disabled = false;
  }
}

if (botaoEntrar) {
  botaoEntrar.addEventListener('click', (event) => {
    event.preventDefault();
    realizarLogin();
  });
}

if (inputUsuario && inputSenha) {
  [inputUsuario, inputSenha].forEach((campo) => {
    campo.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        realizarLogin();
      }
    });
  });
}

if (formularioLogin) {
  formularioLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    realizarLogin();
  });
}