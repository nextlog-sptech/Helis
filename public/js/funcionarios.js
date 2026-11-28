var API_FUNCIONARIOS = '/funcionario';

var funcionarios = [];

var indiceEdicao = -1;

function obterEmpresaId() {
    var empresaId = sessionStorage.getItem('EMPRESA_ID');

    if (!empresaId || isNaN(Number(empresaId))) {
        throw new Error('Não foi possível identificar a empresa do usuário logado.' );
    }

    return Number(empresaId);
}

async function requisicaoAPI(url, opcoes) {
    var resposta = await fetch(url, {
        ...opcoes,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            ...(opcoes && opcoes.headers ? opcoes.headers : {})
        }
    });

    var dados = {};

    try {
        dados = await resposta.json();
    } catch (erro) {
        dados = {};
    }

    if (!resposta.ok) {
        throw new Error(
            dados.erro ||
            dados.mensagem ||
            'Não foi possível realizar a operação.'
        );
    }

    return dados;
}

function escapar(texto) {
    var elemento = document.createElement('div');
    elemento.textContent = texto == null ? '' : String(texto);
    return elemento.innerHTML;
}
async function listarFuncionarios() {
    var busca = document.getElementById('busca').value.trim().toLowerCase();
    var cargo = document.getElementById('cargo').value;
    var lista = document.getElementById('lista');
    var quantidade = document.getElementById('quantidade');
    var semResultado = document.getElementById('sem-resultado');
    var mensagem = document.getElementById('mensagem');


    lista.innerHTML = '';

    mensagem.textContent = '';

    try {
        var empresaId = obterEmpresaId();

        var dados = await requisicaoAPI(
            API_FUNCIONARIOS + '?empresaId=' + empresaId,
            {
                method: 'GET'
            }
        );

    funcionarios = Array.isArray(dados)
    ? dados
    : (dados.funcionarios || []);

    var quantidadeEncontrada = 0;

    for (var i = 0; i < funcionarios.length; i++) {
        var funcionario = funcionarios[i];

        var texto = (
            funcionario.nome + ' ' +
            funcionario.email + ' ' +
            (funcionario.cpf || '')
        ).toLowerCase();

        if (
            texto.includes(busca) &&
            (!cargo || cargo === funcionario.cargo)
        ) {
            lista.innerHTML += `
                <tr>
                    <td>${escapar(funcionario.nome)}</td>
                    <td>${escapar(funcionario.email)}</td>
                    <td>${escapar(funcionario.cargo)}</td>
                    <td>${escapar(funcionario.telefone)}</td>
                    <td>
                        <div class="acoes-tabela">
                            <button
                                type="button"
                                class="btn-editar"
                                onclick="abrirFormulario(${Number(funcionario.idUsuario)})"
                                title="Editar funcionário"
                            >
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <button
                                type="button"
                                class="btn-excluir"
                                onclick="excluirFuncionario(${Number(funcionario.idUsuario)})"
                                title="Excluir funcionário"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;

            quantidadeEncontrada++;
        }
    }

    quantidade.textContent = quantidadeEncontrada;

    semResultado.hidden = quantidadeEncontrada > 0;

    } catch (erro) {
        console.error('Erro ao listar funcionários:', erro);

        quantidade.textContent = '0';

        semResultado.hidden = false;

        mensagem.textContent = erro.message;
    }
}

function limparFiltros() {
    document.getElementById('form-filtros').reset();
    listarFuncionarios();
}
function abrirFormulario(idUsuario) {
    indiceEdicao = idUsuario;

    var formulario = document.getElementById('form-funcionario');
    var campoSenha = document.getElementById('senha');

    formulario.reset();
    limparErrosCampos();

    document.getElementById('erro-formulario').textContent = '';
    document.getElementById('mensagem').textContent = '';

    document.getElementById('titulo-formulario').textContent =
        idUsuario === -1 ? 'Novo funcionário' : 'Editar funcionário';


   var campoSenhaContainer = campoSenha.parentElement;

   campoSenha.required = idUsuario === -1;
   campoSenha.value = '';
   campoSenha.disabled = idUsuario !== -1;

   if (idUsuario === -1) {
    campoSenhaContainer.style.display = '';
   } else {
    campoSenhaContainer.style.display = 'none';
   }

    if (idUsuario !== -1) {
        var funcionario = funcionarios.find(function(item) {
            return Number(item.idUsuario) === Number(idUsuario);
        });

        if (!funcionario) {
            document.getElementById('mensagem').textContent =
                'Funcionário não encontrado. Atualize a lista.';
            return;
        }

        document.getElementById('nome').value = funcionario.nome || '';
        document.getElementById('email').value = funcionario.email || '';
        document.getElementById('cpf').value = funcionario.cpf || '';
        document.getElementById('telefone').value = funcionario.telefone || '';
        document.getElementById('cargo-funcionario').value = funcionario.cargo || '';
        document.getElementById('isAdmin').checked = funcionario.isAdmin === 1 || funcionario.isAdmin === true;
    }

    formulario.hidden = false;
    document.getElementById('nome').focus();
}
function fecharFormulario() {
    document.getElementById('form-funcionario').hidden = true;
    indiceEdicao = -1;
    document.getElementById('busca').focus();
}

async function salvarFuncionario(evento) {
    evento.preventDefault();

    var erroFormulario = document.getElementById('erro-formulario');
    var estaEditando = indiceEdicao !== -1;

    erroFormulario.textContent = '';

    limparErrosCampos();

    var funcionario = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        cpf: document.getElementById('cpf').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        cargo: document.getElementById('cargo-funcionario').value,
        isAdmin: document.getElementById('isAdmin').checked
    };

    var formularioValido = true;

    if (!funcionario.nome) {
        mostrarErroCampo('nome', 'Preencha o nome.');
        formularioValido = false;
    } else if (funcionario.nome.length < 3) {
        mostrarErroCampo('nome', 'O nome deve possuir pelo menos 3 caracteres.');
        formularioValido = false;
    }

    if (!funcionario.email) {
        mostrarErroCampo('email', 'Preencha o e-mail.');
        formularioValido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(funcionario.email)) {
        mostrarErroCampo('email', 'Informe um e-mail válido.');
        formularioValido = false;
    }

    if (funcionario.cpf.replace(/\D/g, '').length !== 11) {
        mostrarErroCampo('cpf', 'CPF inválido. Informe 11 dígitos.');
        formularioValido = false;
    }

    if (!funcionario.telefone) {
        mostrarErroCampo('telefone', 'Preencha o telefone.');
        formularioValido = false;
    }

    if (!funcionario.cargo) {
        mostrarErroCampo('cargo-funcionario', 'Selecione o cargo.');
        formularioValido = false;
    }

    if (!estaEditando) {
        var senha = document.getElementById('senha').value;

        if (senha.length < 8) {
            mostrarErroCampo('senha', 'A senha deve possuir pelo menos 8 caracteres.');
            formularioValido = false;
        }

        funcionario.senha = senha;
    }

    if (!formularioValido) {
        return;
    }

    try {
        var empresaId = obterEmpresaId();

        funcionario.empresaId = empresaId;

        var resposta;

        if (!estaEditando) {
            resposta = await requisicaoAPI(
                API_FUNCIONARIOS,
                {
                    method: 'POST',
                    body: JSON.stringify(funcionario)
                }
            );
        } else {
            resposta = await requisicaoAPI(
                API_FUNCIONARIOS + '/' + indiceEdicao,
                {
                    method: 'PUT',
                    body: JSON.stringify(funcionario)
                }
            );
        }

        fecharFormulario();

        await listarFuncionarios();

        var mensagem = resposta.mensagem ||
            (estaEditando
                ? 'Funcionário atualizado com sucesso!'
                : 'Funcionário cadastrado com sucesso!');

        document.getElementById('mensagem').textContent = mensagem;

    } catch (erro) {
        console.error('Erro ao salvar funcionário:', erro);

        erroFormulario.textContent = erro.message;
    }
}


function mostrarErroCampo(campo, mensagem) {
    var elemento = document.getElementById(campo);
    var mensagemErro = document.getElementById('erro-' + campo);

    elemento.classList.add('erro');
    mensagemErro.textContent = mensagem;
}

function limparErrosCampos() {
    var campos = [
        'nome',
        'email',
        'cpf',
        'telefone',
        'cargo-funcionario',
        'senha'
    ];

    for (var i = 0; i < campos.length; i++) {
        var elemento = document.getElementById(campos[i]);
        var mensagemErro = document.getElementById('erro-' + campos[i]);

        if (elemento) {
            elemento.classList.remove('erro');
        }

        if (mensagemErro) {
            mensagemErro.textContent = '';
        }
    }
}
async function excluirFuncionario(indice) {
    var confirmar = confirm(
        'Tem certeza que deseja excluir este funcionário?'
    );

    if (!confirmar) {
        return;
    }

    try {
        var empresaId = obterEmpresaId();

        var resposta = await requisicaoAPI(
            API_FUNCIONARIOS + '/' + indice +
            '?empresaId=' + empresaId,
            {
                method: 'DELETE'
            }
        );

        await listarFuncionarios();

        document.getElementById('mensagem').textContent = resposta.mensagem || 'Funcionário excluído com sucesso!';

    } catch (erro) {
        console.error('Erro ao excluir funcionário:', erro);

        document.getElementById('mensagem').textContent =
            erro.message;
    }
}


document.getElementById('form-filtros').addEventListener(
    'submit',
    function(evento) {
        evento.preventDefault();

        listarFuncionarios();
    }
);

document.getElementById('form-funcionario').addEventListener(
    'submit',
    salvarFuncionario
);


listarFuncionarios();