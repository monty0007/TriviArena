const mongoose = require("mongoose");

const playerResultSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  answers: [
    {
      questionIndex: { type: Number, required: true },
      answered: { type: Boolean, default: false },
      answers: [String], // Check this line for any typos or incorrect syntax
      time: { type: Number },
      points: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("PlayerResult", playerResultSchema);
