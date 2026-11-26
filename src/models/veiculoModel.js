var database = require("../database/config");

function listar(empresaId) {
    console.log("ACESSEI O VEICULO MODEL - listar");

    
    var instrucaoSql = `
        SELECT
            v.idVeiculo AS id,
            v.placa AS placa,
            v.marca AS marca,
            CONCAT_WS(' ', v.marca, v.tipoVeiculo) AS nome,
            v.tipoVeiculo AS tipo,
            v.bau AS bau,
            COALESCE(f.totalFrete, 0) AS frete,
            COALESCE(f.viagens, 0) AS viagens,
            COALESCE(k.totalKm, 0) AS km
        FROM veiculo AS v
        LEFT JOIN (
            SELECT veiculoId, SUM(valorFrete) AS totalFrete, COUNT(idFrete) AS viagens
            FROM frete
            GROUP BY veiculoId
        ) AS f ON f.veiculoId = v.idVeiculo
        LEFT JOIN (
            SELECT idVeiculo, SUM(kmPercorrido) AS totalKm
            FROM kmrodado
            GROUP BY idVeiculo
        ) AS k ON k.idVeiculo = v.idVeiculo
        WHERE v.empresaId = ?
        ORDER BY v.placa;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId]);
}

module.exports = {
    listar
};