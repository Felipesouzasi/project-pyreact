from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import psycopg2
import psycopg2.extras
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────
#  DB Connection
# ─────────────────────────────────────────────

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 5432)),
    "dbname":   os.getenv("DB_NAME", "adubosreal"),
    "user":     os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
}


def get_db():
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        yield conn
    finally:
        conn.close()


def query(conn, sql: str, params=None) -> list[dict]:
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql, params or ())
        return [dict(row) for row in cur.fetchall()]


# ─────────────────────────────────────────────
#  App
# ─────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌱 Adubos Real API iniciando...")
    yield
    print("🌱 Adubos Real API encerrando...")

app = FastAPI(
    title="Adubos Real – API Consultor",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
#  Endpoints
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


# --- Metas e Velocímetros ---
@app.get("/consultor/{consultor_id}/metas")
def get_metas(consultor_id: int, conn=Depends(get_db)):
    """
    Retorna metas x faturamento por grupo de produto (velocímetros).
    Usa o mês/ano corrente automaticamente.
    """
    ano = datetime.now().year
    mes = 5  # temporário — remover quando dump de junho estiver disponível

    sql = """
        SELECT
            CASE
                WHEN grupo_produto = 'FERTILIZANTES CONVEN' THEN 'FERTILIZANTES CONVENCIONAIS'
                WHEN grupo_produto = 'FERTILIZANTES ESPECI' THEN 'FERTILIZANTES ESPECIAIS'
                ELSE grupo_produto
            END AS grupo_produto,
            vlr_faturamento_apos_impostos            AS vlr_faturamento,
            vlr_meta,
            perc_meta,
            vlr_faturamento_apos_impostos - vlr_meta AS desvio,
            vlr_carteira
        FROM comercial.vw_consultor_meta_faturamento
        WHERE cs_id = %s
          AND ano   = %s
          AND mes   = %s
    """
    rows = query(conn, sql, (consultor_id, ano, mes))

    # Ordena pela lista padrão de exibição
    ORDEM = [
        "FERTILIZANTES CONVENCIONAIS",
        "FERTILIZANTES ESPECIAIS",
        "DEFENSIVOS",
        "ESPECIALIDADES",
        "SEMENTES HFF",
        "COMPLEMENTARES",
        "SEMENTES CEREAIS",
    ]

    indexed = {r["grupo_produto"].upper().strip(): r for r in rows}
    result = []
    for grupo in ORDEM:
        r = indexed.get(grupo, {})
        result.append({
            "grupo":          grupo,
            "vlr_faturamento": float(r.get("vlr_faturamento") or 0),
            "vlr_meta":        float(r.get("vlr_meta") or 0),
            "perc_meta":       round(float(r.get("perc_meta") or 0), 2),
            "desvio":          float(r.get("desvio") or 0),
            "vlr_carteira":    float(r.get("vlr_carteira") or 0),
        })

    return {
        "consultor_id": consultor_id,
        "ano": ano,
        "mes": mes,
        "data": result,
    }


# --- Top 10 Clientes ---
@app.get("/consultor/{consultor_id}/top-clientes")
def get_top_clientes(
    consultor_id: int,
    page: int = 1,
    page_size: int = 10,
    conn=Depends(get_db),
):
    offset = (page - 1) * page_size

    sql_count = """
        SELECT COUNT(*) AS total
        FROM comercial.vw_consultor_maiores_clientes
        WHERE consultor_id = %s
    """
    total = query(conn, sql_count, (consultor_id,))[0]["total"]

    sql = """
        SELECT
            cliente_id,
            cliente,
            dias_ultima_compra,
            vlr_total_faturado,
            percentual
        FROM comercial.vw_consultor_maiores_clientes
        WHERE consultor_id = %s
        ORDER BY vlr_total_faturado DESC
        LIMIT %s OFFSET %s
    """
    rows = query(conn, sql, (consultor_id, page_size, offset))

    return {
        "consultor_id": consultor_id,
        "total":        total,
        "page":         page,
        "page_size":    page_size,
        "data":         rows,
    }


# --- Top 10 Produtos ---
@app.get("/consultor/{consultor_id}/top-produtos")
def get_top_produtos(
    consultor_id: int,
    page: int = 1,
    page_size: int = 10,
    conn=Depends(get_db),
):
    offset = (page - 1) * page_size

    sql_count = """
        SELECT COUNT(*) AS total
        FROM comercial.vw_consultor_top_produtos
        WHERE consultor_id = %s
    """
    total = query(conn, sql_count, (consultor_id,))[0]["total"]

    sql = """
        SELECT
            produto_id,
            produto,
            dias_ultima_compra,
            vlr_total_faturado,
            percentual
        FROM comercial.vw_consultor_top_produtos
        WHERE consultor_id = %s
        ORDER BY vlr_total_faturado DESC
        LIMIT %s OFFSET %s
    """
    rows = query(conn, sql, (consultor_id, page_size, offset))

    return {
        "consultor_id": consultor_id,
        "total":        total,
        "page":         page,
        "page_size":    page_size,
        "data":         rows,
    }


# --- Top Grupos de Produtos ---
@app.get("/consultor/{consultor_id}/top-grupos")
def get_top_grupos(consultor_id: int, conn=Depends(get_db)):
    sql = """
        SELECT
            t0.grupo_id,
            t0.grupo,
            t0.vlr_total_faturado,
            ROUND(
                (t0.vlr_total_faturado * 100) /
                NULLIF((
                    SELECT SUM(s0.vlr_total_faturado)
                    FROM comercial.vw_consultor_top_produto_grupo s0
                    WHERE s0.consultor_id = t0.consultor_id
                ), 0),
            2)::float AS percentual_faturado
        FROM comercial.vw_consultor_top_produto_grupo t0
        WHERE t0.consultor_id = %s
        ORDER BY t0.vlr_total_faturado DESC
    """
    rows = query(conn, sql, (consultor_id,))
    return {"consultor_id": consultor_id, "data": rows}


# --- Top Subgrupos de Produtos ---
@app.get("/consultor/{consultor_id}/top-subgrupos")
def get_top_subgrupos(
    consultor_id: int,
    page: int = 1,
    page_size: int = 12,
    conn=Depends(get_db),
):
    offset = (page - 1) * page_size

    sql_count = """
        SELECT COUNT(*) AS total
        FROM comercial.vw_consultor_top_produto_subgrupo
        WHERE consultor_id = %s
    """
    total = query(conn, sql_count, (consultor_id,))[0]["total"]

    sql = """
        WITH total AS (
            SELECT SUM(vlr_total_faturado) AS total_geral
            FROM comercial.vw_consultor_top_produto_subgrupo
            WHERE consultor_id = %s
        )
        SELECT
            t0.subgrupo_id,
            t0.subgrupo,
            t0.vlr_total_faturado,
            ROUND(
                (t0.vlr_total_faturado * 100) / NULLIF(total.total_geral, 0),
            2)::float AS percentual_faturado
        FROM comercial.vw_consultor_top_produto_subgrupo t0, total
        WHERE t0.consultor_id = %s
        ORDER BY t0.vlr_total_faturado DESC
        LIMIT %s OFFSET %s
    """
    rows = query(conn, sql, (consultor_id, consultor_id, page_size, offset))

    return {
        "consultor_id": consultor_id,
        "total":        total,
        "page":         page,
        "page_size":    page_size,
        "data":         rows,
    }


# --- Endpoint consolidado (carrega tudo de uma vez) ---
@app.get("/consultor/{consultor_id}/dashboard")
def get_dashboard(consultor_id: int, conn=Depends(get_db)):
    """Endpoint único que agrega todos os dados do dashboard."""
    return {
        "metas":      get_metas(consultor_id, conn)["data"],
        "clientes":   get_top_clientes(consultor_id, conn=conn)["data"],
        "produtos":   get_top_produtos(consultor_id, conn=conn)["data"],
        "grupos":     get_top_grupos(consultor_id, conn)["data"],
        "subgrupos":  get_top_subgrupos(consultor_id, conn=conn)["data"],
        "gerado_em":  datetime.now().isoformat(),
    }