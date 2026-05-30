# 🚀 Setup do Ambiente (Postgres via Docker)

Este projeto utiliza **Docker Compose** para subir um ambiente com PostgreSQL já configurado e populado com dados.

---

## 📋 Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Arquivo de dump SQL (~7GB)

---

## 📁 Estrutura de Pastas

Crie a seguinte estrutura no projeto:

```bash
postgres/
└── init-db/
    ├── 01-tuning.sql
    └── 02-dump.sql
```

---

## ⚙️ Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
```

---

## 📌 Importante

Antes de subir o ambiente:

✅ Certifique-se de que existem **DOIS arquivos dentro de `postgres/init-db`**:

### 01-Tuning do banco

Arquivo:
```
01-tuning.sql
```

Responsável por:
- Ajustes de performance
- Configuração de memória, WAL e paralelismo

---

### 02-Dump do banco (7GB)

Arquivo:
```
02-dump.sql
```

Responsável por:
- Estrutura do banco
- Carga de dados

⚠️ Esse arquivo **não vem no repositório** e deve ser obtido separadamente no OneDrive.

---

## ▶️ Subindo o ambiente

Execute:

```bash
docker compose up -d
```

---

## 🧠 Funcionamento

- Na **primeira execução do container**, o Postgres:
  1. Cria o banco automaticamente
  2. Executa os scripts da pasta `init-db` **em ordem alfabética**
     - `01-tuning.sql`
     - `02-dump.sql`

---

## 🔌 Conexão com o banco

- Host: `localhost`
- Porta: `5432`
- Usuário: `postgres`
- Senha: `postgres`
- Database: `postgres`

---

## ⚠️ Observações

- O processo inicial pode demorar (dump de 7GB)
- Os scripts **rodam apenas na primeira inicialização**
- Se precisar rodar novamente:
  ```bash
  docker compose down -v e exclusão da pasta /data em /postgres
  ```
  (isso apaga os dados)

---

## ✅ Resumo rápido

1. Criar estrutura `postgres/init-db`
2. Adicionar:
   - `01-tuning.sql`
   - `02-dump.sql`
3. Criar `.env`
4. Rodar:
   ```bash
   docker compose up -d
   ```
