// Trocar o array "veiculos" pela chamada à API/localStorage do projeto quando existir.

const veiculos = [
  { nome: 'Volvo Vax2', placa: 'VTA2R41', frete: 5021, viagens: 67, km: 500, tipo: 'Caminhão', bau: 'Alumínio', status: 'ativo', marca: 'Volvo', modelo: 'Vax2' },
  { nome: 'Volvo Vax2', placa: 'VTA2R42', frete: 5021, viagens: 67, km: 500, tipo: 'Caminhão', bau: 'Alumínio', status: 'ativo', marca: 'Volvo', modelo: 'Vax2' },
  { nome: 'Scania R450', placa: 'BRA3F19', frete: 4310, viagens: 52, km: 1200, tipo: 'Caminhão', bau: 'Sider', status: 'ativo', marca: 'Scania', modelo: 'R450' },
  { nome: 'Mercedes Actros', placa: 'QWE1A23', frete: 3980, viagens: 41, km: 870, tipo: 'Caminhão', bau: 'Alumínio', status: 'manutencao', marca: 'Mercedes', modelo: 'Actros' },
  { nome: 'Volvo FH 540', placa: 'XYZ9K88', frete: 6120, viagens: 80, km: 2300, tipo: 'Caminhão', bau: 'Frigorífico', status: 'inativo', marca: 'Volvo', modelo: 'FH 540' },
  { nome: 'Scania R450', placa: 'JKL4M55', frete: 2750, viagens: 29, km: 640, tipo: 'Caminhão', bau: 'Sider', status: 'ativo', marca: 'Scania', modelo: 'R450' },
];

const IMAGEM_CAMINHAO = 'assets/imgs/veiculo.png';

const el = {
  form: document.getElementById('form-filtros'),
  busca: document.getElementById('busca-placa'),
  status: document.getElementById('filtro-status'),
  marca: document.getElementById('filtro-marca'),
  modelo: document.getElementById('filtro-modelo'),
  limpar: document.getElementById('btn-limpar'),
  lista: document.getElementById('lista-veiculos'),
  qtd: document.getElementById('quantidade'),
  vazio: document.getElementById('sem-resultado'),
};

function escapar(texto) {
  const d = document.createElement('div');
  d.textContent = texto;
  return d.innerHTML;
}

function preencherSelect(select, valores) {
  [...new Set(valores)].sort().forEach(v => {
    const op = document.createElement('option');
    op.value = v;
    op.textContent = v;
    select.appendChild(op);
  });
}

function criarCard(v) {
  return `
    <article class="card-veiculo">
      <h3 class="nome">${escapar(v.nome)}</h3>
      <span class="placa">Placa: ${escapar(v.placa)}</span>
      <div class="info">
        <div class="item frete"><small>Frete</small><strong>${v.frete}</strong></div>
        <div class="item"><small>Viagens</small><strong>${v.viagens}</strong></div>
        <div class="divisor"></div>
        <div class="item"><small>KM rodado</small><strong>${v.km}</strong></div>
        <div class="divisor"></div>
        <div class="item"><small>Tipo Veículo</small><strong>${escapar(v.tipo)}</strong></div>
        <div class="item"><small>Tipo Baú</small><strong>${escapar(v.bau)}</strong></div>
      </div>
      <img class="imagem" src="${IMAGEM_CAMINHAO}" alt="Caminhão ${escapar(v.nome)}">
    </article>`;
}

function renderizar() {
  const termo = el.busca.value.trim().toLowerCase();
  const filtrados = veiculos.filter(v =>
    (!termo || v.placa.toLowerCase().includes(termo)) &&
    (!el.status.value || v.status === el.status.value) &&
    (!el.marca.value || v.marca === el.marca.value) &&
    (!el.modelo.value || v.modelo === el.modelo.value)
  );

  el.lista.innerHTML = filtrados.map(criarCard).join('');
  el.qtd.textContent = filtrados.length;
  el.vazio.hidden = filtrados.length > 0;
}

preencherSelect(el.marca, veiculos.map(v => v.marca));
preencherSelect(el.modelo, veiculos.map(v => v.modelo));

el.form.addEventListener('submit', e => {
  e.preventDefault();
  renderizar();
});

el.limpar.addEventListener('click', () => {
  el.form.reset();
  renderizar();
});

renderizar();