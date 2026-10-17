package sptech.school;

import java.time.LocalDateTime;

public class Log {
    private Integer idLog;
    private String tipo;
    private LocalDateTime horario;
    private String mensagem;
    private String servico;
    private Integer qtdRegistrosLidos;
    private Long tempoLeituraMs;

    public Log(LocalDateTime horario, Integer id, String mensagem, Integer qtdRegistrosLidos, String servico, Long tempoLeituraMs, String tipo) {
        this.horario = horario;
        this.idLog = id;
        this.mensagem = mensagem;
        this.qtdRegistrosLidos = qtdRegistrosLidos;
        this.servico = servico;
        this.tempoLeituraMs = tempoLeituraMs;
        this.tipo = tipo;
    }

    public Log(){

    }

    public LocalDateTime getHorario() {
        return horario;
    }

    public void setHorario(LocalDateTime horario) {
        this.horario = horario;
    }

    public Integer getId() {
        return idLog;
    }

    public void setId(Integer id) {
        this.idLog = id;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Integer getQtdRegistrosLidos() {
        return qtdRegistrosLidos;
    }

    public void setQtdRegistrosLidos(Integer qtdRegistrosLidos) {
        this.qtdRegistrosLidos = qtdRegistrosLidos;
    }

    public String getServico() {
        return servico;
    }

    public void setServico(String servico) {
        this.servico = servico;
    }

    public Long getTempoLeituraMs() {
        return tempoLeituraMs;
    }

    public void setTempoLeituraMs(Long tempoLeituraMs) {
        this.tempoLeituraMs = tempoLeituraMs;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    @Override
    public String toString() {
        return "Log{" +
                "horario=" + horario +
                ", id=" + idLog +
                ", tipo='" + tipo + '\'' +
                ", mensagem='" + mensagem + '\'' +
                ", servico='" + servico + '\'' +
                ", qtdRegistrosLidos=" + qtdRegistrosLidos +
                ", tempoLeituraMs=" + tempoLeituraMs +
                '}';
    }
}
