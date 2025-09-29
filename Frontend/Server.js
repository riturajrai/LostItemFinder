const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Add cookie-parser
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const userRoutes = require('./controllers/userController');
const userProfileRoutes = require('./controllers/userProfile');
const dashboardRoutes = require('./routes/dashboard');
const User = require('./models/User');
const Qr = require('./routes/Qr')
require('dotenv').config();

// Connect to MongoDB
connectDB();

async function startServer() {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }));

  // Parse cookies
  app.use(cookieParser());

  // Parse JSON requests
  app.use(bodyParser.json());

  // Log incoming requests for debugging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);
    next();
  });

  // REST API Routes
  app.use('/api/users', userRoutes);
  app.use('/api', userProfileRoutes);
  app.use('/api', dashboardRoutes);
  app.use('/api/qr' , Qr)
  // Get All Users (protected route)
  const authMiddleware = require('./middleware/auth');
  app.get('/users', authMiddleware, async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // GraphQL Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    persistedQueries: false,
    context: ({ req }) => ({ user: req.user }),
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log(`Server ready at:
    GraphQL: http://localhost:4000${server.graphqlPath}
    REST API: http://localhost:4000/api/users
    REST API (all users): http://localhost:4000/users`)
  );
}

startServer();