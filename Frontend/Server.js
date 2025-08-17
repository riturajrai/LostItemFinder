const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const UserRoutes = require("./controllers/userController");
const User = require("./models/User");

require("dotenv").config();

// Connect to DB
connectDB();

async function startServer() {
  const app = express();

  // Enable CORS for http://localhost:3000
  app.use(cors({
    origin: ['http://localhost:3000','https://lostitemfinder.com', 'http://localhost:61817'],
    methods: ['GET', 'PUT', 'DELETE', 'PATCH'],
    // Optional: if you need to send cookies or auth headers
    credentials: true, 
  }));

  // Parse JSON requests
  app.use(bodyParser.json());

  // REST API Routes
  app.use("/api/users", UserRoutes);

  // GraphQL Server
  const server = new ApolloServer({ typeDefs, resolvers, persistedQueries: false});
  await server.start();
  server.applyMiddleware({ app });

  // Get All Users
  app.get("/users", async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.listen(4000, () =>
    console.log(`Server ready at:
    GraphQL: http://localhost:4000${server.graphqlPath}
    REST API: http://localhost:4000/api/users
    REST API (all users): http://localhost:4000/users`)
  );
}

startServer();



