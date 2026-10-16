var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL - autenticar: ", email);
    var instrucaoSql = `
        SELECT idUsuario, nome, email, empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(
    cnpj, razao, nomeFantasia, emailEmpresa, telefoneEmpresa, senhaEmpresa,
    cep, logradouro, numero, complemento, bairro, cidade,
    cpf, nomeResponsavel, emailResponsavel, telefoneResponsavel, cargo, senhaResponsavel
) {
    console.log("ACESSEI O USUARIO MODEL - cadastrar");

    // Limpar pontuações para respeitar os tamanhos CHAR(8), CHAR(14), CHAR(11) do MySQL (projetopi.sql)
    var cnpjLimpo = cnpj ? cnpj.replace(/\D/g, '') : '';
    var cpfLimpo = cpf ? cpf.replace(/\D/g, '') : '';
    var cepLimpo = cep ? cep.replace(/\D/g, '') : '';
    var telEmpresaLimpo = telefoneEmpresa ? telefoneEmpresa.replace(/\D/g, '') : '';
    var telRespLimpo = telefoneResponsavel ? telefoneResponsavel.replace(/\D/g, '') : '';

    var instrucaoEndereco = `
        INSERT INTO endereco (cep, numero, logradouro, complemento, bairro, cidade) 
        VALUES ('${cepLimpo}', '${numero}', '${logradouro}', '${complemento}', '${bairro}', '${cidade}');
    `;

    console.log("Executando a instrução SQL (Endereço): \n" + instrucaoEndereco);

    return database.executar(instrucaoEndereco).then(function (resultadoEndereco) {
        var idEndereco = resultadoEndereco.insertId;
        var instrucaoEmpresa = `
            INSERT INTO empresa (razao, cnpj, nomeFant, email, telefone, enderecoId) 
            VALUES ('${razao}', '${cnpjLimpo}', '${nomeFantasia}', '${emailEmpresa}', '${telEmpresaLimpo}', ${idEndereco});
        `;
        console.log("Executando a instrução SQL (Empresa): \n" + instrucaoEmpresa);
        return database.executar(instrucaoEmpresa);
    }).then(function (resultadoEmpresa) {
        var idEmpresa = resultadoEmpresa.insertId;
        var instrucaoUsuario = `
            INSERT INTO usuario (cpf, nome, email, telefone, cargo, senha, empresaId) 
            VALUES ('${cpfLimpo}', '${nomeResponsavel}', '${emailResponsavel}', '${telRespLimpo}', '${cargo}', '${senhaResponsavel}', ${idEmpresa});
        `;
        console.log("Executando a instrução SQL (Usuário Responsável): \n" + instrucaoUsuario);
        return database.executar(instrucaoUsuario);
    });
}

module.exports = {
    autenticar,
    cadastrar
};
