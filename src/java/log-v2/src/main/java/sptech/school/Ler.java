package sptech.school;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.core.JdbcTemplate;
import sptech.school.tabelas.Cliente;
import sptech.school.tabelas.Frete;
import sptech.school.tabelas.KmRodado;
import sptech.school.tabelas.Veiculo;
import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Ler {

    public void lerArquivo() {
        try {
            File arquivo = new File("base.xlsx");

            try (Workbook workbook = new XSSFWorkbook(arquivo)) {
                System.out.printf("Iniciando leitura do arquivo %s%n", "teste");
                List<Veiculo> veiculos =montarVeiculos(workbook.getSheetAt(0));
                List<Cliente> clientes =montarClientes(workbook.getSheetAt(1));
                List<Frete> fretes = montarFretes(workbook.getSheetAt(2));
                List<KmRodado> kmRodados =montarKmRodado(workbook.getSheetAt(3));

                ExportacaoDAO exportar = new ExportacaoDAO(fretes,clientes,kmRodados,veiculos);
                exportar.inserirDados();
            }

        } catch (Exception e) {
            System.out.println(e);
        }
    }
    public List<Veiculo> montarVeiculos(Sheet planilha) {
        System.out.println("lendo veiculos");
        List<Veiculo> lista = new ArrayList<>();

        try {
            for (Row registro : planilha) {
                if (registro.getRowNum() == 0) {
                    continue;
                }
                String placa = registro.getCell(1).getStringCellValue();
                String marca = registro.getCell(2).getStringCellValue();
                String tipo = registro.getCell(3).getStringCellValue();
                String bau = registro.getCell(4).getStringCellValue();
                Veiculo veiculo = new Veiculo(placa, marca, tipo, bau, 1);
                lista.add(veiculo);
            }
        } catch (Exception e) {
            System.out.println("Erro ao ler veiculos: " + e);
        }

        return lista;
    }

    public List<Cliente> montarClientes(Sheet planilha) {
        System.out.println("lendo clientes");
        List<Cliente> lista = new ArrayList<>();

        try {
            for (Row registro : planilha) {
                if (registro.getRowNum() == 0) {
                    continue;
                }

                String cidade = registro.getCell(1).getStringCellValue();
                String uf = registro.getCell(2).getStringCellValue();
                Cliente cliente = new Cliente(cidade, uf);
                lista.add(cliente);
            }
        } catch (Exception e) {
            System.out.println("Erro ao ler clientes: " + e);
        }

        return lista;
    }

    public List<KmRodado> montarKmRodado(Sheet planilha) {
        System.out.println("lendo kms");

        List<KmRodado> lista = new ArrayList<>();

        try {
            for (Row registro : planilha) {
                if (registro.getRowNum() == 0) {
                    continue;
                }

                Integer idVeiculo = (int) registro.getCell(1).getNumericCellValue();
                Integer kmPercorrido = (int) registro.getCell(2).getNumericCellValue();
                BigDecimal gastoCombustivel = BigDecimal.valueOf(registro.getCell(3).getNumericCellValue());
                Integer manutencao = (int) registro.getCell(4).getNumericCellValue();
                Integer custos = (int) registro.getCell(5).getNumericCellValue();

                KmRodado kmRodado = new KmRodado(
                        idVeiculo, kmPercorrido, gastoCombustivel, manutencao, custos
                );

                lista.add(kmRodado);
            }
        } catch (Exception e) {
            System.out.println("Erro ao ler kms: " + e);
        }

        return lista;
    }

    public List<Frete> montarFretes(Sheet planilha) {
        System.out.println("lendo fretes");

        List<Frete> lista = new ArrayList<>();

        try {
            for (Row registro : planilha) {
                if (registro.getRowNum() == 0) {
                    continue;
                }

                Integer idEmpresa = 1;
                LocalDate dataFrete = registro.getCell(0)
                        .getLocalDateTimeCellValue().toLocalDate();
                Integer destinatarioId = (int) registro.getCell(1).getNumericCellValue();
                Integer veiculoId = (int) registro.getCell(2).getNumericCellValue();
                Integer docFiscal = (int) registro.getCell(3).getNumericCellValue();
                Double valorFrete = registro.getCell(5).getNumericCellValue();
                Double peso = registro.getCell(6).getNumericCellValue();
                Double valorMercadoria = registro.getCell(7).getNumericCellValue();

                Frete frete = new Frete(
                        idEmpresa, veiculoId, docFiscal, dataFrete,
                        valorFrete, peso, valorMercadoria, destinatarioId
                );

                lista.add(frete);
            }
        } catch (Exception e) {
            System.out.println("Erro ao ler fretes: " + e);
        }

        return lista;
    }
}
