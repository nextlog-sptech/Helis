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

function limparErroCampo(campoId) {
    var elemento = document.getElementById("mensagem-" + campoId);
    var campo = document.getElementById(campoId);

    if (elemento) {
        elemento.textContent = "";
        elemento.classList.add("hidden");
        elemento.classList.remove("erro");
    }

    if (campo) {
        campo.removeAttribute("aria-invalid");
    }
}

function limparErros(campos) {
    for (var i = 0; i < campos.length; i++) {
        limparErroCampo(campos[i]);
    }
}

function mostrarErroCampo(campoId, texto) {
    var elemento = document.getElementById("mensagem-" + campoId);
    var campo = document.getElementById(campoId);

    if (!elemento || !campo) {
        return;
    }

    elemento.textContent = texto;
    elemento.classList.remove("hidden");
    elemento.classList.add("erro");
    campo.setAttribute("aria-invalid", "true");
}

function validarCamposObrigatorios(campos) {
    var primeiroCampoInvalido = null;

    for (var i = 0; i < campos.length; i++) {
        var campo = document.getElementById(campos[i][0]);
        if (campo.value.trim() === "") {
            mostrarErroCampo(campos[i][0], campos[i][1]);
            if (!primeiroCampoInvalido) {
                primeiroCampoInvalido = campo;
            }
        }
    }

    if (primeiroCampoInvalido) {
        primeiroCampoInvalido.focus();
        return false;
    }

    return true;
}

function senhaValida(senha) {
    return senha.length >= 6 &&
        /\p{Lu}/u.test(senha) &&
        /\p{Ll}/u.test(senha) &&
        /[0-9]/.test(senha) &&
        /[\p{P}\p{S}]/u.test(senha);
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
    var cnpj = document.getElementById("input_cnpj").value;
    var razao = document.getElementById("input_razao").value.trim();
    var nomeFantasia = document.getElementById("input_nomefantasia").value.trim();
    var email = document.getElementById("input_email").value.trim();
    var senha = document.getElementById("input_senha").value;
    var telefone = document.getElementById("input_telefone").value;

    limparErros(["input_cnpj", "input_razao", "input_nomefantasia", "input_email", "input_senha", "input_telefone"]);
    mostrarMensagem("");

    if (!validarCamposObrigatorios([
        ["input_cnpj", "Informe o CNPJ da empresa."],
        ["input_razao", "Informe a razão social da empresa."],
        ["input_nomefantasia", "Informe o nome fantasia da empresa."],
        ["input_email", "Informe o e-mail da empresa."],
        ["input_senha", "Informe a senha da empresa."],
        ["input_telefone", "Informe o telefone da empresa."]
    ])) {
        return false;
    }

    if (!/^[0-9]{14}$/.test(cnpj)) {
        mostrarErroCampo("input_cnpj", "O CNPJ deve conter exatamente 14 dígitos e apenas números.");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        mostrarErroCampo("input_email", "Insira um e-mail válido para a empresa (ex: empresa@dominio.com).");
        return false;
    }

    if (!senhaValida(senha)) {
        mostrarErroCampo("input_senha", "A senha da empresa deve ter ao menos 6 caracteres, incluindo letras maiúsculas e minúsculas, um número e um caractere especial.");
        return false;
    }

    if (!/^[0-9]{10,11}$/.test(telefone)) {
        mostrarErroCampo("input_telefone", "O telefone da empresa deve conter apenas números: 10 ou 11 dígitos com DDD.");
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

    limparErros(["input_cep", "input_logradouro", "input_numero", "input_bairro", "input_cidade"]);
    mostrarMensagem("");

    if (!validarCamposObrigatorios([
        ["input_cep", "Informe o CEP da empresa."],
        ["input_logradouro", "Informe o logradouro da empresa."],
        ["input_numero", "Informe o número do endereço."],
        ["input_bairro", "Informe o bairro da empresa."],
        ["input_cidade", "Informe a cidade da empresa."]
    ])) {
        return false;
    }

    var cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length != 8) {
        mostrarErroCampo("input_cep", "O CEP deve conter exatamente 8 dígitos numéricos.");
        return false;
    }

    document.getElementById("conteudo-endereco").style.display = "none";
    document.getElementById("conteudo-responsavel").style.display = "block";

    barras(3);
    return true;
}

function voltar() {
    limparErros(["input_cep", "input_logradouro", "input_numero", "input_bairro", "input_cidade"]);
    mostrarMensagem("");
    document.getElementById("conteudo-endereco").style.display = "none";
    document.getElementById("conteudo-informacoes").style.display = "block";

    barras(1);
}

function voltar2() {
    limparErros(["input_cpf", "input_nomeresponsavel", "input_emailresponsavel", "input_telefoneresponsavel", "input_cargo", "input_senharesponsavel"]);
    mostrarMensagem("");
    document.getElementById("conteudo-responsavel").style.display = "none";
    document.getElementById("conteudo-endereco").style.display = "block";

    barras(2);
}

function finalizar() {
    var cpf = document.getElementById("input_cpf").value.trim();
    var nome = document.getElementById("input_nomeresponsavel").value.trim();
    var email = document.getElementById("input_emailresponsavel").value.trim();
    var telefone = document.getElementById("input_telefoneresponsavel").value;
    var cargo = document.getElementById("input_cargo").value.trim();
    var senha = document.getElementById("input_senharesponsavel").value;

    limparErros(["input_cpf", "input_nomeresponsavel", "input_emailresponsavel", "input_telefoneresponsavel", "input_cargo", "input_senharesponsavel"]);
    mostrarMensagem("");

    if (!validarCamposObrigatorios([
        ["input_cpf", "Informe o CPF do responsável."],
        ["input_nomeresponsavel", "Informe o nome do responsável."],
        ["input_emailresponsavel", "Informe o e-mail do responsável."],
        ["input_telefoneresponsavel", "Informe o telefone do responsável."],
        ["input_cargo", "Informe o cargo do responsável."],
        ["input_senharesponsavel", "Informe a senha do responsável."]
    ])) {
        return false;
    }

    var cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length != 11) {
        mostrarErroCampo("input_cpf", "O CPF do responsável deve conter exatamente 11 dígitos numéricos.");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        mostrarErroCampo("input_emailresponsavel", "Insira um e-mail válido para o responsável (ex: nome@dominio.com).");
        return false;
    }

    if (!/^[0-9]{10,11}$/.test(telefone)) {
        mostrarErroCampo("input_telefoneresponsavel", "O telefone do responsável deve conter apenas números: 10 ou 11 dígitos com DDD.");
        return false;
    }

    if (!senhaValida(senha)) {
        mostrarErroCampo("input_senharesponsavel", "A senha do responsável deve ter ao menos 6 caracteres, incluindo letras maiúsculas e minúsculas, um número e um caractere especial.");
        return false;
    }

    mostrarMensagem("Cadastro realizado com sucesso!", "sucesso");
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1200);
    return false;
}

var camposCadastro = document.querySelectorAll(".campo input");
for (var i = 0; i < camposCadastro.length; i++) {
    camposCadastro[i].addEventListener("input", function () {
        limparErroCampo(this.id);
    });
}