var funcionarioModel = require("../models/funcionarioModel");

var cargosPermitidos = [
    "Administrador",
    "Gestor de Logística",
    "Analista de Logística",
    "Gestor Financeiro",
    "Analista Financeiro"
];

// Lista funcionários 
function listar(req, res) {
    var empresaId = req.query.empresaId;

    if (!empresaId || empresaId <= 0) {
        res.status(400).send("ID da empresa inválido!");
    } else {
        funcionarioModel.listar(empresaId)
            .then(
                function (resultadoListar) {
                    res.json(resultadoListar);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao listar os funcionários! Erro: ", erro.sqlMessage || erro.message);
                    res.status(500).send(erro.sqlMessage || erro.message || "Erro no servidor MySQL");
                }
            );
    }
}

// Cadastra  funcionário
function cadastrar(req, res) {
    var nome = req.body.nome;
    var email = req.body.email;
    var telefone = req.body.telefone;
    var cargo = req.body.cargo;
    var empresaId = req.body.empresaId;

    var telefoneLimpo = telefone ? telefone.replace(/\D/g, '') : '';

    // Validações do Backend
    if (!nome || nome.trim().length < 3) {
        res.status(400).send("Nome inválido! Mínimo de 3 caracteres.");
    } else if (!email || !email.includes("@") || !email.includes(".")) {
        res.status(400).send("E-mail inválido!");
    } else if (!telefone || (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11)) {
        res.status(400).send("Telefone inválido! Insira DDD + número.");
    } else if (!cargo || !cargosPermitidos.includes(cargo)) {
    res.status(400).send("Selecione um cargo válido para o funcionário!");
    } else if (!empresaId || empresaId <= 0) {
        res.status(400).send("ID da empresa inválido!");
    } else {
        var funcionario = {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            telefone: telefoneLimpo,
            cargo: cargo.trim()
        };

        funcionarioModel.buscarEmail(funcionario.email)
            .then(
                function (resultadoEmail) {
                    if (resultadoEmail.length > 0) {
                        res.status(409).send("Este e-mail já está cadastrado!");
                    } else {
                        funcionarioModel.cadastrar(funcionario, empresaId)
                            .then(
                                function (resultado) {
                                    res.status(201).json({
                                        mensagem: "Funcionário cadastrado com sucesso!",
                                        idUsuario: resultado.idUsuario,
                                        senhaTemporaria: resultado.senhaTemporaria
                                    });
                                }
                            ).catch(
                                function (erro) {
                                    console.log(erro);
                                    var mensagemErro = erro.sqlMessage || erro.message || "Erro interno no servidor de banco de dados.";
                                    console.log("\nHouve um erro ao realizar o cadastro! Erro: ", mensagemErro);
                                    res.status(500).send(mensagemErro);
                                }
                            );
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao verificar o e-mail! Erro: ", erro.sqlMessage || erro.message);
                    res.status(500).send(erro.sqlMessage || erro.message || "Erro no servidor MySQL");
                }
            );
    }
}

// Edita dados do funcionário
function editar(req, res) {
    var idUsuario = req.params.id;
    var nome = req.body.nome;
    var email = req.body.email;
    var telefone = req.body.telefone;
    var cargo = req.body.cargo;
    var empresaId = req.body.empresaId;

    var telefoneLimpo = telefone ? telefone.replace(/\D/g, '') : '';

    // Validações no Backend
    if (!idUsuario || isNaN(idUsuario) || Number(idUsuario) <= 0) {
        res.status(400).send("ID do funcionário inválido!");
    } else if (!nome || nome.trim().length < 3) {
        res.status(400).send("Nome inválido! Mínimo de 3 caracteres.");
    } else if (!email || !email.includes("@") || !email.includes(".")) {
        res.status(400).send("E-mail inválido!");
    } else if (!telefone || (telefoneLimpo.length !== 10 && telefoneLimpo.length !== 11)) {
        res.status(400).send("Telefone inválido! Insira DDD + número.");
    } else if (!cargo || cargo.trim().length < 2) {
        res.status(400).send("Cargo inválido!");
    } else if (!empresaId || isNaN(empresaId) || Number(empresaId) <= 0) {
        res.status(400).send("ID da empresa inválido!");
    } else {
        var funcionario = {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            telefone: telefoneLimpo,
            cargo: cargo.trim()
        };

        funcionarioModel.buscarEmail(funcionario.email, idUsuario)
            .then(
                function (resultadoEmail) {
                    if (resultadoEmail.length > 0) {
                        res.status(409).send("Este e-mail já está cadastrado!");
                    } else {
                        funcionarioModel.buscarPorId(idUsuario, empresaId)
                            .then(
                                function (resultadoFuncionario) {
                                    if (resultadoFuncionario.length == 0) {
                                        res.status(404).send("Funcionário não encontrado!");
                                    } else {
                                        funcionarioModel.editar(idUsuario, funcionario, empresaId)
                                            .then(
                                                function () {
                                                    res.status(200).json({
                                                        mensagem: "Funcionário atualizado com sucesso!"
                                                    });
                                                }
                                            ).catch(
                                                function (erro) {
                                                    console.log(erro);
                                                    console.log("\nHouve um erro ao editar o funcionário! Erro: ", erro.sqlMessage || erro.message);
                                                    res.status(500).send(erro.sqlMessage || erro.message || "Erro no servidor MySQL");
                                                }
                                            );
                                    }
                                }
                            ).catch(
                                function (erro) {
                                    console.log(erro);
                                    console.log("\nHouve um erro ao buscar o funcionário! Erro: ", erro.sqlMessage || erro.message);
                                    res.status(500).send(erro.sqlMessage || erro.message || "Erro no servidor MySQL");
                                }
                            );
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao verificar o e-mail! Erro: ", erro.sqlMessage || erro.message);
                    res.status(500).send(erro.sqlMessage || erro.message || "Erro no servidor MySQL");
                }
            );
    }
}

// Exclui funcionário
function excluir(req, res) {
    var idUsuario = req.params.id;
    var empresaId = req.query.empresaId;

    if (!idUsuario || isNaN(idUsuario) || Number(idUsuario) <= 0) {
        res.status(400).send("ID do funcionário inválido!");
    } else if (!empresaId || isNaN(empresaId) || Number(empresaId) <= 0) {
        res.status(400).send("ID da empresa inválido!");
    } else {
        funcionarioModel.excluir(idUsuario, empresaId)
            .then(
                function (resultadoExcluir) {
                    if (resultadoExcluir.affectedRows == 0) {
                        res.status(404).send("Funcionário não encontrado!");
                    } else {
                        res.status(200).json({
                            mensagem: "Funcionário excluído com sucesso!"
                        });
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    var mensagemErro = erro.sqlMessage || erro.message || "Erro interno no servidor de banco de dados.";
                    console.log("\nHouve um erro ao excluir o funcionário! Erro: ", mensagemErro);
                    res.status(500).send(mensagemErro);
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
