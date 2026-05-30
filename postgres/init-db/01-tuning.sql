-- MEMÓRIA
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '10GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';

-- WAL / CHECKPOINT
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET checkpoint_timeout = '15min';
ALTER SYSTEM SET max_wal_size = '4GB';
ALTER SYSTEM SET min_wal_size = '1GB';

-- PARALELISMO (CPU i7)
ALTER SYSTEM SET max_worker_processes = 8;
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
ALTER SYSTEM SET max_parallel_workers = 8;
ALTER SYSTEM SET max_parallel_maintenance_workers = 4;

-- I/O
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- AUTOVACUUM (IMPORTANTE PARA 7GB DE DADOS)
ALTER SYSTEM SET autovacuum = on;
ALTER SYSTEM SET autovacuum_max_workers = 5;
ALTER SYSTEM SET autovacuum_naptime = '30s';
ALTER SYSTEM SET autovacuum_vacuum_cost_limit = 2000;

-- LOG (opcional, útil para tuning contínuo)
ALTER SYSTEM SET log_min_duration_statement = 500; -- ms
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_autovacuum_min_duration = 0;

-- CONEXÕES (ajuste se necessário)
ALTER SYSTEM SET max_connections = 100;

-- APLICAR
SELECT pg_reload_conf();
