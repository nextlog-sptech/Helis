package sptech.school;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class Leitor {
    public Log lerPlanilhas(String nomeArquivo){

        Log log = new Log();
        Long inicio = System.nanoTime();
        Integer qtdRegistrosLidos = 0;

        try(
                InputStream arquivo = new FileInputStream(nomeArquivo);
                Workbook workbook = new XSSFWorkbook(arquivo);
                ){

            System.out.printf("Iniciando leitura do arquivo %s%n", nomeArquivo);

            Sheet sheet = workbook.getSheetAt(0);

            for(Row row : sheet){
                if(row.getRowNum() == 0){
                    System.out.println("Lendo cabeçalho");
                    continue;
                }
                qtdRegistrosLidos++;

                System.out.println("Lendo linha " + row.getRowNum());

            }

            Long fim = System.nanoTime();
            Long tempoLeituraMs = (fim-inicio)/ 1_000_000;

            log.setTipo("INFO");
            log.setHorario(LocalDateTime.now());
            log.setMensagem("Leitura concluida com sucesso");
            log.setServico("LEITURA");
            log.setQtdRegistrosLidos(qtdRegistrosLidos);
            log.setTempoLeituraMs(tempoLeituraMs);

            System.out.println("Leitura finalizada");
            System.out.println(log);

        } catch (Exception e) {
            Long fim = System.nanoTime();
            Long tempoLeituraMs = (fim-inicio)/ 1_000_000;

            log.setTipo("ERRO");
            log.setHorario(LocalDateTime.now());
            log.setMensagem("Falha na leitura");
            log.setServico("LEITURA");
            log.setQtdRegistrosLidos(qtdRegistrosLidos);
            log.setTempoLeituraMs(tempoLeituraMs);

            System.out.println(log);

        }
        return log;
    }

}
