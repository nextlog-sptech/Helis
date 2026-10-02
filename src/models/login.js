const database = require('../database/config');

async function buscarPorIdentificador(identificador) {
  const instrucao = `
    SELECT
      u.idUsuario AS id,
      u.nome,
      u.email,
      u.senha,
      u.empresaId
    FROM usuario AS u
    LEFT JOIN empresa AS e ON e.idEmpresa = u.empresaId
    WHERE LOWER(u.email) = ? OR e.cnpj = ?
    LIMIT 1;
  `;

  const usuarios = await database.executar(instrucao, [identificador, identificador]);
  return usuarios[0] || null;
}

function atualizarSenha(idUsuario, senhaHash) {
  return database.executar(
    'UPDATE usuario SET senha = ? WHERE idUsuario = ?;',
    [senhaHash, idUsuario]
  );
}

module.exports = { buscarPorIdentificador, atualizarSenha };
