package sptech.school;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class Conexao {

    private DataSource conexao;

    public Conexao() {

        DriverManagerDataSource driver = new DriverManagerDataSource();

        driver.setUsername("");
        driver.setPassword("");
        driver.setUrl("jdbc:mysql://IP_PUBLICO_EC2:3306/projetopi");
        driver.setDriverClassName("com.mysql.cj.jdbc.Driver");
        this.conexao = driver;
    }
    public DataSource getConexao(){
        return this.conexao;
    }
}
