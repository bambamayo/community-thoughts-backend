const thoughtsResolvers = require("./thoughts");
const usersResolvers = require("./users");
const commentResolvers = require("./comments");

module.exports = {
  Thought: {
    commentCount: (parent) => parent.comments.length,
    upvoteCount: (parent) => parent.upvotes.length,
    downvoteCount: (parent) => parent.downvotes.length,
  },
  Query: {
    ...thoughtsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...thoughtsResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
