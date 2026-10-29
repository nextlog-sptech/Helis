// Dados de exemplo, seguindo a mesma ideia do veiculos.js.
// Quando a API de fretes existir, substituir este array pelos dados retornados.
var fretes = [
    { id: 5021, documento: '100021', origem: 'São Paulo', destino: 'Curitiba', responsavel: 'Fernando Lima', placa: 'VTA2R41', valor: 3200, peso: 850, mercadoria: 25000, saida: '2026-10-20', previsao: '2026-10-23', entrega: '', status: 'Em transporte' },
    { id: 5022, documento: '100022', origem: 'Campinas', destino: 'Rio de Janeiro', responsavel: 'Paulo Souza', placa: 'BRA3F19', valor: 4100, peso: 720, mercadoria: 18000, saida: '2026-10-24', previsao: '2026-10-26', entrega: '', status: 'Aguardando' },
    { id: 5023, documento: '100023', origem: 'Santos', destino: 'São Paulo', responsavel: 'Fernando Lima', placa: 'VTA2R41', valor: 1200, peso: 500, mercadoria: 12000, saida: '2026-10-18', previsao: '2026-10-19', entrega: '2026-10-19', status: 'Entregue' },
    { id: 5024, documento: '100024', origem: 'São Paulo', destino: 'Belo Horizonte', responsavel: 'Paulo Souza', placa: 'BRA3F19', valor: 3800, peso: 900, mercadoria: 32000, saida: '2026-10-21', previsao: '2026-10-24', entrega: '', status: 'Cancelado' }
];
var botaoDetalhes;
function dataFormatada(data) {
    if (!data) return 'Não informada';
    var partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}
function dinheiro(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function listarFretes() {
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
        var texto = (frete.id + ' ' + frete.documento + ' ' + frete.origem + ' ' + frete.destino).toLowerCase();
        if (texto.includes(busca) && (!status || status === frete.status) && (!inicio || frete.saida >= inicio) && (!fim || frete.saida <= fim)) {
            lista.innerHTML += `<tr><td>#${frete.id}<small>NF ${frete.documento}</small></td><td>${frete.origem}<small>→ ${frete.destino}</small></td><td>${frete.responsavel}<small>${frete.placa}</small></td><td>${dinheiro(frete.valor)}</td><td>${dataFormatada(frete.previsao)}</td><td>${frete.status}</td><td><button class="btn-limpar" onclick="mostrarDetalhes(${i}, this)">Detalhes</button></td></tr>`;
            quantidade++;
        }
    }
    document.getElementById('quantidade').textContent = quantidade;
    document.getElementById('sem-resultado').hidden = quantidade > 0;
    document.getElementById('detalhes').hidden = true;
}
function limparFiltros() {
    document.getElementById('form-filtros').reset();
    listarFretes();
}
function mostrarDetalhes(indice, botao) {
    botaoDetalhes = botao;
    var frete = fretes[indice];
    document.getElementById('informacoes').innerHTML = `<p><strong>Frete #${frete.id} — ${frete.status}</strong></p><p>Documento fiscal: ${frete.documento}</p><p>Origem: ${frete.origem} | Destino: ${frete.destino}</p><p>Responsável: ${frete.responsavel} | Veículo: ${frete.placa}</p><p>Valor do frete: ${dinheiro(frete.valor)} | Peso: ${frete.peso} kg</p><p>Valor da mercadoria: ${dinheiro(frete.mercadoria)}</p><p>Saída: ${dataFormatada(frete.saida)} | Previsão: ${dataFormatada(frete.previsao)}</p><p>Entrega realizada: ${dataFormatada(frete.entrega)}</p>`;
    document.getElementById('detalhes').hidden = false;
    document.getElementById('detalhes').focus();
}
function fecharDetalhes() {
    document.getElementById('detalhes').hidden = true;
    if (botaoDetalhes) botaoDetalhes.focus();
}
document.getElementById('form-filtros').addEventListener('submit', function(evento) {
    evento.preventDefault();
    listarFretes();
});
listarFretes();
