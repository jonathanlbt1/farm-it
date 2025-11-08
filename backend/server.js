const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Validate required environment variables early so errors are obvious
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((k) => !process.env[k]);
if (missingEnv.length > 0) {
  console.error('Missing required environment variables:', missingEnv.join(', '));
  console.error('Please add them to backend/.env or your environment and restart the server.');
  process.exit(1);
}

const authRoutes = require('./routes/auth.routes');
const animalRoutes = require('./routes/animal.routes');
const feedingRoutes = require('./routes/feeding.routes');
const manureRoutes = require('./routes/manure.routes');
const financialRoutes = require('./routes/financial.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/feeding', feedingRoutes);
app.use('/api/manure', manureRoutes);
app.use('/api/financial', financialRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Farm-IT API está funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

