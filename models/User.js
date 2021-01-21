const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  email: String,
  createdAt: String,
  password: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

module.exports = model("User", userSchema);
