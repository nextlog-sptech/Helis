const inputSenha = document.getElementById('ipt_password');
const toggleSenha = document.getElementById('toggle-senha');
const inputUsuario = document.getElementById('ipt_user');
const botaoEntrar = document.getElementById('botao_entrar');
const formularioLogin = document.getElementById('form_login');

function limparErroCampo(campo) {
  const elementoMensagem = document.getElementById(`mensagem-${campo.id}`);
  if (elementoMensagem) {
    elementoMensagem.textContent = '';
    elementoMensagem.classList.add('hidden');
  }

  campo.removeAttribute('aria-invalid');
}

function mostrarErroCampo(campo, mensagem) {
  const elementoMensagem = document.getElementById(`mensagem-${campo.id}`);
  if (!elementoMensagem) {
    return;
  }

  elementoMensagem.textContent = mensagem;
  elementoMensagem.classList.remove('hidden');
  campo.setAttribute('aria-invalid', 'true');
}

function limparErrosLogin() {
  if (inputUsuario) {
    limparErroCampo(inputUsuario);
  }

  if (inputSenha) {
    limparErroCampo(inputSenha);
  }
}

function mostrarErroCredenciais(mensagem) {
  if (inputSenha) {
    mostrarErroCampo(inputSenha, mensagem);
  }
}

function cnpjValido(cnpj) {
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  const calcularDigito = (base, pesos) => {
    const soma = base.split('').reduce((total, digito, indice) => {
      return total + Number(digito) * pesos[indice];
    }, 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundoDigito = calcularDigito(cnpj.slice(0, 12) + primeiroDigito, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return cnpj.endsWith(`${primeiroDigito}${segundoDigito}`);
}

function identificadorValido(identificador) {
  if (identificador.includes('@')) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);
  }

  if (!/^[\d./\-\s]+$/.test(identificador)) {
    return false;
  }

  return cnpjValido(identificador.replace(/\D/g, ''));
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
  const identificadorInvalido = Boolean(identificador) && !identificadorValido(identificador);

  if (!identificador || !senha || identificadorInvalido) {
    limparErrosLogin();
    if (!identificador) {
      mostrarErroCampo(inputUsuario, 'Informe seu e-mail ou CNPJ.');
    } else if (identificadorInvalido) {
      mostrarErroCampo(inputUsuario, 'Informe um e-mail válido ou um CNPJ válido.');
    }
    if (!senha) {
      mostrarErroCampo(inputSenha, 'Informe sua senha.');
    }
    (identificador && !identificadorInvalido ? inputSenha : inputUsuario).focus();
    return;
  }

  botaoEntrar.disabled = true;
  limparErrosLogin();

  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identificador, senha })
    });
    const resultado = await resposta.json();
    if (!resposta.ok) {
      const mensagemErro = resultado.mensagem || 'Não foi possível realizar o login.';
      mostrarErroCredenciais(mensagemErro);
      return;
    }

    if (typeof salvarSessao === 'function') {
      salvarSessao(resultado.usuario);
    }

    window.location.replace('dashboard.html');
  } catch (erro) {
    console.error('Erro na requisição de login:', erro);
    mostrarErroCredenciais('Não foi possível conectar ao servidor.');
  } finally {
    botaoEntrar.disabled = false;
  }
}

if (inputUsuario) {
  inputUsuario.addEventListener('input', () => {
    limparErroCampo(inputUsuario);
    if (inputSenha) {
      limparErroCampo(inputSenha);
    }
  });
}

if (inputSenha) {
  inputSenha.addEventListener('input', () => {
    limparErroCampo(inputSenha);
    if (inputUsuario) {
      limparErroCampo(inputUsuario);
    }
  });
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