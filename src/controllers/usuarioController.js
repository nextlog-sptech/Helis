var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    if (resultadoAutenticar.length == 1) {
                        res.json({
                            id: resultadoAutenticar[0].idUsuario,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            empresaId: resultadoAutenticar[0].empresaId
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage || erro.message);
                    res.status(500).send(erro.sqlMessage || erro.message || "Erro no servidor MySQL");
                }
            );
    }
}

function cadastrar(req, res) {
    // Empresa
    var cnpj = req.body.cnpjServer;
    var razao = req.body.razaoServer;
    var nomeFantasia = req.body.nomeFantasiaServer;
    var emailEmpresa = req.body.emailEmpresaServer;
    var senhaEmpresa = req.body.senhaEmpresaServer;
    var telefoneEmpresa = req.body.telefoneEmpresaServer;

    // Endereço
    var cep = req.body.cepServer;
    var logradouro = req.body.logradouroServer;
    var numero = req.body.numeroServer;
    var complemento = req.body.complementoServer || "";
    var bairro = req.body.bairroServer;
    var cidade = req.body.cidadeServer;

    // Responsável
    var cpf = req.body.cpfServer;
    var nomeResponsavel = req.body.nomeResponsavelServer;
    var emailResponsavel = req.body.emailResponsavelServer;
    var telefoneResponsavel = req.body.telefoneResponsavelServer;
    var cargo = req.body.cargoServer;
    var senhaResponsavel = req.body.senhaResponsavelServer;

    var cnpjLimpo = cnpj ? cnpj.replace(/\D/g, '') : '';
    var telEmpresaLimpo = telefoneEmpresa ? telefoneEmpresa.replace(/\D/g, '') : '';
    var cepLimpo = cep ? cep.replace(/\D/g, '') : '';
    var cpfLimpo = cpf ? cpf.replace(/\D/g, '') : '';
    var telRespLimpo = telefoneResponsavel ? telefoneResponsavel.replace(/\D/g, '') : '';

    // Validações no Backend
    if (!cnpj || cnpjLimpo.length !== 14) {
        res.status(400).send("CNPJ inválido! Deve conter 14 dígitos numéricos.");
    } else if (!razao || razao.trim().length < 3) {
        res.status(400).send("Razão Social inválida! Mínimo de 3 caracteres.");
    } else if (!nomeFantasia || nomeFantasia.trim().length < 2) {
        res.status(400).send("Nome Fantasia inválido!");
    } else if (!emailEmpresa || !emailEmpresa.includes("@") || !emailEmpresa.includes(".")) {
        res.status(400).send("E-mail de empresa inválido!");
    } else if (!senhaEmpresa || senhaEmpresa.length < 6) {
        res.status(400).send("Senha da empresa deve ter no mínimo 6 caracteres!");
    } else if (!telefoneEmpresa || (telEmpresaLimpo.length !== 10 && telEmpresaLimpo.length !== 11)) {
        res.status(400).send("Telefone da empresa inválido! Insira DDD + número.");
    } else if (!cep || cepLimpo.length !== 8) {
        res.status(400).send("CEP inválido! Deve conter 8 dígitos numéricos.");
    } else if (!logradouro || logradouro.trim().length < 3) {
        res.status(400).send("Logradouro inválido!");
    } else if (!numero || numero.trim().length === 0) {
        res.status(400).send("Número do endereço é obrigatório!");
    } else if (!bairro || bairro.trim().length < 2) {
        res.status(400).send("Bairro inválido!");
    } else if (!cidade || cidade.trim().length < 2) {
        res.status(400).send("Cidade inválida!");
    } else if (!cpf || cpfLimpo.length !== 11) {
        res.status(400).send("CPF do responsável inválido! Deve conter 11 dígitos numéricos.");
    } else if (!nomeResponsavel || nomeResponsavel.trim().length < 3) {
        res.status(400).send("Nome do responsável inválido (mínimo de 3 caracteres)!");
    } else if (!emailResponsavel || !emailResponsavel.includes("@") || !emailResponsavel.includes(".")) {
        res.status(400).send("E-mail do responsável inválido!");
    } else if (!telefoneResponsavel || (telRespLimpo.length !== 10 && telRespLimpo.length !== 11)) {
        res.status(400).send("Telefone do responsável inválido! Insira DDD + número.");
    } else if (!cargo || cargo.trim().length < 2) {
        res.status(400).send("Cargo do responsável inválido!");
    } else if (!senhaResponsavel || senhaResponsavel.length < 6) {
        res.status(400).send("Senha do responsável deve ter no mínimo 6 caracteres!");
    } else {
        usuarioModel.cadastrar(
            cnpj, razao, nomeFantasia, emailEmpresa, telefoneEmpresa, senhaEmpresa,
            cep, logradouro, numero, complemento, bairro, cidade,
            cpf, nomeResponsavel, emailResponsavel, telefoneResponsavel, cargo, senhaResponsavel
        ).then(
            function (resultado) {
                res.status(201).json(resultado);
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

module.exports = {
    autenticar,
    cadastrar
};
