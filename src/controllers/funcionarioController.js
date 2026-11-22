var funcionarioModel = require("../models/funcionarioModel");

var cargosPermitidos = [
    "Analista de Logística",
    "Analista Financeiro"
];

function enviarErro(res, status, mensagem) {
    return res.status(status).json({
        erro: mensagem
    });
}


function empresaValida(empresaId) {
    return empresaId !== undefined &&
        empresaId !== null &&
        String(empresaId).trim() !== "" &&
        Number.isInteger(Number(empresaId)) &&
        Number(empresaId) > 0;
}

async function listar(req, res) {
    var empresaId = req.query.empresaId;

   if (!empresaValida(empresaId)) {
        return enviarErro(res, 400, "ID da empresa inválido!");
    }

    try {
        var resultadoListar = await funcionarioModel.listar(Number(empresaId));

        return res.status(200).json(resultadoListar);

    } catch (erro) {
        console.log("Erro ao listar funcionários:", erro);

        return enviarErro(
            res,
            500,
            "Erro ao buscar funcionários no banco de dados."
        );
    }
}


async function cadastrar(req, res) {
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;
    var cpf = req.body.cpf;
    var telefone = req.body.telefone;
    var cargo = req.body.cargo;
    var empresaId = req.body.empresaId;
    var isAdmin = req.body.isAdmin;

    var telefoneLimpo = typeof telefone === "string" ? telefone.replace(/\D/g, '') : '';


    if (!nome || nome.trim().length < 3) {
        return enviarErro(res, 400, "Nome inválido! Mínimo de 3 caracteres.");
    } else if (!email || !email.includes("@") || !email.includes(".")) {
        return enviarErro(res, 400, "E-mail inválido!");
    } else if (!senha || typeof senha !== "string" || senha.length < 8) {
    return enviarErro(res, 400, "A senha deve possuir pelo menos 8 caracteres.");
    }else if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
    return enviarErro(res, 400, "CPF inválido!");
    } else if (!telefone || (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11)) {
        return enviarErro(res, 400, "Telefone inválido! Insira DDD + número.");
    } else if (!cargo || !cargosPermitidos.includes(cargo.trim())) {
        return enviarErro(res, 400, "Selecione um cargo válido para o funcionário!");
    } else if (!empresaValida(empresaId)) {
        return enviarErro(res, 400, "ID da empresa inválido!");
    } else {
        var funcionario = {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            cpf: cpf.trim(),
            telefone: telefoneLimpo,
            cargo: cargo.trim(),
            isAdmin: isAdmin === true,
            senha: senha
        };

        funcionarioModel.buscarEmail(funcionario.email)
            .then(
                function (resultadoEmail) {
                    if (resultadoEmail.length > 0) {
                         return enviarErro(res, 400, "Este e-mail já está cadastrado!");
                    } else {
                        funcionarioModel.cadastrar(funcionario, empresaId)
                            .then(
                                function (resultado) {
                                    return res.status(201).json({
                                mensagem: "Funcionário cadastrado com sucesso!",
                                idUsuario: resultado.idUsuario
                                });
                                }
                            ).catch(
                                function (erro) {
                                    console.log(erro);
                                    var mensagemErro = erro.sqlMessage || erro.message || "Erro interno no servidor de banco de dados.";
                                    console.log("\nHouve um erro ao realizar o cadastro! Erro: ", mensagemErro);
                                    return enviarErro(res, 500, "Erro interno ao realizar a operação no banco de dados.");
                                }
                            );
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao verificar o e-mail! Erro: ", erro.sqlMessage || erro.message);
                    return enviarErro(res, 500, "Erro no servidor MySQL");
                }
            );
    }
}

async function editar(req, res) {
    var cpf = req.body.cpf;
    var idUsuario = req.params.id;
    var nome = req.body.nome;
    var email = req.body.email;
    var telefone = req.body.telefone;
    var cargo = req.body.cargo;
    var empresaId = req.body.empresaId;
    var isAdmin = req.body.isAdmin;

    var telefoneLimpo = typeof telefone === "string" ? telefone.replace(/\D/g, '') : '';

  
    if (!idUsuario || isNaN(idUsuario) || Number(idUsuario) <= 0) {
         return enviarErro(res, 400, "ID do funcionário inválido!");
    } else if (!nome || nome.trim().length < 3) {
        return enviarErro(res, 400, "Nome inválido! Mínimo de 3 caracteres.");
    } else if (!email || !email.includes("@") || !email.includes(".")) {
         return enviarErro(res, 400, "E-mail inválido!");
    } else if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
    return enviarErro(res, 400, "CPF inválido!");
    }else if (!telefone || (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11)) {
        return enviarErro(res, 400, "Telefone inválido! Insira DDD + número.");
    } else if (!cargo || !cargosPermitidos.includes(cargo.trim())) {
        return enviarErro(res, 400, "Cargo inválido!.");
    } else if (!empresaValida(empresaId)){
        return enviarErro(res, 400, "ID da empresa inválido!");
    } else {
        var funcionario = {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            cpf: cpf.trim(),
            telefone: telefoneLimpo,
            cargo: cargo.trim(),
            isAdmin: isAdmin === true
        };

        funcionarioModel.buscarEmail(funcionario.email, idUsuario)
            .then(
                function (resultadoEmail) {
                    if (resultadoEmail.length > 0) {
                       return enviarErro(res, 409, "Este e-mail já está cadastrado!");
                    } else {
                        funcionarioModel.buscarPorId(idUsuario, empresaId)
                            .then(
                                function (resultadoFuncionario) {
                                    if (resultadoFuncionario.length == 0) {
                                        return enviarErro(res, 404, "Funcionário não encontrado!");
                                    } else {
                                        funcionarioModel.editar(idUsuario, funcionario, empresaId)
                                            .then(
                                                function () {
                                                    return res.status(200).json({
                                                    mensagem: "Funcionário atualizado com sucesso!"
                                                    });
            
                                                }
                                            ).catch(
                                                function (erro) {
                                                    console.log(erro);
                                                    console.log("\nHouve um erro ao editar o funcionário! Erro: ", erro.sqlMessage || erro.message);
                                                    return enviarErro(res, 500, "Erro no servidor MySQL");
                                                
                                                }
                                            );
                                    }
                                }
                            ).catch(
                                function (erro) {
                                    console.log(erro);
                                    console.log("\nHouve um erro ao buscar o funcionário! Erro: ", erro.sqlMessage || erro.message);
                                    return enviarErro(res, 500, "Erro ao realizar a operação no banco de dados.");
                                }
                            );
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao verificar o e-mail! Erro: ", erro.sqlMessage || erro.message);
                    return enviarErro(res, 500, "Erro no servidor MySQL");
                }
            );
    }
}


async function excluir(req, res) {
    var idUsuario = req.params.id;
    var empresaId = req.query.empresaId;

    if (!idUsuario || isNaN(idUsuario) || Number(idUsuario) <= 0) {
        return enviarErro(res, 400, "ID do funcionário inválido!");
    } else if (!empresaValida(empresaId)) {
        return enviarErro(res, 400, "ID da empresa inválido!");
    } else {
        funcionarioModel.excluir(idUsuario, empresaId)
            .then(
                function (resultadoExcluir) {
                    if (resultadoExcluir.affectedRows == 0) {
                        return enviarErro(res, 404, "Funcionário não encontrado!");
                    } else {
                        return res.status(200).json({
                        mensagem: "Funcionário excluído com sucesso!"
                        });
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    var mensagemErro = erro.sqlMessage || erro.message || "Erro interno no servidor de banco de dados.";
                    console.log("\nHouve um erro ao excluir o funcionário! Erro: ", mensagemErro);
                    return enviarErro(res, 500, "Erro ao excluir funcionário no banco de dados.");
                }
            );
    }
}

module.exports = {
    listar,
    cadastrar,
    editar,
    excluir
};
