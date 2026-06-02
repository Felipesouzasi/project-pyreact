from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
from psycopg2 import pool
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
# Connection Pool
# ─────────────────────────────────────────────

db_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    **DB_CONFIG
)

# ─────────────────────────────────────────────
# Dependency
# ─────────────────────────────────────────────

def get_db():
    conn = db_pool.getconn()
    try:
        yield conn
    finally:
        db_pool.putconn(conn)

# ─────────────────────────────────────────────
# Query helpers
# ─────────────────────────────────────────────

def query(conn, sql: str, params=None) -> List[Dict[str, Any]]:
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or ())
            return [dict(row) for row in cur.fetchall()]
    except Exception as e:
        conn.rollback()
        raise e


def execute(conn, sql: str, params=None):
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e

