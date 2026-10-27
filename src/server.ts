import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// 1. Rota POST: Recebe o Webhook
app.post('/webhook', async (req, res) => {
  try {
    const { produto, valor, status } = req.body;

    if (!produto || valor === undefined) {
      return res.status(400).json({ erro: 'Dados incompletos. "produto" e "valor" são obrigatórios.' });
    }

    const novaVenda = await prisma.venda.create({
      data: {
        produto,
        valor: Number(valor),
        status: status || 'pago'
      }
    });

    return res.status(201).json({ mensagem: 'Webhook processado com sucesso', venda: novaVenda });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.status(500).json({ erro: 'Erro interno ao salvar webhook' });
  }
});

// 2. Rota GET: Retorna o Relatório
app.get('/relatorio', async (req, res) => {
  try {
    const totalVendas = await prisma.venda.count();
    
    const faturamentoTotal = await prisma.venda.aggregate({
      _sum: { valor: true }
    });

    const vendasPorProduto = await prisma.venda.groupBy({
      by: ['produto'],
      _count: { produto: true },
      _sum: { valor: true }
    });

    return res.status(200).json({
      resumo: {
        totalVendas,
        faturamentoTotal: faturamentoTotal._sum.valor || 0
      },
      detalhesPorProduto: vendasPorProduto.map((item: any) => ({
        produto: item.produto,
        quantidade: item._count.produto,
        totalGerado: item._sum.valor
      }))
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return res.status(500).json({ erro: 'Erro ao gerar relatório' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});