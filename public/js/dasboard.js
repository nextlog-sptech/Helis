const estilo = getComputedStyle(document.documentElement);
const corLaranja = estilo.getPropertyValue('--laranja').trim();
const corAzul = estilo.getPropertyValue('--azul').trim();

const ctxRosca = document.getElementById('graficoRosca');

new Chart(ctxRosca, {
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

const corAzulEscuro = estilo.getPropertyValue('--azulEscuro').trim();
const corCinza = estilo.getPropertyValue('--cinza').trim();

const regioes = ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'];
const fretesRegioes = [45, 22, 18, 10, 5];
const coresRegioes = [corAzul, corLaranja, corAzulEscuro, corCinza, '#66A9E0'];

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

const ctxRegiao = document.getElementById('graficoRegiao');

new Chart(ctxRegiao, {
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