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

function buscarFretesPorFaixa(empresaId, ano, mes) {
    var instrucaoSql = `
        SELECT
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
          AND MONTH(dataFrete) = ?
        GROUP BY faixa;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId, ano, mes]);
}

function buscarTopClientes(empresaId, ano, mes) {
    var instrucaoSql = `
        SELECT d.nome, COALESCE(SUM(f.valorFrete), 0) AS receita
        FROM frete AS f
        JOIN destinatario AS d ON d.idDestinatario = f.destinatarioId
        WHERE f.idEmpresa = ?
          AND YEAR(f.dataFrete) = ?
          AND MONTH(f.dataFrete) = ?
        GROUP BY d.idDestinatario, d.nome
        ORDER BY receita DESC
        LIMIT 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId, ano, mes]);
}

function buscarGastoPorVeiculo(empresaId, marca, tipoVeiculo) {
    var parametros = [empresaId];
    var filtros = "";

    if (marca) {
        filtros += " AND v.marca = ?";
        parametros.push(marca);
    }
    if (tipoVeiculo) {
        filtros += " AND v.tipoVeiculo = ?";
        parametros.push(tipoVeiculo);
    }

    var instrucaoSql = `
        SELECT v.idVeiculo, v.placa, v.marca, v.tipoVeiculo, ${SOMA_GASTOS} AS gastoTotal
        FROM veiculo AS v
        LEFT JOIN kmrodado AS k ON k.idVeiculo = v.idVeiculo
        WHERE v.empresaId = ?${filtros}
        GROUP BY v.idVeiculo, v.placa, v.marca, v.tipoVeiculo
        ORDER BY gastoTotal DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, parametros);
}

function buscarFiltrosVeiculo(empresaId) {
    var instrucaoSql = `
        SELECT DISTINCT marca, tipoVeiculo
        FROM veiculo
        WHERE empresaId = ?
        ORDER BY marca, tipoVeiculo;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId]);
}

module.exports = {
    buscarKpis,
    buscarFaturamentoMensal,
    buscarFretesPorFaixa,
    buscarTopClientes,
    buscarGastoPorVeiculo,
    buscarFiltrosVeiculo
};
