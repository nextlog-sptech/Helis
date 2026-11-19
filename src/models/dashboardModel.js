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
    // Conta os fretes de cada mês, considerando o mês atual e os (qtdMeses - 1) anteriores
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

module.exports = {
    buscarFretesPorEstado,
    buscarFretesPorPeriodo
};
