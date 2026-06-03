# Adubos Real – Dashboard Consultor

Migração do módulo de Consultores do ScriptCase para **Python (FastAPI) + React (Vite)**.

---

## Estrutura do repositório (monorepo)
Teste CI/CD 3.0
```
adubos-real/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                  # CI: lint Python + build React
│   └── pull_request_template.md
├── .gitignore
├── README.md
│
├── backend/                        # FastAPI + psycopg2
│   ├── main.py                     # App, CORS, todos os endpoints
│   ├── requirements.txt
│   └── .env.example                # Copie para .env e configure
│
└── frontend/                       # React + Vite
    ├── index.html
    ├── package.json
    ├── vite.config.js              # Proxy /api → localhost:8000
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx                 # Header + Dashboard + auto-refresh 1h
        ├── index.css               # Variáveis, reset, utilitários
        ├── components/
        │   ├── Header.jsx/.css
        │   ├── Velocimetro.jsx/.css  # SVG nativo, sem FusionCharts
        │   ├── MetaCard.jsx/.css
        │   ├── DataTable.jsx/.css   # Paginação server-side
        │   ├── GrupoChart.jsx/.css  # Recharts — barras horizontais
        │   └── Loading.jsx
        ├── hooks/
        │   └── useConsultor.js     # useMetas, useTopClientes, etc.
        └── pages/
            └── DashboardConsultor.jsx/.css
```

---

## Setup inicial (primeira vez)

```bash
# Clone o repositório
git clone https://github.com/sua-org/adubos-real.git
cd adubos-real
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # preencha com suas credenciais do PostgreSQL
uvicorn main:app --reload --port 8000
```

Docs automáticas: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Acesse: http://localhost:5173

> O Vite faz proxy `/api/*` → `http://localhost:8000/*` automaticamente.

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Healthcheck |
| GET | `/consultor/{id}/metas` | Velocímetros (meta × faturamento) |
| GET | `/consultor/{id}/top-clientes` | Top clientes paginado |
| GET | `/consultor/{id}/top-produtos` | Top produtos paginado |
| GET | `/consultor/{id}/top-grupos` | Grupos de produtos (gráfico) |
| GET | `/consultor/{id}/top-subgrupos` | Subgrupos paginado |
| GET | `/consultor/{id}/dashboard` | Todos os dados consolidados |

Parâmetros de paginação: `?page=1&page_size=10`

---

## Fluxo de trabalho Git

```
main        → produção (protegida, só via PR)
develop     → integração / homologação
feature/*   → novas funcionalidades
fix/*       → correções
```

```bash
# Criar uma feature
git checkout develop
git checkout -b feature/nome-da-feature
# ... desenvolve ...
git push origin feature/nome-da-feature
# Abre PR para develop
```

---

## Stack

| Camada | Tecnologia | Por quê |
|--------|------------|---------|
| Backend | Python 3.12 + FastAPI | Performance, tipagem, docs automáticas |
| Banco | PostgreSQL (psycopg2) | Banco existente da Adubos Real |
| Frontend | React 18 + Vite | Ecossistema, React Native no futuro |
| Gráficos | Recharts + SVG nativo | Zero licença, leve, customizável |
| CI | GitHub Actions | Já integrado ao repo |

---

## Próximos passos

- [ ] Autenticação JWT (login por consultor)
- [ ] Contexto global de usuário (substituir `CONSULTOR_ID` fixo)
- [ ] Outras telas (clientes, pedidos, etc.)
- [ ] Dockerfile + docker-compose
- [ ] Testes com pytest (back) e Vitest (front)

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
