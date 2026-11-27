package sptech.school;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.format.DateTimeFormatter;

public class         SlackNotificador {

    private static final DateTimeFormatter FORMATO_HORARIO = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    private final String webhookUrl;
    private final HttpClient cliente;

    public SlackNotificador() {
        this(System.getenv("SLACK_WEBHOOK_URL"));
    }

    public SlackNotificador(String webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.cliente = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public void notificarErro(Log log) {
        if (webhookUrl == null || webhookUrl.isBlank()) {
            System.out.println("SLACK_WEBHOOK_URL não configurada, notificação do Slack não enviada");
            return;
        }

        String texto = ":rotating_light: *Erro no Helis*\n"
                + "*Serviço:* " + log.getServico() + "\n"
                + "*Mensagem:* " + log.getMensagem() + "\n"
                + "*Horário:* " + (log.getHorario() != null ? log.getHorario().format(FORMATO_HORARIO) : "-") + "\n"
                + "*Registros lidos:* " + log.getQtdRegistrosLidos() + "\n"
                + "*Tempo de leitura:* " + log.getTempoLeituraMs() + " ms";

        String corpo = "{\"text\":\"" + escaparJson(texto) + "\"}";

        try {
            HttpRequest requisicao = HttpRequest.newBuilder(URI.create(webhookUrl))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json; charset=utf-8")
                    .POST(HttpRequest.BodyPublishers.ofString(corpo))
                    .build();

            HttpResponse<String> resposta = cliente.send(requisicao, HttpResponse.BodyHandlers.ofString());

            if (resposta.statusCode() == 200) {
                System.out.println("Notificação de erro enviada ao Slack");
            } else {
                System.out.println("Slack recusou a notificação: HTTP " + resposta.statusCode() + " - " + resposta.body());
            }
        } catch (Exception e) {
            System.out.println("Falha ao enviar notificação ao Slack: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()));
        }
    }

    private String escaparJson(String texto) {
        StringBuilder sb = new StringBuilder();
        for (char c : texto.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.toString();
    }
}
