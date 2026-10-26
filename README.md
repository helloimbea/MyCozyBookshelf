# Projeto — Spring Boot + React

| Pasta       | Stack                                                                 |
|-------------|-----------------------------------------------------------------------|
| `backend/`  | Java 21, Spring Boot 4.1, Spring Data JPA, MySQL, Flyway, Actuator    |
| `frontend/` | React + Vite + TypeScript                                             |

## Pré-requisitos
- Java 21, Node 24+ e MySQL rodando em `localhost:3306`
- O banco `projeto` é criado automaticamente na primeira execução

## Rodando em desenvolvimento

**Backend** (porta 8080) — no PowerShell:
```powershell
cd backend
$env:DB_USERNAME="root"; $env:DB_PASSWORD="sua_senha"
.\mvnw.cmd spring-boot:run
```
Variáveis aceitas: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (ver `application.properties`).

**Frontend** (porta 5173):
```powershell
cd frontend
npm run dev
```
O Vite encaminha `/api/*` para `http://localhost:8080`, então não é preciso configurar CORS em dev.

## Endpoints
- `GET /api/hello` — endpoint de exemplo
- `GET /actuator/health` — status da aplicação e do banco

## Banco de dados
O schema é versionado pelo Flyway em `backend/src/main/resources/db/migration`
(`V1__init.sql`, `V2__...`). O Hibernate está em modo `validate`: ele não altera tabelas.

> Na rede Bosch use `mvnw.cmd`. O `./mvnw` (bash) usa o curl do Windows, que falha na checagem de revogação de certificado através do proxy.
