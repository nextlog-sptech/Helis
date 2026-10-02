const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const loginModel = require('../models/login');

function compararTextoLegado(senhaInformada, senhaSalva) {
  const informada = Buffer.from(senhaInformada, 'utf8');
  const salva = Buffer.from(senhaSalva, 'utf8');

  return informada.length === salva.length && crypto.timingSafeEqual(informada, salva);
}

async function login(req, res) {
  const identificadorRecebido = String(req.body?.identificador || '').trim();
  const senha = String(req.body?.senha || '');

  if (!identificadorRecebido || !senha) {
    return res.status(400).json({ mensagem: 'Informe o e-mail ou CNPJ e a senha.' });
  }

  const identificador = identificadorRecebido.includes('@')
    ? identificadorRecebido.toLowerCase()
    : identificadorRecebido.replace(/\D/g, '');

  try {
    const usuario = await loginModel.buscarPorIdentificador(identificador);

    if (!usuario) {
      return res.status(401).json({ mensagem: 'E-mail/CNPJ ou senha inválidos.' });
    }

    const senhaJaTemHash = /^\$2[aby]\$\d{2}\$/.test(usuario.senha || '');
    const senhaValida = senhaJaTemHash
      ? await bcrypt.compare(senha, usuario.senha)
      : compararTextoLegado(senha, String(usuario.senha || ''));

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'E-mail/CNPJ ou senha inválidos.' });
    }

    // Converte credenciais legadas em hash no primeiro login bem-sucedido.
    if (!senhaJaTemHash) {
      const senhaHash = await bcrypt.hash(senha, 10);
      await loginModel.atualizarSenha(usuario.id, senhaHash);
    }

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        empresaId: usuario.empresaId
      }
    });
  } catch (erro) {
    console.error('Erro ao realizar login:', erro);
    return res.status(500).json({ mensagem: 'Erro interno ao realizar login.' });
  }
}

module.exports = { login };
