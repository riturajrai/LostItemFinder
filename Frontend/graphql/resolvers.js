const User = require("../models/User");

const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    addUser: async (_, { name, email }) => {
      const newUser = new User({ name, email });
      return await newUser.save();
    }
  }
};

module.exports = resolvers;
