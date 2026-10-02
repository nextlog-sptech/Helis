const inputSenha = document.getElementById('ipt_password');
const toggleSenha = document.getElementById('toggle-senha');
const inputUsuario = document.getElementById('ipt_user');
const botaoEntrar = document.getElementById('botao_entrar');

toggleSenha?.addEventListener('click', () => {
  const mostrandoSenha = inputSenha.type === 'password';
  inputSenha.type = mostrandoSenha ? 'text' : 'password';
  toggleSenha.classList.toggle('fa-eye', mostrandoSenha);
  toggleSenha.classList.toggle('fa-eye-slash', !mostrandoSenha);
});

async function realizarLogin() {
  const identificador = inputUsuario.value.trim();
  const senha = inputSenha.value;

  if (!identificador || !senha) {
    alert('Informe seu e-mail ou CNPJ e a senha.');
    return;
  }

  botaoEntrar.disabled = true;

  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identificador, senha })
    });
    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.mensagem || 'Não foi possível realizar o login.');
      return;
    }

    alert(resultado.mensagem);
  } catch (erro) {
    console.error('Erro na requisição de login:', erro);
    alert('Não foi possível conectar ao servidor.');
  } finally {
    botaoEntrar.disabled = false;
  }
}

botaoEntrar?.addEventListener('click', (event) => {
  event.preventDefault();
  realizarLogin();
});

[inputUsuario, inputSenha].forEach((campo) => {
  campo?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') realizarLogin();
  });
});