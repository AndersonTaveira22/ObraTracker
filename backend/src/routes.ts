import 'dotenv/config';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Users
router.post('/users', async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json(user);
});
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Gastos
router.get('/gastos/:userId', async (req, res) => {
  const gastos = await prisma.gasto.findMany({ where: { userId: req.params.userId }, orderBy: { data: 'desc' } });
  res.json(gastos);
});
router.post('/gastos', async (req, res) => {
  const gasto = await prisma.gasto.create({ data: req.body });
  res.json(gasto);
});

// Materiais
router.get('/materiais/:userId', async (req, res) => {
  const materiais = await prisma.material.findMany({ where: { userId: req.params.userId }, orderBy: { createdAt: 'desc' } });
  res.json(materiais);
});
router.post('/materiais', async (req, res) => {
  const material = await prisma.material.create({ data: req.body });
  res.json(material);
});

// Ferramentas
router.get('/ferramentas/:userId', async (req, res) => {
  const ferramentas = await prisma.ferramenta.findMany({ where: { userId: req.params.userId }, orderBy: { createdAt: 'desc' } });
  res.json(ferramentas);
});
router.post('/ferramentas', async (req, res) => {
  const ferramenta = await prisma.ferramenta.create({ data: req.body });
  res.json(ferramenta);
});

// Mao De Obra
router.get('/maodeobra/:userId', async (req, res) => {
  const maos = await prisma.maoDeObra.findMany({ where: { userId: req.params.userId }, orderBy: { data: 'desc' } });
  res.json(maos);
});
router.post('/maodeobra', async (req, res) => {
  const mao = await prisma.maoDeObra.create({ data: req.body });
  res.json(mao);
});

// Planejamento
router.get('/planejamento/:userId', async (req, res) => {
  const planejamentos = await prisma.planejamento.findMany({ where: { userId: req.params.userId }, orderBy: { createdAt: 'desc' } });
  res.json(planejamentos);
});
router.post('/planejamento', async (req, res) => {
  const planejamento = await prisma.planejamento.create({ data: req.body });
  res.json(planejamento);
});
router.put('/planejamento/:id', async (req, res) => {
  const { id } = req.params;
  const planejamento = await prisma.planejamento.update({
    where: { id },
    data: req.body
  });
  res.json(planejamento);
});

// Dashboard Analytics / AI Intelligent System
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Setup inicial automático do Usuário Padrão via Supabase
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        nome: 'Anderson (Admin)',
        email: 'anderson@obratracker.com',
        senha: '123'
      }
    });

    const gastos = await prisma.gasto.findMany({ where: { userId }, orderBy: { data: 'desc' } });
    const planejamentos = await prisma.planejamento.findMany({ where: { userId } });
    
    const totalGasto = gastos.reduce((acc: number, curr: any) => acc + curr.valor, 0);
    const totalPlanejado = planejamentos.reduce((acc: number, curr: any) => acc + curr.valor_estimado, 0);
    
    let warningLevel = 'OK';
    if (totalPlanejado > 0) {
      if (totalGasto >= totalPlanejado) warningLevel = 'CRITICAL';
      else if (totalGasto >= totalPlanejado * 0.8) warningLevel = 'WARNING';
    }

    const suggestions = [];
    if (warningLevel === 'CRITICAL') {
      suggestions.push("Orçamento estourado! Evite comprar novos materiais não essenciais.");
    } else if (warningLevel === 'WARNING') {
      suggestions.push("Atenção: Você atingiu 80% do seu limite de gastos planejado.");
    } else {
      suggestions.push("Tudo sob controle. Seus gastos acompanham o ritmo do planejamento.");
    }
    
    const gastosPorCategoria = gastos.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.valor;
      return acc;
    }, {});

    const chartData = Object.keys(gastosPorCategoria).map(key => ({
      name: key,
      value: gastosPorCategoria[key]
    }));

    res.json({
      totalGasto,
      totalPlanejado,
      warningLevel,
      suggestions,
      gastosRecentes: gastos.slice(0, 5), // last 5 since it's ordered desc
      chartData
    });
  } catch(e) {
    res.status(500).json({ error: "Erro ao processar dashboard" });
  }
});

export default router;
