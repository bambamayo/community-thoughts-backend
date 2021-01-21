const { model, Schema } = require("mongoose");

const thoughtSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  upvotes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  downvotes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Thought", thoughtSchema);
