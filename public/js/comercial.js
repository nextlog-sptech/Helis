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

// Dados buscados uma única vez; os filtros só trabalham em cima deles, sem consultar o banco de novo
let dadosFaixas = null;
let dadosClientes = null;
let todosVeiculos = null;

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

// Faz a requisição e transforma qualquer problema em um erro com mensagem legível
function buscarJson(url) {
    return fetch(url)
        .catch(function () {
            throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
        })
        .then(function (resposta) {
            if (!resposta.ok) {
                return resposta.text().then(function (mensagem) {
                    throw new Error(mensagem || 'Erro ao carregar os dados (' + resposta.status + ').');
                });
            }
            return resposta.json();
        });
}

// Troca o conteúdo de um gráfico/lista por uma mensagem de erro para o usuário
function mostrarErro(elemento, mensagem) {
    let aviso = elemento.parentElement.querySelector('.mensagem-erro');

    if (!aviso) {
        aviso = document.createElement('p');
        aviso.className = 'mensagem-erro';
        elemento.parentElement.insertBefore(aviso, elemento);
    }
    aviso.textContent = mensagem;
    elemento.style.display = 'none';
}

// ===== KPIs =====
function carregarKpis() {
    const ids = ['kpiReceita', 'kpiRentabilidade', 'kpiDespesas', 'kpiFretes'];

    buscarJson(`/financas/kpis/${empresaId}`)
        .then(function (kpis) {
            document.getElementById('kpiReceita').textContent = formatarReais(kpis.receitaBruta);
            document.getElementById('kpiRentabilidade').textContent = formatarReais(kpis.rentabilidade);
            document.getElementById('kpiDespesas').textContent = formatarReais(kpis.despesas);
            document.getElementById('kpiFretes').textContent = kpis.qtdFretes.toLocaleString('pt-BR');
        })
        .catch(function (erro) {
            console.error(erro);
            ids.forEach(function (id) {
                const kpi = document.getElementById(id);
                kpi.textContent = '--';
                kpi.title = erro.message;
            });
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
            mostrarErro(document.getElementById('faturamentoChart'), erro.message);
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

function plotarFaixas(mes) {
    const dadosDoMes = dadosFaixas.filter(function (linha) {
        return Number(linha.mes) === mes;
    });

    // mantém sempre a mesma ordem das faixas, ignorando as que não tiveram frete
    const nomes = [];
    const valores = [];
    const coresFaixas = [corLaranja, corAmarelo, corAzulEscuro, corVerdeAgua];
    const cores = [];

    faixas.forEach(function (faixa, i) {
        const encontrado = dadosDoMes.find(function (linha) {
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

function plotarTopClientes(mes) {
    // o banco já devolve ordenado pela receita, então basta pegar os 5 primeiros do mês
    const top5 = dadosClientes.filter(function (linha) {
        return Number(linha.mes) === mes;
    }).slice(0, 5);

    const nomes = top5.map(function (linha) {
        return linha.nome;
    });
    const valores = top5.map(function (linha) {
        return Number(linha.receita);
    });
    const cores = [corLaranja, corAmarelo, corAzulEscuro, corVerdeAgua, corAzul].slice(0, nomes.length);

    if (graficoCliente) {
        graficoCliente.destroy();
    }
    graficoCliente = criarRosca('clienteChart', 'legendaCliente', nomes, valores, cores, formatarReais);
}

// Filtro de mês: só redesenha com os dados que já estão carregados
function filtrarMes() {
    const mes = Number(document.getElementById('selectMes').value);

    if (dadosFaixas) plotarFaixas(mes);
    if (dadosClientes) plotarTopClientes(mes);
}

function carregarGraficosDoAno() {
    buscarJson(`/financas/faixa-valor/${empresaId}?ano=${anoAtual}`)
        .then(function (dados) {
            dadosFaixas = dados;
            plotarFaixas(Number(document.getElementById('selectMes').value));
        })
        .catch(function (erro) {
            console.error(erro);
            mostrarErro(document.getElementById('faixaChart'), erro.message);
        });

    buscarJson(`/financas/receita-clientes/${empresaId}?ano=${anoAtual}`)
        .then(function (dados) {
            dadosClientes = dados;
            plotarTopClientes(Number(document.getElementById('selectMes').value));
        })
        .catch(function (erro) {
            console.error(erro);
            mostrarErro(document.getElementById('clienteChart'), erro.message);
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

function preencherFiltrosVeiculo() {
    const marcas = [];
    const modelos = [];

    todosVeiculos.forEach(function (veiculo) {
        if (veiculo.marca && !marcas.includes(veiculo.marca)) {
            marcas.push(veiculo.marca);
        }
        if (veiculo.tipoVeiculo && !modelos.includes(veiculo.tipoVeiculo)) {
            modelos.push(veiculo.tipoVeiculo);
        }
    });

    preencherSelect('selectMarca', marcas.sort());
    preencherSelect('selectModelo', modelos.sort());
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

// Filtros de marca e modelo: aplicados na lista já carregada, sem nova consulta
function filtrarVeiculos() {
    if (!todosVeiculos) return;

    const marca = document.getElementById('selectMarca').value;
    const modelo = document.getElementById('selectModelo').value;
    const lista = document.getElementById('listaVeiculos');

    const filtrados = todosVeiculos.filter(function (veiculo) {
        return (!marca || veiculo.marca === marca) && (!modelo || veiculo.tipoVeiculo === modelo);
    });

    lista.innerHTML = '';

    if (filtrados.length === 0) {
        const vazio = document.createElement('p');
        vazio.textContent = 'Nenhum veículo encontrado.';
        lista.appendChild(vazio);
        return;
    }

    filtrados.forEach(function (veiculo) {
        lista.appendChild(criarCardVeiculo(veiculo));
    });
}

function carregarVeiculos() {
    buscarJson(`/financas/gasto-veiculos/${empresaId}`)
        .then(function (veiculos) {
            todosVeiculos = veiculos;
            preencherFiltrosVeiculo();
            filtrarVeiculos();
        })
        .catch(function (erro) {
            console.error(erro);
            const lista = document.getElementById('listaVeiculos');
            lista.innerHTML = '';
            const aviso = document.createElement('p');
            aviso.className = 'mensagem-erro';
            aviso.textContent = erro.message;
            lista.appendChild(aviso);
        });
}

function limparFiltrosVeiculo(evento) {
    evento.preventDefault();
    document.getElementById('selectStatus').selectedIndex = 0;
    document.getElementById('selectMarca').value = '';
    document.getElementById('selectModelo').value = '';
    filtrarVeiculos();
}

// ===== Início =====
if (empresaId) {
    document.getElementById('selectMes').value = new Date().getMonth() + 1;

    document.getElementById('btnFiltrarMes').addEventListener('click', filtrarMes);
    document.getElementById('btnFiltrarVeiculos').addEventListener('click', filtrarVeiculos);
    document.getElementById('limparFiltros').addEventListener('click', limparFiltrosVeiculo);

    carregarKpis();
    carregarFaturamentoMensal();
    carregarGraficosDoAno();
    carregarVeiculos();
} else {
    console.error('EMPRESA_ID não encontrado na sessão. Faça login novamente.');
}
