const Thought = require("../../models/Thought");

module.exports = {
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
