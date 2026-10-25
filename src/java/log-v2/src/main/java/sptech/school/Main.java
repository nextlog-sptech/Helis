package sptech.school;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;


public class Main {
    public static void main(String[] args) {

        Conexao conexao = new Conexao();

        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());

        Leitor leitor = new Leitor();
        Log log = leitor.lerPlanilhas("fFrete.xlsx");

        template.update("INSERT INTO log"+ "(tipo, horario, mensagem, servico,"+ "qtdRegistrosLidos, " +
                        "tempoLeituraMs)" + "VALUES (?,?,?,?,?,?)", log.getTipo(), log.getHorario(), log.getMensagem(),
                log.getServico(), log.getQtdRegistrosLidos(), log.getTempoLeituraMs());

        System.out.println("Log registrado");
    }
}