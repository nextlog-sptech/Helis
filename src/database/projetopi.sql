create database helis;
use helis;

create table endereco(
    idEndereco int primary key auto_increment,
    cep char(8),
    numero varchar(5),
    logradouro varchar(45),
    complemento varchar(45),
    bairro varchar(45),
    cidade varchar(45)
);

create table empresa(
    idEmpresa int primary key auto_increment,
    razao varchar(45),
    cnpj char(14),
    nomeFant varchar(45),
    email varchar(60),
    telefone char(11),
    enderecoId int,
    constraint fkEnderecoEmpresa
        foreign key(enderecoId)
            references endereco(idEndereco)
);

create table usuario(
    idUsuario int primary key auto_increment,
    cpf char(11),
    nome varchar(45),
    email varchar(60),
    telefone char(11),
    cargo varchar(30),
    senha varchar(255),
    empresaId int,
    constraint fkUsuarioEmpresa
        foreign key(empresaId)
            references empresa(idEmpresa)
);

create table veiculo(
    idVeiculo int primary key auto_increment,
    placa varchar(15),
    marca varchar(45),
    tipoVeiculo varchar(45),
    bau varchar(30),
    cor varchar(20),
    estado varchar(20),
    empresaId int,
    constraint fkVeiculoEmpresa
        foreign key(empresaId)
            references empresa(idEmpresa)
);

create table destinatario(
    idDestinatario int primary key auto_increment,
    cpf char(11),
    nome varchar(45),
    email varchar(60),
    telefone varchar(11),
    cidade varchar(45),
    uf char(2)
);

create table frete(
    idFrete int primary key auto_increment,
    veiculoId int,
    usuarioId int,
    docFiscal char(6),
    valorFrete decimal(10,2),
    peso decimal(6,2),
    valorMercadoria decimal(10,2),
    status varchar(30),
    dataCadastro datetime,
    dataSaida datetime,
    dataEntregaPrevista datetime,
    dataEntregaReal datetime,
    destinatarioId int,
    enderecoEntradaId int,
    enderecoSaidaId int,

    constraint fkFreteVeiculo
        foreign key(veiculoId)
            references veiculo(idVeiculo),

    constraint fkFreteUsuario
        foreign key(usuarioId)
            references usuario(idUsuario),

    constraint fkFreteDestinatario
        foreign key(destinatarioId)
            references destinatario(idDestinatario),

    constraint fkEnderecoEntrada
        foreign key(enderecoEntradaId)
            references endereco(idEndereco),

    constraint fkEnderecoSaida
        foreign key(enderecoSaidaId)
            references endereco(idEndereco)
);

create table kmrodado(
    freteId int primary key,
    kmPercorrido int,
    gastoCombustivel decimal(8,2),
    manutencao int,
    custos int,

    constraint fkKmRodadoFrete
        foreign key(freteId)
            references frete(idFrete)
);

create table notificacao(
    idNotificacao int primary key auto_increment,
    tipo varchar(30),
    titulo varchar(60),
    mensagem varchar(255),
    dataHora datetime,
    lida tinyint,
    idUsuario int,

    constraint fkNotificacaoUsuario
        foreign key(idUsuario)
            references usuario(idUsuario)
);

create table log(
    idLog int primary key auto_increment,
    tipo varchar(45),
    horario datetime,
    mensagem varchar(300),
    servico varchar(45),
    qtdRegistrosLidos INT,
    tempoLeituraMs BIGINT
);


INSERT INTO endereco (cep, numero, logradouro, complemento, bairro, cidade)
VALUES
('01310100', '100', 'Avenida Paulista', 'Sala 12', 'Bela Vista', 'São Paulo'),
('04538133', '250', 'Avenida Brigadeiro Faria Lima', 'Conjunto 21', 'Itaim Bibi', 'São Paulo'),
('30130110', '500', 'Avenida Afonso Pena', 'Sala 5', 'Centro', 'Belo Horizonte'),
('20040002', '75', 'Rua da Assembleia', 'Andar 3', 'Centro', 'Rio de Janeiro'),
('80010000', '320', 'Rua XV de Novembro', 'Sala 8', 'Centro', 'Curitiba'),
('40020110', '180', 'Avenida Sete de Setembro', 'Sala 10', 'Comércio', 'Salvador');

INSERT INTO empresa (razao, cnpj, nomeFant, email, telefone, enderecoId)
VALUES
('Transportes Paulista LTDA', '12345678000190', 'Paulista Transportes', 'contato@paulistatransportes.com.br', '11987654321', 1),
('Logistica Faria Lima LTDA', '23456789000101', 'Faria Lima Log', 'contato@farimalog.com.br', '11976543210', 2),
('Minas Cargas LTDA', '34567890000112', 'Minas Cargas', 'contato@minascargas.com.br', '31987654321', 3),
('Rio Express Transportes LTDA', '45678901000123', 'Rio Express', 'contato@rioexpress.com.br', '21987654321', 4),
('Parana Logistica LTDA', '56789012000134', 'Parana Log', 'contato@paranalog.com.br', '41987654321', 5),
('Bahia Transportes LTDA', '67890123000145', 'Bahia Transportes', 'contato@bahiatransportes.com.br', '71987654321', 6);

INSERT INTO usuario (cpf, nome, email, telefone, cargo, senha, empresaId)
VALUES
('12345678901', 'Carlos Almeida', 'carlos@paulistatransportes.com.br', '11912345678', 'Administrador', 'senha123', 1),
('23456789012', 'Mariana Costa', 'mariana@farimalog.com.br', '11923456789', 'Gestor de Logistica', 'senha456', 2),
('34567890123', 'Rafael Santos', 'rafael@minascargas.com.br', '31934567890', 'Analista de Logistica', 'senha789', 3),
('45678901234', 'Juliana Oliveira', 'juliana@rioexpress.com.br', '21945678901', 'Administrador', 'senha101', 4),
('56789012345', 'Fernando Lima', 'fernando@paranalog.com.br', '41956789012', 'Motorista', 'senha202', 5),
('67890123456', 'Isabela Souza', 'isabela@bahiatransportes.com.br', '71967890123', 'Gestor de Logistica', 'senha303', 6);