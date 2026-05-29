# project-pyreact

### Passos para execução do ambiente

Ao rodar o compose, docker criará o ambiente com um banco de dados postgres na porta 5432 do
computador em que o docker está instalado, as credenciais para conexão são postgres em todos os compos
DB , User e senha

Na primeira execução do container do postgres, a DB será criada automaticamente caso o arquivo sql proveniente de
pg dump estiver na pasta postgres/init-db

Esse sql é diferente do sql que foi criado durante o trabalho, irei fazer o upload na pasta do one drive, ele tem 7GB

então os passos são criar pasta postgres, criar pasta init-db dentro e colar o sql está

depois é só dar docker compose up -d e fé!

