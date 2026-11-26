var database = require("../database/config");

function buscarFretesPorEstado(empresaId) {
  var instrucaoSql = `
        SELECT d.uf, COUNT(f.idFrete) AS qtdFretes
        FROM frete AS f
        JOIN destinatario AS d ON d.idDestinatario = f.destinatarioId
        WHERE f.idEmpresa = ?
        GROUP BY d.uf
        ORDER BY qtdFretes DESC
        LIMIT 4;
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql, [empresaId]);
}

function buscarFretesPorPeriodo(empresaId, qtdMeses) {
  var instrucaoSql = `
        SELECT DATE_FORMAT(dataFrete, '%Y-%m') AS mes, COUNT(idFrete) AS qtdFretes
        FROM frete
        WHERE idEmpresa = ?
          AND dataFrete >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH)
          AND dataFrete <= CURDATE()
        GROUP BY DATE_FORMAT(dataFrete, '%Y-%m')
        ORDER BY mes;
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql, [empresaId, qtdMeses - 1]);
}
const formatarBRL = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

async function kpis(empresaId) {
  try {
    const id = Number(empresaId);
    if (!Number.isInteger(id)) throw new Error("empresaId inválido");

    const query1 = `
      SELECT AVG(valorFrete) AS ticketMedio
      FROM frete
      WHERE idEmpresa = ${id};`;

    const query2 = `
      SELECT SUM(k.manutencao) AS custoManutencao
      FROM kmrodado k
      INNER JOIN veiculo v ON k.idVeiculo = v.idVeiculo
      WHERE v.empresaId = ${id};`;

    const query3 = `SELECT * FROM usuario LIMIT 1;`;

    const [res1, res2, kpi3] = await Promise.all([
      database.executar(query1),
      database.executar(query2),
      database.executar(query3),
    ]);

    const tmedio = formatarBRL(res1[0]?.ticketMedio);
    const custo = formatarBRL(res2[0]?.custoManutencao);

    return [tmedio, custo, kpi3];
  } catch (e) {
    console.log(e);
    throw e; // deixa o controller decidir o que responder
  }
}
module.exports = {
  buscarFretesPorEstado,
  buscarFretesPorPeriodo,
  kpis,
};
