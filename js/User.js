// models/User.js
const mongoose = require('mongoose');

// Схема пользователя
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false }, // Добавлено
  verificationToken: { type: String }, 
});

// Экспорт модели
module.exports = mongoose.model('User', UserSchema);
