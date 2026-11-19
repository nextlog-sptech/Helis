const estilo = getComputedStyle(document.documentElement);
const corAzul = estilo.getPropertyValue('--azul').trim();
const corAzulEscuro = estilo.getPropertyValue('--azulEscuro').trim();
const corLaranja = estilo.getPropertyValue('--laranja').trim();
const corAmarelo = '#FFCC00';
const corVerdeAgua = '#2A8A94';

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#7b8194';

// ===== Empresa do usuário logado =====
const empresaId = sessionStorage.EMPRESA_ID;
const anoAtual = new Date().getFullYear();

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const faixas = ['Até 5 mil', '5-20 mil', '20-50 mil', 'Acima de 50 mil'];

// guarda os gráficos de rosca para poder recriar quando o filtro mudar
let graficoFaixa = null;
let graficoCliente = null;

// ===== Funções auxiliares =====
function formatarReais(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 15800 -> "15,8 mil" (para caber em cima das barras)
function formatarAbreviado(valor) {
    if (valor >= 1000000) {
        return (valor / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
    }
    if (valor >= 1000) {
        return (valor / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
    }
    return valor.toLocaleString('pt-BR');
}

function buscarJson(url) {
    return fetch(url).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao buscar ' + url + ': ' + resposta.status);
        }
        return resposta.json();
    });
}

// ===== KPIs =====
function carregarKpis() {
    buscarJson(`/financas/kpis/${empresaId}`)
        .then(function (kpis) {
            document.getElementById('kpiReceita').textContent = formatarReais(kpis.receitaBruta);
            document.getElementById('kpiRentabilidade').textContent = formatarReais(kpis.rentabilidade);
            document.getElementById('kpiDespesas').textContent = formatarReais(kpis.despesas);
            document.getElementById('kpiFretes').textContent = kpis.qtdFretes.toLocaleString('pt-BR');
        })
        .catch(function (erro) {
            console.error(erro);
        });
}

// ===== Gráfico de barras: Faturamento Mensal =====
const valoresNasBarras = {
    id: 'valoresNasBarras',
    afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = '#3d4452';
        ctx.font = "600 12px 'Inter', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        chart.getDatasetMeta(0).data.forEach(function (barra, i) {
            const valor = chart.data.datasets[0].data[i];
            if (valor > 0) {
                ctx.fillText(formatarAbreviado(valor), barra.x, barra.y - 4);
            }
        });

        ctx.restore();
    }
};

function plotarFaturamentoMensal(dados) {
    // mostra de janeiro até o mês atual; meses sem frete entram com 0
    const mesAtual = new Date().getMonth() + 1;
    const labels = meses.slice(0, mesAtual);
    const faturamentoMeses = labels.map(function (nome, i) {
        const encontrado = dados.find(function (linha) {
            return Number(linha.mes) === i + 1;
        });
        return encontrado ? Number(encontrado.faturamento) : 0;
    });

    new Chart(document.getElementById('faturamentoChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Faturamento',
                data: faturamentoMeses,
                backgroundColor: corAzul,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 20 } // espaço para o valor escrito em cima da barra
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (item) {
                            return 'Faturamento: ' + formatarReais(item.raw);
                        }
                    }
                }
            },
            datasets: {
                bar: {
                    barPercentage: 0.6,
                    categoryPercentage: 0.9
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5,
                        callback: function (valor) {
                            return formatarAbreviado(valor);
                        }
                    },
                    border: { display: false }
                },
                x: {
                    grid: { display: false }
                }
            }
        },
        plugins: [valoresNasBarras]
    });
}

function carregarFaturamentoMensal() {
    buscarJson(`/financas/faturamento-mensal/${empresaId}?ano=${anoAtual}`)
        .then(plotarFaturamentoMensal)
        .catch(function (erro) {
            console.error(erro);
        });
}

// ===== Gráficos de rosca =====
function criarRosca(idCanvas, idLegenda, nomes, valores, cores, formatarTooltip) {
    const legenda = document.getElementById(idLegenda);
    legenda.innerHTML = '';

    if (nomes.length === 0) {
        const vazio = document.createElement('p');
        vazio.textContent = 'Sem fretes neste mês';
        legenda.appendChild(vazio);
    }

    nomes.forEach(function (nome, i) {
        const item = document.createElement('div');
        item.className = 'legenda-item';

        const bolinha = document.createElement('span');
        bolinha.className = 'bolinha';
        bolinha.style.backgroundColor = cores[i];

        const texto = document.createElement('p');
        texto.textContent = nome;

        item.appendChild(bolinha);
        item.appendChild(texto);
        legenda.appendChild(item);
    });

    return new Chart(document.getElementById(idCanvas), {
        type: 'doughnut',
        data: {
            labels: nomes,
            datasets: [{
                data: valores,
                backgroundColor: cores,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (item) {
                            return item.label + ': ' + formatarTooltip(item.raw);
                        }
                    }
                }
            }
        }
    });
}

function plotarFaixas(dados) {
    // mantém sempre a mesma ordem das faixas, ignorando as que não tiveram frete
    const nomes = [];
    const valores = [];
    const coresFaixas = [corLaranja, corAmarelo, corAzulEscuro, corVerdeAgua];
    const cores = [];

    faixas.forEach(function (faixa, i) {
        const encontrado = dados.find(function (linha) {
            return linha.faixa === faixa;
        });
        if (encontrado) {
            nomes.push(faixa);
            valores.push(Number(encontrado.qtdFretes));
            cores.push(coresFaixas[i]);
        }
    });

    if (graficoFaixa) {
        graficoFaixa.destroy();
    }
    graficoFaixa = criarRosca('faixaChart', 'legendaFaixa', nomes, valores, cores, function (valor) {
        return valor + (valor === 1 ? ' frete' : ' fretes');
    });
}

function plotarTopClientes(dados) {
    const nomes = dados.map(function (linha) {
        return linha.nome;
    });
    const valores = dados.map(function (linha) {
        return Number(linha.receita);
    });
    const cores = [corLaranja, corAmarelo, corAzulEscuro, corVerdeAgua, corAzul].slice(0, nomes.length);

    if (graficoCliente) {
        graficoCliente.destroy();
    }
    graficoCliente = criarRosca('clienteChart', 'legendaCliente', nomes, valores, cores, formatarReais);
}

function carregarGraficosDoMes() {
    const mes = document.getElementById('selectMes').value;
    const parametros = `?ano=${anoAtual}&mes=${mes}`;

    buscarJson(`/financas/faixa-valor/${empresaId}${parametros}`)
        .then(plotarFaixas)
        .catch(function (erro) {
            console.error(erro);
        });

    buscarJson(`/financas/top-clientes/${empresaId}${parametros}`)
        .then(plotarTopClientes)
        .catch(function (erro) {
            console.error(erro);
        });
}

// ===== Gasto por veículo =====
function preencherSelect(idSelect, valores) {
    const select = document.getElementById(idSelect);

    valores.forEach(function (valor) {
        const opcao = document.createElement('option');
        opcao.value = valor;
        opcao.textContent = valor;
        select.appendChild(opcao);
    });
}

function carregarFiltrosVeiculo() {
    buscarJson(`/financas/filtros-veiculo/${empresaId}`)
        .then(function (dados) {
            const marcas = [];
            const modelos = [];

            dados.forEach(function (linha) {
                if (linha.marca && !marcas.includes(linha.marca)) {
                    marcas.push(linha.marca);
                }
                if (linha.tipoVeiculo && !modelos.includes(linha.tipoVeiculo)) {
                    modelos.push(linha.tipoVeiculo);
                }
            });

            preencherSelect('selectMarca', marcas);
            preencherSelect('selectModelo', modelos.sort());
        })
        .catch(function (erro) {
            console.error(erro);
        });
}

function criarCardVeiculo(veiculo) {
    const card = document.createElement('div');
    card.className = 'veiculo card';

    const nome = document.createElement('span');
    nome.className = 'veiculo-nome';
    nome.textContent = veiculo.marca + (veiculo.tipoVeiculo ? ' ' + veiculo.tipoVeiculo : '');

    const placa = document.createElement('span');
    placa.className = 'veiculo-placa';
    placa.textContent = 'Placa: ' + veiculo.placa;

    const gasto = document.createElement('span');
    gasto.className = 'veiculo-gasto';
    gasto.textContent = 'Gasto total ';
    const valorGasto = document.createElement('span');
    valorGasto.textContent = formatarReais(veiculo.gastoTotal);
    gasto.appendChild(valorGasto);

    const divImg = document.createElement('div');
    divImg.className = 'veiculo-img';
    const img = document.createElement('img');
    img.src = 'assets/imgs/Truck.png';
    img.alt = '';
    divImg.appendChild(img);

    card.appendChild(nome);
    card.appendChild(placa);
    card.appendChild(gasto);
    card.appendChild(divImg);
    return card;
}

function carregarGastoVeiculos() {
    const marca = document.getElementById('selectMarca').value;
    const modelo = document.getElementById('selectModelo').value;
    const parametros = new URLSearchParams();

    if (marca) parametros.append('marca', marca);
    if (modelo) parametros.append('tipo', modelo);

    buscarJson(`/financas/gasto-veiculos/${empresaId}?${parametros.toString()}`)
        .then(function (veiculos) {
            const lista = document.getElementById('listaVeiculos');
            lista.innerHTML = '';

            if (veiculos.length === 0) {
                const vazio = document.createElement('p');
                vazio.textContent = 'Nenhum veículo encontrado.';
                lista.appendChild(vazio);
                return;
            }

            veiculos.forEach(function (veiculo) {
                lista.appendChild(criarCardVeiculo(veiculo));
            });
        })
        .catch(function (erro) {
            console.error(erro);
        });
}

function limparFiltrosVeiculo(evento) {
    evento.preventDefault();
    document.getElementById('selectStatus').selectedIndex = 0;
    document.getElementById('selectMarca').value = '';
    document.getElementById('selectModelo').value = '';
    carregarGastoVeiculos();
}

// ===== Início =====
if (empresaId) {
    document.getElementById('selectMes').value = new Date().getMonth() + 1;

    document.getElementById('btnFiltrarMes').addEventListener('click', carregarGraficosDoMes);
    document.getElementById('btnFiltrarVeiculos').addEventListener('click', carregarGastoVeiculos);
    document.getElementById('limparFiltros').addEventListener('click', limparFiltrosVeiculo);

    carregarKpis();
    carregarFaturamentoMensal();
    carregarGraficosDoMes();
    carregarFiltrosVeiculo();
    carregarGastoVeiculos();
} else {
    console.error('EMPRESA_ID não encontrado na sessão. Faça login novamente.');
}
