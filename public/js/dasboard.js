// ===== Cores (lidas das variáveis do global.css) =====
const estilo = getComputedStyle(document.documentElement);
const corAzul = estilo.getPropertyValue('--azul').trim();
const corAzulEscuro = estilo.getPropertyValue('--azulEscuro').trim();
const corLaranja = estilo.getPropertyValue('--laranja').trim();
const corCinza = estilo.getPropertyValue('--cinza').trim();

// ===== Configuração padrão de todos os gráficos =====
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#7b8194';

const empresaId = sessionStorage.EMPRESA_ID;

const nomesEstados = {
    AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará',
    DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão',
    MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará',
    PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro',
    RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
    SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
};

const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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

function mostrarErro(idCanvas, mensagem) {
    const canvas = document.getElementById(idCanvas);
    const aviso = document.createElement('p');
    aviso.className = 'mensagem-erro';
    aviso.textContent = mensagem;
    canvas.parentElement.insertBefore(aviso, canvas);
    canvas.style.display = 'none';
}

// ===== Gráfico de barras: Fretes por estado =====

// escreve o valor em cima de cada barra, como no Figma
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
            ctx.fillText(chart.data.datasets[0].data[i], barra.x, barra.y - 4);
        });

        ctx.restore();
    }
};

function plotarFretesPorEstado(dados) {
    const estados = dados.map(function (linha) {
        return nomesEstados[linha.uf] || linha.uf;
    });
    const fretesEstados = dados.map(function (linha) {
        return Number(linha.qtdFretes);
    });
    const cores = fretesEstados.map(function (valor, i) {
        return i < 2 ? corAzul : corLaranja;
    });

    new Chart(document.getElementById('fretesChart'), {
        type: 'bar',
        data: {
            labels: estados,
            datasets: [{
                label: 'Fretes',
                data: fretesEstados,
                backgroundColor: cores,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 20 }
            },
            plugins: {
                legend: { display: false }
            },
            datasets: {
                bar: {
                    barPercentage: 0.5,
                    categoryPercentage: 0.6
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
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

function buscarFretesPorEstado() {
    buscarJson(`/dashboard/fretes-estado/${empresaId}`)
        .then(function (dados) {
            plotarFretesPorEstado(dados);
        })
        .catch(function (erro) {
            console.error(erro);
            mostrarErro('fretesChart', erro.message);
        });
}

const coresRosca = [corAzul, corLaranja, corAzulEscuro, '#66A9E0', '#2A8A94'];
const corOutros = corCinza;
const corNaoInformado = '#C9CDD6';
const NAO_INFORMADO = 'Não informado';

function montarFatias(dados, campoNome, campoValor) {
    const fatias = [];
    const nomeados = [];
    let naoInformado = 0;

    dados.forEach(function (linha) {
        const valor = Number(linha[campoValor]) || 0;
        if (valor <= 0) return;
        if (linha[campoNome] === NAO_INFORMADO) {
            naoInformado += valor;
        } else {
            nomeados.push({ nome: linha[campoNome], valor: valor });
        }
    });

    nomeados.sort(function (a, b) {
        return b.valor - a.valor;
    });

    const visiveis = nomeados.length > coresRosca.length ? nomeados.slice(0, coresRosca.length - 1) : nomeados;
    visiveis.forEach(function (item, i) {
        fatias.push({ nome: item.nome, valor: item.valor, cor: coresRosca[i] });
    });

    if (visiveis.length < nomeados.length) {
        const outros = nomeados.slice(visiveis.length).reduce(function (soma, item) {
            return soma + item.valor;
        }, 0);
        fatias.push({ nome: 'Outros', valor: outros, cor: corOutros });
    }

    if (naoInformado > 0) {
        fatias.push({ nome: NAO_INFORMADO, valor: naoInformado, cor: corNaoInformado });
    }

    return fatias;
}

function calcularPercentuais(valores) {
    const total = valores.reduce(function (soma, valor) {
        return soma + valor;
    }, 0);
    if (total === 0) {
        return valores.map(function () {
            return 0;
        });
    }

    const exatos = valores.map(function (valor) {
        return (valor / total) * 100;
    });
    const percentuais = exatos.map(Math.floor);
    let restante = 100 - percentuais.reduce(function (soma, valor) {
        return soma + valor;
    }, 0);

    exatos
        .map(function (valor, i) {
            return { i: i, resto: valor - Math.floor(valor) };
        })
        .sort(function (a, b) {
            return b.resto - a.resto;
        })
        .forEach(function (item) {
            if (restante > 0) {
                percentuais[item.i]++;
                restante--;
            }
        });

    return percentuais;
}

function mostrarAvisoRosca(idCanvas, idLegenda, mensagem, ehErro) {
    const legenda = document.getElementById(idLegenda);
    const canvas = document.getElementById(idCanvas);
    legenda.innerHTML = '';

    const aviso = document.createElement('p');
    aviso.className = ehErro ? 'mensagem-erro' : 'mensagem-vazia';
    aviso.textContent = mensagem;
    legenda.appendChild(aviso);

    canvas.parentElement.style.display = 'none';
}

function plotarRosca(idCanvas, idLegenda, fatias, descricaoUnidade) {
    const legenda = document.getElementById(idLegenda);
    const nomes = fatias.map(function (fatia) {
        return fatia.nome;
    });
    const valores = fatias.map(function (fatia) {
        return fatia.valor;
    });
    const cores = fatias.map(function (fatia) {
        return fatia.cor;
    });
    const percentuais = calcularPercentuais(valores);

    legenda.innerHTML = '';
    legenda.classList.toggle('compacta', fatias.length > 3);
    nomes.forEach(function (nome, i) {
        const item = document.createElement('div');
        item.className = 'legenda-item';

        const bolinha = document.createElement('span');
        bolinha.className = 'bolinha';
        bolinha.style.backgroundColor = cores[i];

        const texto = document.createElement('p');
        texto.textContent = nome + ' (' + percentuais[i] + '%)';

        item.appendChild(bolinha);
        item.appendChild(texto);
        legenda.appendChild(item);
    });

    new Chart(document.getElementById(idCanvas), {
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
                            const unidade = item.raw === 1 ? descricaoUnidade[0] : descricaoUnidade[1];
                            return item.label + ': ' + item.raw + ' ' + unidade + ' (' + percentuais[item.dataIndex] + '%)';
                        }
                    }
                }
            }
        }
    });
}

function buscarTiposBau() {
    buscarJson(`/dashboard/tipos-bau/${empresaId}`)
        .then(function (dados) {
            const fatias = montarFatias(dados || [], 'bau', 'qtdVeiculos');
            if (fatias.length === 0) {
                mostrarAvisoRosca('graficoRosca', 'legendaBau', 'Nenhum veículo cadastrado.', false);
                return;
            }
            plotarRosca('graficoRosca', 'legendaBau', fatias, ['veículo', 'veículos']);
        })
        .catch(function (erro) {
            console.error(erro);
            mostrarAvisoRosca('graficoRosca', 'legendaBau', erro.message, true);
        });
}

function buscarFretesPorRegiao() {
    buscarJson(`/dashboard/fretes-regiao/${empresaId}`)
        .then(function (dados) {
            const fatias = montarFatias(dados || [], 'regiao', 'qtdFretes');
            if (fatias.length === 0) {
                mostrarAvisoRosca('graficoRegiao', 'legendaRegiao', 'Nenhum frete encontrado.', false);
                return;
            }
            plotarRosca('graficoRegiao', 'legendaRegiao', fatias, ['frete', 'fretes']);
        })
        .catch(function (erro) {
            console.error(erro);
            mostrarAvisoRosca('graficoRegiao', 'legendaRegiao', erro.message, true);
        });
}

// ===== Gráfico de linha: Fretes por período =====
const QTD_MESES_PERIODO = 7;

function plotarFretesPorPeriodo(dados) {
    const labels = [];
    const valores = [];
    const hoje = new Date();

    for (let i = QTD_MESES_PERIODO - 1; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const chave = data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0');
        const encontrado = dados.find(function (linha) {
            return linha.mes === chave;
        });

        labels.push(nomesMeses[data.getMonth()]);
        valores.push(encontrado ? Number(encontrado.qtdFretes) : 0);
    }

    new Chart(document.getElementById('periodoChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Fretes',
                data: valores,
                borderColor: corLaranja,
                backgroundColor: 'rgba(255, 120, 0, 0.12)',
                fill: true,
                tension: 0,
                borderWidth: 2,
                pointRadius: 3,
                pointBorderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: corLaranja
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0, maxTicksLimit: 5 },
                    border: { display: false }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function buscarFretesPorPeriodo() {
    buscarJson(`/dashboard/fretes-periodo/${empresaId}?meses=${QTD_MESES_PERIODO}`)
        .then(function (dados) {
            plotarFretesPorPeriodo(dados);
        })
        .catch(function (erro) {
            console.error(erro);
            mostrarErro('periodoChart', erro.message);
        });
}
async function buscarKpis() {
    const kpiTicket = document.getElementById('kpi1');
    const kpiManutencao = document.getElementById('kpi2');
    try {
        const kpis = await buscarJson(`/dashboard/kpis/${empresaId}`);
        kpiTicket.textContent = kpis.tMedio;
        kpiManutencao.textContent = kpis.custoManun;
    } catch (erro) {
        console.error(erro);
        kpiTicket.textContent = 'Indisponível';
        kpiManutencao.textContent = 'Indisponível';
        kpiTicket.title = erro.message;
        kpiManutencao.title = erro.message;
    }
}

function carregarFretesRecentes() {
    var tabela = document.getElementById('tabelaFretesRecentes');
    if (!tabela) return;

    buscarJson(`/fretes/recentes/${empresaId}?limite=6`)
        .then(function (dados) {
            tabela.innerHTML = '';
            if (!dados || dados.length === 0) {
                tabela.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum frete recente encontrado.</td></tr>';
                return;
            }

            dados.forEach(function (frete) {
                var cidadeUf = frete.destinoCidade ? `${frete.destinoCidade} - ${frete.destinoUf || ''}` : (frete.destinatario || '-');
                var veiculo = frete.veiculo || '-';
                var bau = frete.bau || '-';
                var data = frete.dataFormatada || '-';

                var tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cidadeUf}</td>
                    <td>${veiculo}</td>
                    <td>${bau}</td>
                    <td>${data}</td>
                `;
                tabela.appendChild(tr);
            });
        })
        .catch(function (erro) {
            console.error('Erro ao carregar fretes recentes:', erro);
            tabela.innerHTML = '<tr><td colspan="4" style="text-align:center;">Erro ao carregar dados.</td></tr>';
        });
}

if (empresaId) {
    buscarFretesPorEstado();
    buscarFretesPorPeriodo();
    buscarTiposBau();
    buscarFretesPorRegiao();
    buscarKpis();
    carregarFretesRecentes();
} else {
    console.error('EMPRESA_ID não encontrado na sessão. Faça login novamente.');
}
