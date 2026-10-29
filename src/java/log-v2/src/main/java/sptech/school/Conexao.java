package sptech.school;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

public class Conexao {

    private DataSource conexao;

    public Conexao() {

        DriverManagerDataSource driver = new DriverManagerDataSource();

        driver.setUsername("root");
        driver.setPassword("Finsacademicos29@");
        driver.setUrl("jdbc:mysql://localhost:3306/projetopi");
        driver.setDriverClassName("com.mysql.cj.jdbc.Driver");
        this.conexao = driver;
    }
    public DataSource getConexao(){
        return this.conexao;
    }
}
