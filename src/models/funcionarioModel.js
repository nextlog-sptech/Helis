var database = require("../database/config");
var bcrypt = require("bcryptjs");

// Cria senha genérica
function gerarSenhaTemporaria() {
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var senha = '';

    for (var i = 0; i < 8; i++) {
        var indice = Math.floor(Math.random() * caracteres.length);
        senha += caracteres[indice];
    }

    return senha;
}

// Lista funcionários
function listar(empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - listar");

    var instrucaoSql = `
        SELECT idUsuario, nome, email, telefone, cargo
        FROM usuario
        WHERE empresaId = ${Number(empresaId)}
        ORDER BY nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

//Cadastra funcionários
async function cadastrar(funcionario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - cadastrar");

    var senhaTemporaria = gerarSenhaTemporaria();
    var senhaHash = await bcrypt.hash(senhaTemporaria, 10);

    var instrucaoSql = `
        INSERT INTO usuario (cpf, nome, email, telefone, cargo, senha, empresaId)
        VALUES (
            NULL,
            '${funcionario.nome}',
            '${funcionario.email}',
            '${funcionario.telefone}',
            '${funcionario.cargo}',
            '${senhaHash}',
            ${Number(empresaId)}
        );
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql).then(function (resultado) {
        return {
            idUsuario: resultado.insertId,
            senhaTemporaria: senhaTemporaria
        };
    });
}

// Busca um e-mail já cadastrado no sistema
function buscarEmail(email, idIgnorar) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - buscarEmail");

    var instrucaoSql = `
        SELECT idUsuario
        FROM usuario
        WHERE LOWER(email) = LOWER('${email}')
        ${idIgnorar ? `AND idUsuario <> ${Number(idIgnorar)}` : ''};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

// Busca um funcionário específico da empresa
function buscarPorId(idUsuario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - buscarPorId");

    var instrucaoSql = `
        SELECT idUsuario
        FROM usuario
        WHERE idUsuario = ${Number(idUsuario)}
        AND empresaId = ${Number(empresaId)};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

// Edita os dados de um funcionário
function editar(idUsuario, funcionario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - editar");

    var instrucaoSql = `
        UPDATE usuario
        SET
            nome = '${funcionario.nome}',
            email = '${funcionario.email}',
            telefone = '${funcionario.telefone}',
            cargo = '${funcionario.cargo}'
        WHERE idUsuario = ${Number(idUsuario)}
        AND empresaId = ${Number(empresaId)};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

// Exclui um funcionário
function excluir(idUsuario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - excluir");

    var instrucaoSql = `
        DELETE FROM usuario
        WHERE idUsuario = ${Number(idUsuario)}
        AND empresaId = ${Number(empresaId)};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    cadastrar,
    buscarEmail,
    buscarPorId,
    editar,
    excluir
};
