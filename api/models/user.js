const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String, required: false },
  bio: { type: String, required: false },
  dob: { type: Date, required: false },
  status: { type: String, required: false },
  profilePicture: { type: String, required: false }, // assuming image URL as a placeholder
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false}] // might need reviewing
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
