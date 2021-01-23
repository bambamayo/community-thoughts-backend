const { UserInputError, AuthenticationError } = require("apollo-server");

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

      if (args.body.trim() === "") {
        throw new Error("Thought body must not be empty");
      }

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

    async upvoteThought(_, { thoughtId }, context) {
      const { username } = checkAuth(context);

      const thought = await Thought.findById(thoughtId);
      if (thought) {
        if (
          thought.downvotes.find((downvote) => downvote.username === username)
        ) {
          //If already downvoted, remove downvote and upvote
          thought.downvotes = thought.downvotes.filter(
            (downvote) => downvote.username !== username
          );
          thought.upvotes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        } else if (
          thought.upvotes.find((upvote) => upvote.username === username)
        ) {
          //if already upvoted, remove upvote
          thought.upvotes = thought.upvotes.filter(
            (upvote) => upvote.username !== username
          );
        } else {
          //else add upvote
          thought.upvotes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await thought.save();
        return thought;
      } else throw new UserInputError("Thought not found");
    },

    async downvoteThought(_, { thoughtId }, context) {
      const { username } = checkAuth(context);

      const thought = await Thought.findById(thoughtId);
      if (thought) {
        if (thought.upvotes.find((upvote) => upvote.username === username)) {
          //If already upvoted, remove upvote and downvote
          thought.upvotes = thought.upvotes.filter(
            (upvote) => upvote.username !== username
          );
          thought.downvotes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        } else if (
          thought.downvotes.find((downvote) => downvote.username === username)
        ) {
          //if already downvoted, remove downvote
          thought.downvotes = thought.downvotes.filter(
            (downvote) => downvote.username !== username
          );
        } else {
          //else add downvote
          thought.downvotes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await thought.save();
        return thought;
      } else {
        throw new UserInputError("Thought not found");
      }
    },
  },
};
