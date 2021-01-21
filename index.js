require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

const Thought = require("./models/Thought");

const typeDefs = gql`
  type Thought {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getThoughts: [Thought!]
  }
`;

const resolvers = {
  Query: {
    async getThoughts() {
      try {
        const thoughts = await Thought.find();
        return thoughts;
      } catch (error) {
        throw new Error(err);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MONGODB CONNECTED!!!");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
