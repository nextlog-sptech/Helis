var fretes = [];
var botaoDetalhes;
var empresaId = sessionStorage.EMPRESA_ID;

function dataFormatada(data) {
    if (!data) return 'Não informada';
    if (data.includes('T')) {
        data = data.split('T')[0];
    }
    var partes = data.split('-');
    if (partes.length === 3) {
        return partes[2] + '/' + partes[1] + '/' + partes[0];
    }
    return data;
}

function dinheiro(valor) {
    var num = Number(valor) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarTabela() {
    var busca = document.getElementById('busca').value.trim().toLowerCase();
    var status = document.getElementById('status').value;
    var inicio = document.getElementById('inicio').value;
    var fim = document.getElementById('fim').value;
    document.getElementById('erro').textContent = '';

    if (inicio && fim && inicio > fim) {
        document.getElementById('erro').textContent = 'A data inicial deve ser anterior ou igual à final.';
        return;
    }

    var lista = document.getElementById('lista');
    lista.innerHTML = '';
    var quantidade = 0;

    for (var i = 0; i < fretes.length; i++) {
        var frete = fretes[i];
        var dataSaida = frete.saida ? (frete.saida.includes('T') ? frete.saida.split('T')[0] : frete.saida) : '';
        var texto = (
            (frete.id || '') + ' ' +
            (frete.documento || '') + ' ' +
            (frete.origem || '') + ' ' +
            (frete.destino || '') + ' ' +
            (frete.destinatario || '') + ' ' +
            (frete.placa || '')
        ).toLowerCase();

        var condBusca = !busca || texto.includes(busca);
        var condStatus = !status || status === frete.status;
        var condInicio = !inicio || (dataSaida && dataSaida >= inicio);
        var condFim = !fim || (dataSaida && dataSaida <= fim);

        if (condBusca && condStatus && condInicio && condFim) {
            var responsavelOuDestino = frete.destinatario || frete.responsavel || '-';
            var veiculoInfo = frete.placa ? `${frete.placa} (${frete.marca || ''})` : '';

            lista.innerHTML += `<tr>
                <td>#${frete.id}<small>NF ${frete.documento || '-'}</small></td>
                <td>${frete.origem || '-'}<small>→ ${frete.destino || '-'}</small></td>
                <td>${responsavelOuDestino}<small>${veiculoInfo}</small></td>
                <td>${dinheiro(frete.valor)}</td>
                <td>${dataFormatada(frete.previsao || frete.saida)}</td>
                <td>${frete.status || 'Concluído'}</td>
                <td><button class="btn-limpar" onclick="mostrarDetalhes(${i}, this)">Detalhes</button></td>
            </tr>`;
            quantidade++;
        }
    }

    document.getElementById('quantidade').textContent = quantidade;
    document.getElementById('sem-resultado').hidden = quantidade > 0;
    document.getElementById('detalhes').hidden = true;
}

function carregarFretes() {
    if (!empresaId) {
        console.warn('ID da empresa não encontrado na sessão. Usando dados locais de exemplo.');
        renderizarTabela();
        return;
    }

    fetch(`/fretes/${empresaId}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error('Erro ao buscar fretes: ' + resposta.statusText);
            }
        })
        .then(function (dados) {
            fretes = dados;
            renderizarTabela();
        })
        .catch(function (erro) {
            console.error('Falha ao obter fretes da API:', erro);
            document.getElementById('erro').textContent = 'Erro ao carregar dados do servidor.';
            renderizarTabela();
        });
}

function listarFretes() {
    renderizarTabela();
}

function limparFiltros() {
    document.getElementById('form-filtros').reset();
    renderizarTabela();
}

function mostrarDetalhes(indice, botao) {
    botaoDetalhes = botao;
    var frete = fretes[indice];
    var pesoTxt = frete.peso ? Number(frete.peso).toLocaleString('pt-BR') + ' kg' : 'Não informado';
    var responsavel = frete.destinatario || frete.responsavel || '-';
    var veiculoDesc = frete.placa ? `${frete.placa} - ${frete.marca || ''} (${frete.tipoVeiculo || ''} / ${frete.bau || ''})` : '-';

    document.getElementById('informacoes').innerHTML = `
        <p><strong>Frete #${frete.id} — ${frete.status || 'Concluído'}</strong></p>
        <p>Documento fiscal: ${frete.documento || '-'}</p>
        <p>Origem: ${frete.origem || '-'} | Destino: ${frete.destino || '-'}</p>
        <p>Destinatário: ${responsavel}</p>
        <p>Veículo: ${veiculoDesc}</p>
        <p>Valor do frete: ${dinheiro(frete.valor)} | Peso: ${pesoTxt}</p>
        <p>Valor da mercadoria: ${dinheiro(frete.mercadoria)}</p>
        <p>Saída: ${dataFormatada(frete.saida)} | Previsão: ${dataFormatada(frete.previsao || frete.saida)}</p>
    `;
    document.getElementById('detalhes').hidden = false;
    document.getElementById('detalhes').focus();
}

function fecharDetalhes() {
    document.getElementById('detalhes').hidden = true;
    if (botaoDetalhes) botaoDetalhes.focus();
}

document.getElementById('form-filtros').addEventListener('submit', function (evento) {
    evento.preventDefault();
    renderizarTabela();
});

carregarFretes();
