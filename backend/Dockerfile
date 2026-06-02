FROM python:3.12-slim

# Evita bytecode e melhora logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependências do sistema (necessárias pro psycopg2)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código
COPY . .

EXPOSE 8000

# Comando mais estável (produção leve)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
