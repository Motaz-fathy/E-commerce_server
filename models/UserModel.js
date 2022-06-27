const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const user = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  image: {
    type: String,
    default: "profile.png"
  }
});

user.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const pas = await bcrypt.hash(this.password, salt);
  this.password = pas;
});

user.methods.matchPassword = async function(enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};
const User = mongoose.model("user", user);

module.exports = User;
