function obterMensagemAtual() {
    var infos = document.getElementById("conteudo-informacoes");
    var endereco = document.getElementById("conteudo-endereco");
    var responsavel = document.getElementById("conteudo-responsavel");

    if (infos && infos.style.display !== "none") {
        return document.getElementById("mensagem-validacao-empresa");
    }

    if (endereco && endereco.style.display !== "none") {
        return document.getElementById("mensagem-validacao-endereco");
    }

    if (responsavel && responsavel.style.display !== "none") {
        return document.getElementById("mensagem-validacao-responsavel");
    }

    return document.getElementById("mensagem-validacao-empresa");
}

function mostrarMensagem(texto, tipo) {
    var elemento = obterMensagemAtual();
    if (!elemento) {
        return;
    }

    if (!texto) {
        elemento.textContent = "";
        elemento.classList.add("hidden");
        elemento.classList.remove("erro", "sucesso");
        return;
    }

    elemento.textContent = texto;
    elemento.classList.remove("hidden");
    elemento.classList.remove("erro", "sucesso");
    elemento.classList.add(tipo === "sucesso" ? "sucesso" : "erro");
}

function barras(etapa) {
    var barra1 = document.getElementById("barra1");
    var barra2 = document.getElementById("barra2");
    var barra3 = document.getElementById("barra3");

    var etapa1 = document.getElementById("etapa1");
    var etapa2 = document.getElementById("etapa2");
    var etapa3 = document.getElementById("etapa3");

    barra1.className = "barra";
    barra2.className = "barra";
    barra3.className = "barra";

    etapa1.className = "";
    etapa2.className = "";
    etapa3.className = "";

    if (etapa >= 1) {
        barra1.className = "barra-atual";
        etapa1.className = "etapa-atual";
    }

    if (etapa >= 2) {
        barra2.className = "barra-atual";
        etapa2.className = "etapa-atual";
    }

    if (etapa >= 3) {
        barra3.className = "barra-atual";
        etapa3.className = "etapa-atual";
    }
}

function avancar() {
    var cnpj = document.getElementById("input_cnpj").value.trim();
    var razao = document.getElementById("input_razao").value.trim();
    var nomeFantasia = document.getElementById("input_nomefantasia").value.trim();
    var email = document.getElementById("input_email").value.trim();
    var senha = document.getElementById("input_senha").value.trim();
    var telefone = document.getElementById("input_telefone").value.trim();

    mostrarMensagem("");

    if (cnpj == "" || razao == "" || nomeFantasia == "" || email == "" || senha == "" || telefone == "") {
        mostrarMensagem("Preencha todos os campos da empresa antes de avançar!");
        return false;
    }

    var cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length != 14) {
        mostrarMensagem("O CNPJ deve conter exatamente 14 dígitos numéricos!");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        mostrarMensagem("Insira um e-mail válido para a empresa (ex: empresa@dominio.com)!");
        return false;
    }

    if (senha.length < 6) {
        mostrarMensagem("A senha da empresa deve conter no mínimo 6 caracteres!");
        return false;
    }

    var telLimpo = telefone.replace(/\D/g, '');
    if (telLimpo.length < 10 || telLimpo.length > 11) {
        mostrarMensagem("O telefone da empresa deve ter 10 ou 11 dígitos numéricos com DDD!");
        return false;
    }

    document.getElementById("conteudo-informacoes").style.display = "none";
    document.getElementById("conteudo-endereco").style.display = "block";

    barras(2);
    return true;
}

function avancar2() {
    var cep = document.getElementById("input_cep").value.trim();
    var logradouro = document.getElementById("input_logradouro").value.trim();
    var numero = document.getElementById("input_numero").value.trim();
    var bairro = document.getElementById("input_bairro").value.trim();
    var cidade = document.getElementById("input_cidade").value.trim();

    mostrarMensagem("");

    if (cep == "" || logradouro == "" || numero == "" || bairro == "" || cidade == "") {
        mostrarMensagem("Preencha todos os campos de endereço antes de avançar!");
        return false;
    }

    var cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length != 8) {
        mostrarMensagem("O CEP deve conter exatamente 8 dígitos numéricos!");
        return false;
    }

    document.getElementById("conteudo-endereco").style.display = "none";
    document.getElementById("conteudo-responsavel").style.display = "block";

    barras(3);
    return true;
}

function voltar() {
    mostrarMensagem("");
    document.getElementById("conteudo-endereco").style.display = "none";
    document.getElementById("conteudo-informacoes").style.display = "block";

    barras(1);
}

function voltar2() {
    mostrarMensagem("");
    document.getElementById("conteudo-responsavel").style.display = "none";
    document.getElementById("conteudo-endereco").style.display = "block";

    barras(2);
}

function finalizar() {
    var cpf = document.getElementById("input_cpf").value.trim();
    var nome = document.getElementById("input_nomeresponsavel").value.trim();
    var email = document.getElementById("input_emailresponsavel").value.trim();
    var telefone = document.getElementById("input_telefoneresponsavel").value.trim();
    var cargo = document.getElementById("input_cargo").value.trim();
    var senha = document.getElementById("input_senharesponsavel").value.trim();

    mostrarMensagem("");

    if (cpf == "" || nome == "" || email == "" || telefone == "" || cargo == "" || senha == "") {
        mostrarMensagem("Preencha todos os campos do responsável antes de finalizar!");
        return false;
    }

    var cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length != 11) {
        mostrarMensagem("O CPF do responsável deve conter exatamente 11 dígitos numéricos!");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        mostrarMensagem("Insira um e-mail válido para o responsável (ex: nome@dominio.com)!");
        return false;
    }

    var telRespLimpo = telefone.replace(/\D/g, '');
    if (telRespLimpo.length < 10 || telRespLimpo.length > 11) {
        mostrarMensagem("O telefone do responsável deve ter 10 ou 11 dígitos numéricos com DDD!");
        return false;
    }

    if (senha.length < 6) {
        mostrarMensagem("A senha do responsável deve conter no mínimo 6 caracteres!");
        return false;
    }

    mostrarMensagem("Cadastro realizado com sucesso!", "sucesso");
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1200);
    return false;
}