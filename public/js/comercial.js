const estilo = getComputedStyle(document.documentElement);
const corAzul = estilo.getPropertyValue('--azul').trim();
const corAzulEscuro = estilo.getPropertyValue('--azulEscuro').trim();
const corLaranja = estilo.getPropertyValue('--laranja').trim();
const corAmarelo = '#FFCC00';
const corVerdeAgua = '#2A8A94';

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#7b8194';

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'];
const faturamentoMeses = [158, 46, 90, 95, 155, 160, 156, 96, 156];

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

new Chart(document.getElementById('faturamentoChart'), {
    type: 'bar',
    data: {
        labels: meses,
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
        plugins: {
            legend: { display: false }
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

function criarRosca(idCanvas, idLegenda, nomes, valores, cores, formatarTooltip) {
    const legenda = document.getElementById(idLegenda);

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
                            return item.label + ': ' + formatarTooltip(item.raw);
                        }
                    }
                }
            }
        }
    });
}

criarRosca(
    'faixaChart',
    'legendaFaixa',
    ['Até 5 mil', '5-20 mil', '20-50 mil', 'Acima de 50 mil'],
    [22, 22, 26, 30],
    [corLaranja, corAmarelo, corAzulEscuro, corVerdeAgua],
    function (valor) {
        return valor + ' fretes';
    }
);

criarRosca(
    'clienteChart',
    'legendaCliente',
    ['Magazine Luiza', 'Carrefour Brasil', 'Via Varejo', 'Ambev S.A.', 'Mercado Livre'],
    [35000, 22000, 20000, 15000, 8000],
    [corLaranja, corAmarelo, corAzulEscuro, corVerdeAgua, corAzul],
    function (valor) {
        return 'R$ ' + valor.toLocaleString('pt-BR');
    }
);