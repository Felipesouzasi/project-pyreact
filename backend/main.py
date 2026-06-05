from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
from psycopg2 import pool
from datetime import datetime
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────
# DB Config
# ─────────────────────────────────────────────
DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 5432)),
    "dbname":   os.getenv("DB_NAME", "adubosreal"),
    "user":     os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
}

# ─────────────────────────────────────────────
# Pool
# ─────────────────────────────────────────────
db_pool = psycopg2.pool.SimpleConnectionPool(1, 10, **DB_CONFIG)

def get_db():
    conn = db_pool.getconn()
    try:
        yield conn
    finally:
        db_pool.putconn(conn)

def query(conn, sql: str, params=None) -> List[Dict[str, Any]]:
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or ())
            return [dict(row) for row in cur.fetchall()]
    except Exception as e:
        conn.rollback()
        raise e

# ─────────────────────────────────────────────
# App
# ─────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

# ─────────────────────────────────────────────
# METAS (com ordem e normalização)
# ─────────────────────────────────────────────
@app.get("/consultor/{consultor_id}/metas")
def get_metas(consultor_id: int, conn=Depends(get_db)):
    ano = datetime.now().year
    #mes = datetime.now().month
    mes = 5

    sql = """
        SELECT
            CASE
                WHEN grupo_produto = 'FERTILIZANTES CONVEN' THEN 'FERTILIZANTES CONVENCIONAIS'
                WHEN grupo_produto = 'FERTILIZANTES ESPECI' THEN 'FERTILIZANTES ESPECIAIS'
                ELSE grupo_produto
            END AS grupo_produto,
            vlr_faturamento_apos_impostos AS vlr_faturamento,
            vlr_meta,
            perc_meta,
            vlr_faturamento_apos_impostos - vlr_meta AS desvio,
            vlr_carteira
        FROM comercial.vw_consultor_meta_faturamento
        WHERE cs_id = %s AND ano = %s AND mes = %s
    """

    rows = query(conn, sql, (consultor_id, ano, mes))

    ORDEM = [
        "FERTILIZANTES CONVENCIONAIS",
        "FERTILIZANTES ESPECIAIS",
        "DEFENSIVOS",
        "ESPECIALIDADES",
        "SEMENTES HFF",
        "COMPLEMENTARES",
        "SEMENTES CEREAIS",
    ]

    indexed = {r["grupo_produto"].upper(): r for r in rows}

    result = []
    for grupo in ORDEM:
        r = indexed.get(grupo, {})
        result.append({
            "grupo": grupo,
            "vlr_faturamento": float(r.get("vlr_faturamento") or 0),
            "vlr_meta": float(r.get("vlr_meta") or 0),
            "perc_meta": float(r.get("perc_meta") or 0),
            "desvio": float(r.get("desvio") or 0),
            "vlr_carteira": float(r.get("vlr_carteira") or 0),
        })

    return {
        "consultor_id": consultor_id,
        "ano": ano,
        "mes": mes,
        "data": result
    }

# ─────────────────────────────────────────────
# CLIENTES (com paginação)
# ─────────────────────────────────────────────
@app.get("/consultor/{consultor_id}/top-clientes")
def get_top_clientes(consultor_id: int, page: int = 1, page_size: int = 10, conn=Depends(get_db)):
    offset = (page - 1) * page_size

    total = query(conn, """
        SELECT COUNT(*) AS total
        FROM comercial.vw_consultor_maiores_clientes
        WHERE consultor_id = %s
    """, (consultor_id,))[0]["total"]

    data = query(conn, """
        SELECT cliente_id, cliente, dias_ultima_compra,
               vlr_total_faturado, percentual
        FROM comercial.vw_consultor_maiores_clientes
        WHERE consultor_id = %s
        ORDER BY vlr_total_faturado DESC
        LIMIT %s OFFSET %s
    """, (consultor_id, page_size, offset))

    return {
        "consultor_id": consultor_id,
        "total": total,
        "page": page,
        "page_size": page_size,
        "data": data
    }

# ─────────────────────────────────────────────
# PRODUTOS
# ─────────────────────────────────────────────
@app.get("/consultor/{consultor_id}/top-produtos")
def get_top_produtos(consultor_id: int, page: int = 1, page_size: int = 10, conn=Depends(get_db)):
    offset = (page - 1) * page_size

    total = query(conn, """
        SELECT COUNT(*) AS total
        FROM comercial.vw_consultor_top_produtos
        WHERE consultor_id = %s
    """, (consultor_id,))[0]["total"]

    data = query(conn, """
        SELECT produto_id, produto, dias_ultima_compra,
               vlr_total_faturado, percentual
        FROM comercial.vw_consultor_top_produtos
        WHERE consultor_id = %s
        ORDER BY vlr_total_faturado DESC
        LIMIT %s OFFSET %s
    """, (consultor_id, page_size, offset))

    return {
        "consultor_id": consultor_id,
        "total": total,
        "page": page,
        "page_size": page_size,
        "data": data
    }

# ─────────────────────────────────────────────
# GRUPOS
# ─────────────────────────────────────────────
@app.get("/consultor/{consultor_id}/top-grupos")
def get_top_grupos(consultor_id: int, conn=Depends(get_db)):
    return {
        "consultor_id": consultor_id,
        "data": query(conn, """
            SELECT grupo_id, grupo, vlr_total_faturado
            FROM comercial.vw_consultor_top_produto_grupo
            WHERE consultor_id = %s
            ORDER BY vlr_total_faturado DESC
        """, (consultor_id,))
    }

# ─────────────────────────────────────────────
# SUBGRUPOS
# ─────────────────────────────────────────────
@app.get("/consultor/{consultor_id}/top-subgrupos")
def get_top_subgrupos(consultor_id: int, page: int = 1, page_size: int = 12, conn=Depends(get_db)):
    offset = (page - 1) * page_size

    total = query(conn, """
        SELECT COUNT(*) AS total
        FROM comercial.vw_consultor_top_produto_subgrupo
        WHERE consultor_id = %s
    """, (consultor_id,))[0]["total"]

    data = query(conn, """
        SELECT subgrupo_id, subgrupo, vlr_total_faturado
        FROM comercial.vw_consultor_top_produto_subgrupo
        WHERE consultor_id = %s
        ORDER BY vlr_total_faturado DESC
        LIMIT %s OFFSET %s
    """, (consultor_id, page_size, offset))

    return {
        "consultor_id": consultor_id,
        "total": total,
        "page": page,
        "page_size": page_size,
        "data": data
    }

# ─────────────────────────────────────────────
# DASHBOARD
# ─────────────────────────────────────────────
@app.get("/consultor/{consultor_id}/dashboard")
def get_dashboard(consultor_id: int, conn=Depends(get_db)):
    return {
        "metas": get_metas(consultor_id, conn)["data"],
        "clientes": get_top_clientes(consultor_id, conn=conn)["data"],
        "produtos": get_top_produtos(consultor_id, conn=conn)["data"],
        "grupos": get_top_grupos(consultor_id, conn)["data"],
        "subgrupos": get_top_subgrupos(consultor_id, conn=conn)["data"],
        "gerado_em": datetime.now().isoformat()
    }
