create database if not exists helis;
use helis;

create table endereco(
    idEndereco int primary key auto_increment,
    cep char(8) NOT NULL,
    numero varchar(5) NOT NULL,
    logradouro varchar(45) NOT NULL,
    complemento varchar(45) ,
    bairro varchar(45) NOT NULL,
    cidade varchar(45 ) NOT NULL
);

create table empresa(
    idEmpresa int primary key auto_increment,
    razao varchar(45) NOT NULL,
    cnpj char(14) UNIQUE NOT NULL,
    nomeFant varchar(45) NOT NULL,
    email varchar(60) NOT NULL UNIQUE ,
    telefone char(11) NOT NULL UNIQUE,
    enderecoId int NOT NULL,
    constraint fkEnderecoEmpresa
        foreign key(enderecoId)
            references endereco(idEndereco)
);

create table usuario(
    idUsuario int primary key auto_increment,
    cpf char(11) NOT NULL UNIQUE,
    nome varchar(45) NOT NULL,
    email varchar(60) NOT NULL UNIQUE,
    telefone char(11) NOT NULL UNIQUE ,
    adm boolean NOT NULL,
    senha varchar(255) NOT NULL,
    empresaId int NOT NULL,
    constraint fkUsuarioEmpresa
        foreign key(empresaId)
            references empresa(idEmpresa)
);

create table veiculo(
    idVeiculo int primary key auto_increment ,
    placa varchar(15) NOT NULL UNIQUE,
    marca varchar(45) NOT NULL,
    tipoVeiculo varchar(45),
    bau varchar(30),
    empresaId int NOT NULL,
    constraint fkVeiculoEmpresa
        foreign key(empresaId)
            references empresa(idEmpresa)
);

create table destinatario(
    idDestinatario int primary key auto_increment,
    cpf char(11) NOT NULL UNIQUE,
    nome varchar(45) NOT NULL,
    email varchar(60) NOT NULL,
    telefone varchar(11) NOT NULL,
    cidade varchar(45) NOT NULL,
    uf char(2) NOT NULL
);

create table frete(
    idFrete int primary key auto_increment,
    idEmpresa int NOT NULL,
    veiculoId int NOT NULL,
    docFiscal char(6) NOT NULL UNIQUE,
    dataFrete date NOT NULL,
    valorFrete decimal(10,2) ,
    peso decimal(6,2),
    valorMercadoria decimal(10,2),
    destinatarioId int NOT NULL,
	constraint fkFreteEmpresa
		foreign key(idEmpresa)
            references empresa(idEmpresa),
    constraint fkFreteVeiculo
        foreign key(veiculoId)
            references veiculo(idVeiculo),
    constraint fkFreteDestinatario
        foreign key(destinatarioId)
            references destinatario(idDestinatario)

);

create table kmrodado(
    idkmRodado int primary key auto_increment,
    idVeiculo int NOT NULL,
    kmPercorrido int NOT NULL,
    gastoCombustivel decimal(8,2) NOT NULL,
    manutencao int NOT NULL,
    custos int NOT NULL,

    constraint fkKmRodadoVeiculo
        foreign key(idVeiculo)
            references veiculo(idVeiculo)
);

create table log(
    idLog int primary key auto_increment,
    tipo varchar(45) NOT NULL,
    horario datetime NOT NULL,
    mensagem varchar(300 ) NOT NULL,
    servico varchar(45) NOT NULL,
    qtdRegistrosLidos INT NOT NULL,
    tempoLeituraMs BIGINT
);

