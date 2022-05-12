var mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    hasPaid: {type: Boolean, unique: false},
    registeredAt: { type: Date, index: false }
  });

mongoose.model('User', userSchema);