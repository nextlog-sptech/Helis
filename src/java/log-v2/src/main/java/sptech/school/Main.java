package sptech.school;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;


public class Main {
    public static void main(String[] args) {


        System.out.println("Log registrado");
        Ler leitor = new Ler();
        leitor.lerArquivo();

    }
}
//
//        Leitor leitor = new Leitor();
//        Log log = leitor.lerPlanilhas("fFrete.xlsx");
//
//        if ("ERRO".equals(log.getTipo())) {
//            new SlackNotificador().notificarErro(log);
//        }