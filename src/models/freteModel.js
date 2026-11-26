var database = require("../database/config");

function listar(empresaId) {
    console.log("ACESSEI O FRETE MODEL - listar");

    var instrucaoSql = `
        SELECT 
            f.idFrete AS id,
            f.docFiscal AS documento,
            f.dataFrete AS saida,
            DATE_ADD(f.dataFrete, INTERVAL 3 DAY) AS previsao,
            f.valorFrete AS valor,
            f.peso AS peso,
            f.valorMercadoria AS mercadoria,
            e.cidade AS origem,
            CONCAT(d.cidade, ' - ', d.uf) AS destino,
            d.nome AS destinatario,
            v.placa AS placa,
            v.marca AS marca,
            v.tipoVeiculo AS tipoVeiculo,
            v.bau AS bau,
            'Concluído' AS status
        FROM frete AS f
        JOIN veiculo AS v ON f.veiculoId = v.idVeiculo
        JOIN destinatario AS d ON f.destinatarioId = d.idDestinatario
        JOIN empresa AS emp ON f.idEmpresa = emp.idEmpresa
        JOIN endereco AS e ON emp.enderecoId = e.idEndereco
        WHERE f.idEmpresa = ?
        ORDER BY f.dataFrete DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId]);
}

function listarRecentes(empresaId, limite) {
    console.log("ACESSEI O FRETE MODEL - listarRecentes");

    var qtdLimite = Number(limite) || 6;
    var instrucaoSql = `
        SELECT 
            f.idFrete AS id,
            d.cidade AS destinoCidade,
            d.uf AS destinoUf,
            d.nome AS destinatario,
            CONCAT(v.marca, ' (', v.placa, ')') AS veiculo,
            v.bau AS bau,
            DATE_FORMAT(f.dataFrete, '%d/%m/%Y') AS dataFormatada,
            f.valorFrete AS valor
        FROM frete AS f
        JOIN veiculo AS v ON f.veiculoId = v.idVeiculo
        JOIN destinatario AS d ON f.destinatarioId = d.idDestinatario
        WHERE f.idEmpresa = ?
        ORDER BY f.dataFrete DESC
        LIMIT ?;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [empresaId, qtdLimite]);
}

module.exports = {
    listar,
    listarRecentes
};
