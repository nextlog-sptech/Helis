package sptech.school;
import org.springframework.jdbc.core.JdbcTemplate;
import sptech.school.tabelas.Cliente;
import sptech.school.tabelas.Frete;
import sptech.school.tabelas.KmRodado;
import sptech.school.tabelas.Veiculo;

import java.util.List;

public class ExportacaoDAO {
    private List<Frete> fretes;
    private List<Cliente> clientes;
    private List<KmRodado> kms;
    private List<Veiculo> veiculos;

    public ExportacaoDAO(List<Frete> fretes, List<Cliente> clientes, List<KmRodado> kms, List<Veiculo> veiculos) {
        this.fretes = fretes;
        this.clientes = clientes;
        this.kms = kms;
        this.veiculos = veiculos;
    }


    public String inserirDados(){
        System.out.println("teste");
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());
        System.out.println(this.veiculos);
        try {
            String sql = """
        INSERT INTO veiculo (placa, marca, tipoVeiculo, bau, empresaId)
        VALUES (?, ?, ?, ?, ?);
        """;

            template.batchUpdate(sql, this.veiculos, this.veiculos.size(),
                    (ps, v) -> {
                        ps.setString(1, v.getPlaca());
                        ps.setString(2, v.getMarca());
                        ps.setString(3, v.getTipoVeiculo());
                        ps.setString(4, v.getBau());
                        ps.setInt(5, v.getEmpresaId());
                    });
        } catch (Exception e) {
            System.out.println("Erro ao inserir veículos: " + e);
        }


        try {
            String sql = """
        INSERT INTO destinatario (cidade, uf)
        VALUES (?, ?);
        """;

            template.batchUpdate(sql, this.clientes, this.clientes.size(),
                    (ps, c) -> {
                        ps.setString(1, c.getCidade());
                        ps.setString(2, c.getUf());
                    });
        } catch (Exception e) {
            System.out.println("Erro ao inserir clientes: " + e);
        }

        try {
            String sql = """
        INSERT INTO kmrodado (idVeiculo, kmPercorrido, gastoCombustivel, manutencao, custos)
        VALUES (?, ?, ?, ?, ?);
        """;

            template.batchUpdate(sql, this.kms, this.kms.size(),
                    (ps, k) -> {
                        ps.setInt(1, k.getIdVeiculo());
                        ps.setInt(2, k.getKmPercorrido());
                        ps.setBigDecimal(3, k.getGastoCombustivel());
                        ps.setInt(4, k.getManutencao());
                        ps.setInt(5, k.getCustos());
                    });
        } catch (Exception e) {
            System.out.println("Erro ao inserir kms: " + e);
        }

        try {
            String sql = """
        INSERT INTO frete (idEmpresa, veiculoId, docFiscal, dataFrete, valorFrete, peso, valorMercadoria, destinatarioId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """;

            template.batchUpdate(sql, this.fretes, this.fretes.size(),
                    (ps, f) -> {
                        ps.setInt(1, f.getIdEmpresa());
                        ps.setInt(2, f.getVeiculoId());
                        ps.setInt(3, f.getDocFiscal());
                        ps.setDate(4, java.sql.Date.valueOf(f.getDataFrete()));
                        ps.setDouble(5, f.getValorFrete());
                        ps.setDouble(6, f.getPeso());
                        ps.setDouble(7, f.getValorMercadoria());
                        ps.setInt(8, f.getDestinatarioId());
                    });
        } catch (Exception e) {
            System.out.println("Erro ao inserir fretes: " + e);
        }
        return "a";
    }
}
