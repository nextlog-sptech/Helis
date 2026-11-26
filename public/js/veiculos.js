// Trocar o array "veiculos" pela chamada à API/localStorage do projeto quando existir.

const veiculos = [
  { nome: 'Volvo Vax2', placa: 'VTA2R41', frete: 5021, viagens: 67, km: 500, tipo: 'Caminhão', bau: 'Alumínio', marca: 'Volvo' },
  { nome: 'Volvo Vax2', placa: 'VTA2R42', frete: 5021, viagens: 67, km: 500, tipo: 'Caminhão', bau: 'Alumínio', marca: 'Volvo' },
  { nome: 'Scania R450', placa: 'BRA3F19', frete: 4310, viagens: 52, km: 1200, tipo: 'Caminhão', bau: 'Sider', marca: 'Scania' },
  { nome: 'Mercedes Actros', placa: 'QWE1A23', frete: 3980, viagens: 41, km: 870, tipo: 'Caminhão', bau: 'Alumínio', marca: 'Mercedes' },
  { nome: 'Volvo FH 540', placa: 'XYZ9K88', frete: 6120, viagens: 80, km: 2300, tipo: 'Caminhão', bau: 'Frigorífico', marca: 'Volvo' },
  { nome: 'Scania R450', placa: 'JKL4M55', frete: 2750, viagens: 29, km: 640, tipo: 'Caminhão', bau: 'Sider', marca: 'Scania' },
];

const ICONE_CAMINHAO = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M2 6.5A1.5 1.5 0 0 1 3.5 5h9A1.5 1.5 0 0 1 14 6.5V16H2z"/>
    <path d="M14 9h4l3 3.5V16h-7z"/>
    <circle cx="7" cy="17.5" r="2"/>
    <circle cx="17" cy="17.5" r="2"/>
  </svg>`;

const el = {
  form: document.getElementById('form-filtros'),
  busca: document.getElementById('busca-placa'),
  marca: document.getElementById('filtro-marca'),
  limpar: document.getElementById('btn-limpar'),
  lista: document.getElementById('lista-veiculos'),
  qtd: document.getElementById('quantidade'),
  vazio: document.getElementById('sem-resultado'),
};

function escapar(texto) {
  const d = document.createElement('div');
  d.textContent = texto == null ? '' : String(texto);
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

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarKm(valor) {
  return Number(valor).toLocaleString('pt-BR') + ' km';
}

function criarCard(v) {
  return `
    <article class="card-veiculo">
      <div class="card-topo">
        <div class="icone">${ICONE_CAMINHAO}</div>
        <div class="identificacao">
          <h3 class="nome">${escapar(v.nome)}</h3>
          <span class="marca">${escapar(v.marca)}</span>
        </div>
        <span class="placa">${escapar(v.placa)}</span>
      </div>

      <div class="frete">
        <small>Frete</small>
        <strong>${formatarMoeda(v.frete)}</strong>
      </div>

      <div class="metricas">
        <div class="metrica"><small>Viagens</small><strong>${v.viagens}</strong></div>
        <div class="metrica"><small>KM rodado</small><strong>${formatarKm(v.km)}</strong></div>
      </div>

      <div class="tags">
        <span class="tag"><small>Veículo</small>${escapar(v.tipo)}</span>
        <span class="tag"><small>Baú</small>${escapar(v.bau)}</span>
      </div>
    </article>`;
}

function renderizar() {
  const termo = el.busca.value.trim().toLowerCase();
  const filtrados = veiculos.filter(v =>
    (!termo || v.placa.toLowerCase().includes(termo)) &&
    (!el.marca.value || v.marca === el.marca.value)
  );

  el.lista.innerHTML = filtrados.map(criarCard).join('');
  el.qtd.textContent = filtrados.length;
  el.vazio.hidden = filtrados.length > 0;
}

preencherSelect(el.marca, veiculos.map(v => v.marca));

el.form.addEventListener('submit', e => {
  e.preventDefault();
  renderizar();
});

el.limpar.addEventListener('click', () => {
  el.form.reset();
  renderizar();
});

renderizar();