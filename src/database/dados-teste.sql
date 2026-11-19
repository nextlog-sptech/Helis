-- Dados de teste para desenvolvimento local.
-- Rode depois do projetopi.sql (versão com frete.dataFrete):  mysql -uroot -p --default-character-set=utf8mb4 helis < src/database/dados-teste.sql
-- Senhas em texto puro: o login aceita e converte para bcrypt no primeiro acesso.
-- Login: ana@translog.test / senha123  (ou CNPJ 11222333000181)
-- Os IDs são buscados pelas chaves únicas, então o script funciona mesmo se o auto_increment já tiver avançado.

use helis;

start transaction;

insert into endereco (cep, numero, logradouro, complemento, bairro, cidade) values ('01310100', '1000', 'Avenida Paulista', 'Conj. 101', 'Bela Vista', 'São Paulo');
set @endTransLog = last_insert_id();
insert into endereco (cep, numero, logradouro, complemento, bairro, cidade) values ('20040002', '250', 'Rua da Assembleia', null, 'Centro', 'Rio de Janeiro');
set @endRotaCerta = last_insert_id();
insert into endereco (cep, numero, logradouro, complemento, bairro, cidade) values ('30130010', '45', 'Avenida Afonso Pena', 'Sala 3', 'Centro', 'Belo Horizonte');
set @endMinas = last_insert_id();

insert into empresa (razao, cnpj, nomeFant, email, telefone, enderecoId) values
('TransLog Transportes Ltda', '11222333000181', 'TransLog', 'contato@translog.test', '1133334444', @endTransLog),
('Rota Certa Logística S.A.', '22333444000192', 'Rota Certa', 'contato@rotacerta.test', '2122223333', @endRotaCerta),
('Minas Cargas Eireli', '33444555000103', 'Minas Cargas', 'contato@minascargas.test', '3132321010', @endMinas);

set @transLog = (select idEmpresa from empresa where cnpj = '11222333000181');
set @rotaCerta = (select idEmpresa from empresa where cnpj = '22333444000192');
set @minas = (select idEmpresa from empresa where cnpj = '33444555000103');

insert into usuario (cpf, nome, email, telefone, adm, senha, empresaId) values
('12345678909', 'Ana Souza', 'ana@translog.test', '11999990001', true, 'senha123', @transLog),
('23456789010', 'Bruno Lima', 'bruno@translog.test', '11999990002', false, 'senha123', @transLog),
('34567890121', 'Carla Mendes', 'carla@rotacerta.test', '21999990003', true, 'senha123', @rotaCerta),
('45678901232', 'Diego Rocha', 'diego@rotacerta.test', '21999990004', false, 'senha123', @rotaCerta),
('56789012343', 'Elisa Prado', 'elisa@minascargas.test', '31999990005', true, 'senha123', @minas);

insert into veiculo (placa, marca, tipoVeiculo, bau, empresaId) values
('ABC1D23', 'Volvo', 'Carreta', 'Baú seco', @transLog),
('DEF4G56', 'Scania', 'Truck', 'Refrigerado', @transLog),
('GHI7J89', 'Mercedes-Benz', 'Toco', 'Sider', @transLog),
('JKL0M12', 'Volkswagen', 'VUC', 'Baú seco', @rotaCerta),
('MNO3P45', 'Iveco', 'Truck', 'Graneleiro', @rotaCerta),
('QRS6T78', 'DAF', 'Carreta', 'Refrigerado', @minas);

insert into destinatario (cpf, nome, email, telefone, cidade, uf) values
('67890123454', 'Fernanda Alves', 'fernanda@cliente.test', '11988880001', 'Campinas', 'SP'),
('78901234565', 'Gustavo Ribeiro', 'gustavo@cliente.test', '21988880002', 'Niterói', 'RJ'),
('89012345676', 'Helena Costa', 'helena@cliente.test', '31988880003', 'Contagem', 'MG'),
('90123456787', 'Igor Martins', 'igor@cliente.test', '41988880004', 'Curitiba', 'PR'),
('01234567898', 'Juliana Freitas', 'juliana@cliente.test', '51988880005', 'Porto Alegre', 'RS');

-- frete: (cnpj da empresa, placa, docFiscal, dataFrete, valorFrete, peso, valorMercadoria, cpf do destinatário)
-- Fretes espalhados por 2026 (jan a nov) para os gráficos mensais terem dados.
insert into frete (idEmpresa, veiculoId, docFiscal, dataFrete, valorFrete, peso, valorMercadoria, destinatarioId)
select e.idEmpresa, v.idVeiculo, f.docFiscal, f.dataFrete, f.valorFrete, f.peso, f.valorMercadoria, d.idDestinatario
from (
    select '11222333000181' cnpj, 'ABC1D23' placa, '000101' docFiscal, '2026-01-03' dataFrete, 1606.55 valorFrete, 681.00 peso, 13790.29 valorMercadoria, '01234567898' cpf
    union all select '11222333000181', 'ABC1D23', '000102', '2026-01-14', 1713.62, 684.97, 44224.20, '78901234565'
    union all select '11222333000181', 'DEF4G56', '000103', '2026-02-23', 2228.30, 1129.75, 28381.64, '67890123454'
    union all select '11222333000181', 'DEF4G56', '000104', '2026-02-03', 2185.90, 1035.84, 34027.96, '67890123454'
    union all select '11222333000181', 'ABC1D23', '000105', '2026-03-24', 2073.02, 1210.73, 58646.77, '01234567898'
    union all select '11222333000181', 'GHI7J89', '000106', '2026-03-10', 5165.96, 2024.69, 139261.63, '78901234565'
    union all select '11222333000181', 'ABC1D23', '000107', '2026-03-23', 926.38, 353.02, 23166.45, '78901234565'
    union all select '11222333000181', 'DEF4G56', '000108', '2026-04-28', 832.81, 422.20, 18309.38, '78901234565'
    union all select '11222333000181', 'GHI7J89', '000109', '2026-04-12', 2590.73, 981.60, 60726.83, '67890123454'
    union all select '11222333000181', 'DEF4G56', '000110', '2026-04-20', 3845.52, 1596.95, 51475.52, '90123456787'
    union all select '11222333000181', 'GHI7J89', '000111', '2026-05-09', 6151.55, 2376.95, 124586.69, '89012345676'
    union all select '11222333000181', 'DEF4G56', '000112', '2026-05-27', 3015.19, 1890.29, 78635.12, '90123456787'
    union all select '11222333000181', 'GHI7J89', '000113', '2026-05-09', 1054.92, 345.61, 21602.61, '89012345676'
    union all select '11222333000181', 'DEF4G56', '000114', '2026-06-07', 3567.30, 1641.97, 100312.64, '78901234565'
    union all select '11222333000181', 'GHI7J89', '000115', '2026-06-09', 1403.13, 507.19, 27862.65, '01234567898'
    union all select '11222333000181', 'ABC1D23', '000116', '2026-06-14', 4739.74, 2175.21, 60787.43, '01234567898'
    union all select '11222333000181', 'GHI7J89', '000117', '2026-07-16', 632.04, 400.00, 6580.98, '78901234565'
    union all select '11222333000181', 'GHI7J89', '000118', '2026-07-26', 4266.23, 1697.06, 70242.97, '90123456787'
    union all select '11222333000181', 'GHI7J89', '000119', '2026-08-17', 1837.95, 753.11, 52810.70, '67890123454'
    union all select '11222333000181', 'DEF4G56', '000120', '2026-08-22', 5959.82, 2146.53, 148454.18, '67890123454'
    union all select '11222333000181', 'GHI7J89', '000121', '2026-09-10', 2626.75, 1156.48, 76133.59, '89012345676'
    union all select '11222333000181', 'GHI7J89', '000122', '2026-09-17', 4433.85, 1876.32, 45850.61, '89012345676'
    union all select '11222333000181', 'ABC1D23', '000123', '2026-09-27', 4070.82, 1605.69, 46254.55, '01234567898'
    union all select '11222333000181', 'DEF4G56', '000124', '2026-09-25', 6825.02, 2229.35, 144531.95, '67890123454'
    union all select '11222333000181', 'DEF4G56', '000125', '2026-10-04', 6718.21, 2244.02, 176666.36, '78901234565'
    union all select '11222333000181', 'GHI7J89', '000126', '2026-10-02', 1798.89, 729.92, 17507.98, '90123456787'
    union all select '11222333000181', 'GHI7J89', '000127', '2026-11-03', 5656.94, 2351.57, 60906.75, '90123456787'
    union all select '11222333000181', 'ABC1D23', '000128', '2026-11-18', 1350.21, 563.28, 28820.32, '01234567898'
    union all select '22333444000192', 'MNO3P45', '000129', '2026-03-25', 3326.30, 1805.85, 49421.36, '90123456787'
    union all select '22333444000192', 'JKL0M12', '000130', '2026-05-17', 2292.80, 1193.27, 21571.97, '01234567898'
    union all select '22333444000192', 'JKL0M12', '000131', '2026-07-18', 1323.77, 706.25, 12657.69, '78901234565'
    union all select '22333444000192', 'JKL0M12', '000132', '2026-09-03', 6491.11, 2191.92, 62047.62, '89012345676'
    union all select '22333444000192', 'MNO3P45', '000133', '2026-11-16', 1157.98, 671.32, 33096.59, '78901234565'
    union all select '33444555000103', 'QRS6T78', '000134', '2026-05-26', 2719.27, 1240.54, 27397.10, '89012345676'
    union all select '33444555000103', 'QRS6T78', '000135', '2026-08-14', 3278.53, 1104.43, 30135.48, '67890123454'
    union all select '33444555000103', 'QRS6T78', '000136', '2026-10-13', 5155.74, 1802.07, 53639.90, '78901234565'
) f
join empresa e on e.cnpj = f.cnpj
join veiculo v on v.placa = f.placa
join destinatario d on d.cpf = f.cpf;

insert into kmrodado (idVeiculo, kmPercorrido, gastoCombustivel, manutencao, custos)
select v.idVeiculo, k.km, k.combustivel, k.manutencao, k.custos
from (
    select 'ABC1D23' placa, 1250 km, 2875.50 combustivel, 600 manutencao, 3475 custos
    union all select 'ABC1D23', 980, 2254.00, 0, 2254
    union all select 'DEF4G56', 640, 1536.00, 350, 1886
    union all select 'GHI7J89', 420, 882.00, 0, 882
    union all select 'JKL0M12', 310, 589.00, 120, 709
    union all select 'MNO3P45', 1500, 3450.00, 900, 4350
    union all select 'QRS6T78', 1100, 2640.00, 450, 3090
) k
join veiculo v on v.placa = k.placa;

insert into log (tipo, horario, mensagem, servico, qtdRegistrosLidos, tempoLeituraMs) values
('INFO', '2026-11-18 08:00:00', 'Leitura de fretes concluída', 'etl-fretes', 7, 1250),
('WARN', '2026-11-18 08:05:12', 'Veículo sem registro de quilometragem no período', 'etl-km', 6, 830),
('ERROR', '2026-11-18 08:10:45', 'Falha ao ler planilha de custos: arquivo não encontrado', 'etl-custos', 0, null),
('INFO', '2026-11-19 08:00:00', 'Leitura de fretes concluída', 'etl-fretes', 7, 1100);

commit;
