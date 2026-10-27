# Desafio TWR - Receptor de Webhooks 🚀

API RESTful desenvolvida em Node.js para processamento de postbacks (webhooks) de vendas e geração de relatórios financeiros, construída como solução para o Desafio Técnico TWR.

## 🛠️ Tecnologias Utilizadas

- **Node.js & TypeScript:** Base da aplicação, garantindo tipagem estática e segurança.
- **Express:** Framework web para roteamento da API.
- **Prisma ORM:** Modelagem do banco de dados e migrações.
- **PostgreSQL (Supabase):** Banco de dados relacional hospedado na nuvem (Serverless).
- **Render:** Plataforma de hospedagem (Deploy contínuo).

## ⚙️ Arquitetura e Decisões Técnicas

- **Bancos Serverless & Connection Pooling:** Configuração de URLs distintas no Prisma (`DATABASE_URL` na porta 6543 com PgBouncer para alta volumetria de queries, e `DIRECT_URL` na porta 5432 para migrações estruturais seguras).
- **Fail-Fast & Validações:** Tratamento de erros nas rotas para garantir que payloads malformados sejam rejeitados antes de onerar o banco de dados.
- **Segurança:** Ocultação de credenciais via `.env` e bloqueio de artefatos de compilação via `.gitignore`.

## 🚀 Como rodar o projeto localmente

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/SEU_USUARIO/Desafio-TWR-Receptor-de-Postbacks.git
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Crie um arquivo \`.env\` na raiz do projeto com as credenciais do seu banco de dados:
\`\`\`env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:6543/DB?pgbouncer=true"
DIRECT_URL="postgresql://USUARIO:SENHA@HOST:5432/DB"
\`\`\`

4. Sincronize o banco de dados e inicie o servidor:
\`\`\`bash
npx prisma db push
npm run dev
\`\`\`

## 📌 Endpoints da API

### 1. Receber Webhook (Criar Venda)
- **Rota:** \`POST /webhook\`
- **Payload Esperado:**
\`\`\`json
{
  "produto": "Nome do Produto",
  "valor": 150.00,
  "status": "pago"
}
\`\`\`

### 2. Relatório de Vendas
- **Rota:** \`GET /relatorio\`
- **Retorno:** Resumo financeiro e detalhamento de vendas agrupadas por produto.