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
// Configure CORS to allow requests from the frontend(s).
// You can set BACKEND_ALLOWED_ORIGINS in backend/.env as a comma-separated list
// e.g. BACKEND_ALLOWED_ORIGINS="http://localhost:3000,https://your-frontend.vercel.app"
const allowedOrigins = new Set((process.env.BACKEND_ALLOWED_ORIGINS || '*').split(',').map(s => s.trim()).filter(Boolean));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (like server-side or tools) when origin is undefined
    if (!origin) return callback(null, true);
    if (allowedOrigins.has('*') || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled
app.options('*', cors(corsOptions));
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

