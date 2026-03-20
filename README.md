# HeroFactory

Projeto full stack com frontend e backend em TypeScript, rodando com Docker Compose.

## Tecnologias

- Backend: Node.js + TypeScript 
- Frontend: React + TypeScript 
- Banco de dados: MySQL 8
- ORM: Prisma
- Orquestração: Docker Compose

## Subir o projeto com Docker

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Esse comando sobe:

- `mysql` (MySQL 8)
- `backend` (API Node.js + TypeScript)
- `frontend` (React + TypeScript)

## Portas

- Frontend: `http://localhost:5173`
- Backend (API): `http://localhost:3000`
- Swagger (documentacao da API): `http://localhost:3000/docs`

## Parar os containers

Para parar tudo:

```bash
docker compose down
```

## Parar Rodar os testes

Na raíz do projeto:

cd backend

npm install

npm run test
