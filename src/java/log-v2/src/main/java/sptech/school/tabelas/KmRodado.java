package sptech.school.tabelas;

import java.math.BigDecimal;

public class KmRodado {

    private Integer idVeiculo;
    private Integer kmPercorrido;
    private BigDecimal gastoCombustivel;
    private Integer manutencao;
    private Integer custos;

    public KmRodado(Integer idVeiculo, Integer kmPercorrido, BigDecimal gastoCombustivel, Integer manutencao, Integer custos) {
        this.idVeiculo = idVeiculo;
        this.kmPercorrido = kmPercorrido;
        this.gastoCombustivel = gastoCombustivel;
        this.manutencao = manutencao;
        this.custos = custos;
    }

    public Integer getIdVeiculo() {
        return idVeiculo;
    }

    public Integer getKmPercorrido() {
        return kmPercorrido;
    }

    public BigDecimal getGastoCombustivel() {
        return gastoCombustivel;
    }

    public Integer getManutencao() {
        return manutencao;
    }

    public Integer getCustos() {
        return custos;
    }
}