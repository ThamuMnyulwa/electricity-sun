FROM python:3.12-slim
WORKDIR /app

# Install uv to manage dependencies
RUN pip install --no-cache-dir uv

COPY pyproject.toml ./
# Use uv to install dependencies
RUN uv pip install --no-cache-dir -r pyproject.toml


COPY app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
