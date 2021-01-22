const { AuthenticationError, UserInputError } = require("apollo-server");
const Thought = require("../../models/Thought");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    async createComment(_, { thoughtId, body }, context) {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const thought = await Thought.findById(thoughtId);

      if (thought) {
        thought.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await thought.save();
        return thought;
      } else throw new UserInputError("Thought not found");
    },

    async deleteComment(_, { thoughtId, commentId }, context) {
      const { username } = checkAuth(context);

      const thought = await Thought.findById(thoughtId);

      if (thought) {
        const commentIndex = thought.comments.findIndex(
          (c) => c.id === commentId
        );

        if (thought.comments[commentIndex].username === username) {
          thought.comments.splice(commentIndex, 1);
          await thought.save();
          return thought;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Thought not found");
      }
    },
  },
};
