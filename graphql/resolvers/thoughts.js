const { AuthenticationError } = require("apollo-server");

const Thought = require("../../models/Thought");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getThoughts() {
      try {
        const thoughts = await Thought.find().sort({ createdAt: -1 });
        return thoughts;
      } catch (error) {
        throw new Error(err);
      }
    },

    async getThought(_, { thoughtId }) {
      try {
        const thought = await Thought.findById(thoughtId);
        if (thought) {
          return thought;
        } else {
          throw new Error("Thought not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async createThought(_, { body }, context) {
      const user = checkAuth(context);

      console.log(user);

      const newThought = new Thought({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const thought = await newThought.save();

      return thought;
    },

    async deleteThought(_, { thoughtId }, context) {
      const user = checkAuth(context);

      try {
        const thought = await Thought.findById(thoughtId);
        if (user.username === thought.username) {
          await thought.delete();
          return "Thought deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
