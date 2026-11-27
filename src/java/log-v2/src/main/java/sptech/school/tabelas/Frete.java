package sptech.school.tabelas;

import java.time.LocalDate;

public class Frete {

    private Integer idEmpresa;
    private Integer veiculoId;
    private Integer docFiscal;
    private LocalDate dataFrete;
    private Double valorFrete;
    private Double peso;
    private Double valorMercadoria;
    private Integer destinatarioId;

    public Frete(Integer idEmpresa, Integer veiculoId,
                 Integer docFiscal, LocalDate dataFrete, Double valorFrete,
                 Double peso, Double valorMercadoria, Integer destinatarioId) {

        this.idEmpresa = idEmpresa;
        this.veiculoId = veiculoId;
        this.docFiscal = docFiscal;
        this.dataFrete = dataFrete;
        this.valorFrete = valorFrete;
        this.peso = peso;
        this.valorMercadoria = valorMercadoria;
        this.destinatarioId = destinatarioId;
    }


    public Integer getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(Integer idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public Integer getVeiculoId() {
        return veiculoId;
    }

    public void setVeiculoId(Integer veiculoId) {
        this.veiculoId = veiculoId;
    }

    public Integer getDocFiscal() {
        return docFiscal;
    }

    public void setDocFiscal(Integer docFiscal) {
        this.docFiscal = docFiscal;
    }

    public LocalDate getDataFrete() {
        return dataFrete;
    }

    public void setDataFrete(LocalDate dataFrete) {
        this.dataFrete = dataFrete;
    }

    public Double getValorFrete() {
        return valorFrete;
    }

    public void setValorFrete(Double valorFrete) {
        this.valorFrete = valorFrete;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public Double getValorMercadoria() {
        return valorMercadoria;
    }

    public void setValorMercadoria(Double valorMercadoria) {
        this.valorMercadoria = valorMercadoria;
    }

    public Integer getDestinatarioId() {
        return destinatarioId;
    }

    public void setDestinatarioId(Integer destinatarioId) {
        this.destinatarioId = destinatarioId;
    }
}