var database = require("../database/config");

// Despesa de um registro de km rodado = combustível + manutenção + outros custos
var SOMA_GASTOS = "COALESCE(SUM(k.gastoCombustivel + k.manutencao + k.custos), 0)";

function buscarKpis(empresaId) {
    var instrucaoSql = `
        SELECT
            (SELECT COALESCE(SUM(valorFrete), 0) FROM frete WHERE idEmpresa = ?) AS receitaBruta,
            (SELECT COUNT(idFrete) FROM frete WHERE idEmpresa = ?) AS qtdFretes,
            (SELECT ${SOMA_GASTOS}
                FROM kmrodado AS k
                JOIN veiculo AS v ON v.idVeiculo = k.idVeiculo
                WHERE v.empresaId = ?) AS despesas;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId, empresaId, empresaId]);
}

function buscarFaturamentoMensal(empresaId, ano) {
    var instrucaoSql = `
        SELECT MONTH(dataFrete) AS mes, COALESCE(SUM(valorFrete), 0) AS faturamento
        FROM frete
        WHERE idEmpresa = ? AND YEAR(dataFrete) = ?
        GROUP BY MONTH(dataFrete)
        ORDER BY mes;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId, ano]);
}

// Traz o ano inteiro de uma vez, separado por mês; o filtro de mês é feito no front-end
function buscarFretesPorFaixa(empresaId, ano) {
    var instrucaoSql = `
        SELECT
            MONTH(dataFrete) AS mes,
            CASE
                WHEN valorFrete <= 5000 THEN 'Até 5 mil'
                WHEN valorFrete <= 20000 THEN '5-20 mil'
                WHEN valorFrete <= 50000 THEN '20-50 mil'
                ELSE 'Acima de 50 mil'
            END AS faixa,
            COUNT(idFrete) AS qtdFretes
        FROM frete
        WHERE idEmpresa = ?
          AND valorFrete IS NOT NULL
          AND YEAR(dataFrete) = ?
        GROUP BY mes, faixa
        ORDER BY mes;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId, ano]);
}

// Receita de cada cliente em cada mês do ano; o top 5 do mês é montado no front-end
function buscarReceitaPorCliente(empresaId, ano) {
    var instrucaoSql = `
        SELECT MONTH(f.dataFrete) AS mes, d.nome, COALESCE(SUM(f.valorFrete), 0) AS receita
        FROM frete AS f
        JOIN destinatario AS d ON d.idDestinatario = f.destinatarioId
        WHERE f.idEmpresa = ?
          AND YEAR(f.dataFrete) = ?
        GROUP BY mes, d.idDestinatario, d.nome
        ORDER BY mes, receita DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId, ano]);
}

// Traz todos os veículos de uma vez; os filtros de marca e modelo são feitos no front-end
function buscarGastoPorVeiculo(empresaId) {
    var instrucaoSql = `
        SELECT v.idVeiculo, v.placa, v.marca, v.tipoVeiculo, ${SOMA_GASTOS} AS gastoTotal
        FROM veiculo AS v
        LEFT JOIN kmrodado AS k ON k.idVeiculo = v.idVeiculo
        WHERE v.empresaId = ?
        GROUP BY v.idVeiculo, v.placa, v.marca, v.tipoVeiculo
        ORDER BY gastoTotal DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId]);
}

module.exports = {
    buscarKpis,
    buscarFaturamentoMensal,
    buscarFretesPorFaixa,
    buscarReceitaPorCliente,
    buscarGastoPorVeiculo
};
