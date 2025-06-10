import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 20,
  },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["user", "guest"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

export default User;