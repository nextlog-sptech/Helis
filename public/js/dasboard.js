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

// ===== Gráfico de barras: Fretes por estado =====
const estados = ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia'];
const fretesEstados = [156, 89, 42, 23];

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

new Chart(document.getElementById('fretesChart'), {
    type: 'bar',
    data: {
        labels: estados,
        datasets: [{
            label: 'Fretes',
            data: fretesEstados,
            backgroundColor: [corAzul, corAzul, corLaranja, corLaranja],
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
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
                max: 200,
                ticks: { stepSize: 50 },
                border: { display: false }
            },
            x: {
                grid: { display: false }
            }
        }
    },
    plugins: [valoresNasBarras]
});

// ===== Gráfico de rosca: Tipos de Baú =====
new Chart(document.getElementById('graficoRosca'), {
    type: 'doughnut',
    data: {
        labels: ['Alumínio', 'Sider'],
        datasets: [{
            data: [40, 60],
            backgroundColor: [corLaranja, corAzul],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
            legend: {
                display: false // a legenda é a do HTML, igual ao Figma
            },
            tooltip: {
                callbacks: {
                    label: function (item) {
                        return item.label + ': ' + item.raw + '%';
                    }
                }
            }
        }
    }
});

// ===== Gráfico de rosca: Fretes por Região =====
const regioes = ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'];
const fretesRegioes = [45, 22, 18, 10, 5];
// a 5ª cor (azul claro) não existe no global.css, por isso está em hex
const coresRegioes = [corAzul, corLaranja, corAzulEscuro, corCinza, '#66A9E0'];

// monta a legenda no mesmo formato da legenda do HTML
const legendaRegiao = document.getElementById('legendaRegiao');

regioes.forEach(function (regiao, i) {
    const item = document.createElement('div');
    item.className = 'legenda-item';

    const bolinha = document.createElement('span');
    bolinha.className = 'bolinha';
    bolinha.style.backgroundColor = coresRegioes[i];

    const texto = document.createElement('p');
    texto.textContent = regiao + ' (' + fretesRegioes[i] + '%)';

    item.appendChild(bolinha);
    item.appendChild(texto);
    legendaRegiao.appendChild(item);
});

new Chart(document.getElementById('graficoRegiao'), {
    type: 'doughnut',
    data: {
        labels: regioes,
        datasets: [{
            data: fretesRegioes,
            backgroundColor: coresRegioes,
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (item) {
                        return item.label + ': ' + item.raw + '%';
                    }
                }
            }
        }
    }
});

// ===== Gráfico de linha: Fretes por período =====
new Chart(document.getElementById('periodoChart'), {
    type: 'line',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        datasets: [{
            label: 'Fretes',
            data: [120, 185, 150, 210, 175, 240, 195],
            borderColor: corLaranja,
            backgroundColor: 'rgba(255, 120, 0, 0.12)', // área clara abaixo da linha
            fill: true,
            tension: 0, // linhas retas, como no Figma
            borderWidth: 2,
            pointRadius: 3,
            pointBorderWidth: 2,
            pointBackgroundColor: '#fff', // bolinha vazada
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
                min: 80,
                max: 250,
                // mostra só 100, 150, 200 e 250, mas o eixo começa em 80
                afterBuildTicks: function (scale) {
                    scale.ticks = [100, 150, 200, 250].map(function (value) {
                        return { value: value };
                    });
                },
                border: { display: false }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});