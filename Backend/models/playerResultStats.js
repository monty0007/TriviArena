const mongoose = require('mongoose');
const playerResultStats= new mongoose.Schema({
    gameId:{
        type:mongoose.Schema.ObjectId,
        ref:"Game"
    },
    playerResult: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayerResult",
      },
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      averageTimePerQuestion: {
        type: Number,
      },
      averagePointsPerQuestion: {
        type: Number,
      },
      percentageScoreValue: {
        type: Number,
      },
})
module.exports = mongoose.model("PlayerResultStats", playerResultStatsSchema)