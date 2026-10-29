// Demonstração do front-end. O array volta ao estado inicial ao recarregar.
// Não cria contas de acesso e não grava dados no banco.
var funcionarios = [
    { nome: 'Carlos Almeida', email: 'carlos@example.com', telefone: '11912345678', cargo: 'Administrador' },
    { nome: 'Mariana Costa', email: 'mariana@example.com', telefone: '11923456789', cargo: 'Gestor de Logística' },
    { nome: 'Rafael Santos', email: 'rafael@example.com', telefone: '11934567890', cargo: 'Analista de Logística' },
    { nome: 'Fernando Lima', email: 'fernando@example.com', telefone: '11945678901', cargo: 'Motorista' },
    { nome: 'Paulo Souza', email: 'paulo@example.com', telefone: '11956789012', cargo: 'Motorista' }
];
var indiceEdicao = -1;
// Mesmo cuidado utilizado no veiculos.js ao exibir texto digitado.
function escapar(texto) {
    var elemento = document.createElement('div');
    elemento.textContent = texto;
    return elemento.innerHTML;
}
function listarFuncionarios() {
    var busca = document.getElementById('busca').value.trim().toLowerCase();
    var cargo = document.getElementById('cargo').value;
    var lista = document.getElementById('lista');
    lista.innerHTML = '';
    var quantidade = 0;
    for (var i = 0; i < funcionarios.length; i++) {
        var funcionario = funcionarios[i];
        var texto = (funcionario.nome + ' ' + funcionario.email).toLowerCase();
        if (texto.includes(busca) && (!cargo || cargo === funcionario.cargo)) {
            lista.innerHTML += `<tr><td>${escapar(funcionario.nome)}</td><td>${escapar(funcionario.cargo)}</td><td>${escapar(funcionario.email)}</td><td>${escapar(funcionario.telefone)}</td><td><button class="btn-limpar" onclick="abrirFormulario(${i})">Editar</button></td></tr>`;
            quantidade++;
        }
    }
    document.getElementById('quantidade').textContent = quantidade;
    document.getElementById('sem-resultado').hidden = quantidade > 0;
}
function limparFiltros() {
    document.getElementById('form-filtros').reset();
    listarFuncionarios();
}
function abrirFormulario(indice) {
    indiceEdicao = indice;
    document.getElementById('form-funcionario').reset();
    document.getElementById('erro-formulario').textContent = '';
    document.getElementById('mensagem').textContent = '';
    document.getElementById('titulo-formulario').textContent = indice === -1 ? 'Novo funcionário' : 'Editar funcionário';
    if (indice !== -1) {
        document.getElementById('nome').value = funcionarios[indice].nome;
        document.getElementById('email').value = funcionarios[indice].email;
        document.getElementById('telefone').value = funcionarios[indice].telefone;
        document.getElementById('cargo-funcionario').value = funcionarios[indice].cargo;
    }
    document.getElementById('form-funcionario').hidden = false;
    document.getElementById('nome').focus();
}
function fecharFormulario() {
    document.getElementById('form-funcionario').hidden = true;
    document.getElementById('busca').focus();
}
function salvarFuncionario(evento) {
    evento.preventDefault();
    var funcionario = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        telefone: document.getElementById('telefone').value.trim(),
        cargo: document.getElementById('cargo-funcionario').value
    };
    if (!funcionario.nome) {
        document.getElementById('erro-formulario').textContent = 'Preencha o nome.';
        return;
    }
    for (var i = 0; i < funcionarios.length; i++) {
        if (i !== indiceEdicao && funcionarios[i].email === funcionario.email) {
            document.getElementById('erro-formulario').textContent = 'Este e-mail já está na lista.';
            return;
        }
    }
    if (indiceEdicao === -1) funcionarios.push(funcionario);
    else funcionarios[indiceEdicao] = funcionario;
    fecharFormulario();
    limparFiltros();
    document.getElementById('mensagem').textContent = 'Exemplo salvo nesta tela. Ao recarregar, os dados iniciais serão restaurados.';
}
document.getElementById('form-filtros').addEventListener('submit', function(evento) {
    evento.preventDefault();
    listarFuncionarios();
});
document.getElementById('form-funcionario').addEventListener('submit', salvarFuncionario);
listarFuncionarios();
