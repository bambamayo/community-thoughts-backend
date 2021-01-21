const { gql } = require("apollo-server");

module.exports = gql`
  type Thought {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getThoughts: [Thought!]
    getThought(thoughtId: ID!): Thought
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createThought(body: String!): Thought!
    deleteThought(thoughtId: ID!): String!
  }
`;
