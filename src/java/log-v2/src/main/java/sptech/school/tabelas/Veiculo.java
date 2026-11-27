package sptech.school.tabelas;

public class Veiculo {

    private String placa;
    private String marca;
    private String tipoVeiculo;
    private String bau;
    private Integer empresaId;

    public Veiculo(String placa, String marca, String tipoVeiculo, String bau, Integer empresaId) {
        this.placa = placa;
        this.marca = marca;
        this.tipoVeiculo = tipoVeiculo;
        this.bau = bau;
        this.empresaId = empresaId;
    }

    public String getPlaca() {
        return placa;
    }

    public String getMarca() {
        return marca;
    }

    public String getTipoVeiculo() {
        return tipoVeiculo;
    }

    public String getBau() {
        return bau;
    }

    public Integer getEmpresaId() {
        return empresaId;
    }
}