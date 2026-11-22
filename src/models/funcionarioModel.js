var database = require("../database/config");
var bcrypt = require("bcryptjs");


function listar(empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - listar");

    var instrucaoSql = `
        SELECT idUsuario, cpf, nome, email, telefone, cargo, isAdmin
        FROM usuario
        WHERE empresaId = ?
        ORDER BY nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql, [Number(empresaId)]);
}

async function cadastrar(funcionario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - cadastrar");

    var senhaHash = await bcrypt.hash(funcionario.senha, 10);

    var instrucaoSql = `
        INSERT INTO usuario (cpf, nome, email, telefone, cargo, isAdmin, senha, empresaId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    var parametros = [
        funcionario.cpf,
        funcionario.nome,
        funcionario.email,
        funcionario.telefone,
        funcionario.cargo,
        funcionario.isAdmin ? 1 : 0,
        senhaHash,
        Number(empresaId),
        
    ];

    return database.executar(instrucaoSql, parametros).then(function (resultado) {
        return {
            idUsuario: resultado.insertId
        };
    });
}

function buscarEmail(email, idIgnorar) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - buscarEmail");

    var instrucaoSql = `
        SELECT idUsuario
        FROM usuario
        WHERE LOWER(email) = LOWER(?)
        ${idIgnorar ? `AND idUsuario <> ?` : ''};
    `;

    var parametros = idIgnorar
        ? [email, Number(idIgnorar)]
        : [email];

    return database.executar(instrucaoSql, parametros);
}

function buscarPorId(idUsuario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - buscarPorId");

    var instrucaoSql = `
        SELECT idUsuario
        FROM usuario
        WHERE idUsuario = ?
        AND empresaId = ?;
    `;

    return database.executar(instrucaoSql, [
        Number(idUsuario),
        Number(empresaId)
    ]);
}

function editar(idUsuario, funcionario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - editar");

    var instrucaoSql = `
        UPDATE usuario
        SET
            cpf = ?,
            nome = ?,
            email = ?,
            telefone = ?,
            cargo = ?,
            isAdmin = ?
        WHERE idUsuario = ?
        AND empresaId = ?;
    `;
     var parametros = [
        funcionario.cpf,
        funcionario.nome,
        funcionario.email,
        funcionario.telefone,
        funcionario.cargo,
        funcionario.isAdmin ? 1 : 0,
        Number(idUsuario),
        Number(empresaId)
    ];

    return database.executar(instrucaoSql, parametros);
}

function excluir(idUsuario, empresaId) {
    console.log("ACESSEI O FUNCIONARIOS MODEL - excluir");

    var instrucaoSql = `
        DELETE FROM usuario
        WHERE idUsuario = ?
        AND empresaId = ?;
    `;


    return database.executar(instrucaoSql, [
        Number(idUsuario),
        Number(empresaId)
    ]);
}

module.exports = {
    listar,
    cadastrar,
    buscarEmail,
    buscarPorId,
    editar,
    excluir
};
