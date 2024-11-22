const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// Импорт модели пользователя
const User = require('./User');

const app = express();
const PORT = 3000;

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware для обработки JSON
app.use(bodyParser.json());

// Обработчик для регистрации пользователя
app.post('/register', async (req, res) => {
  const { regUsername, regEmail, regPassword } = req.body;

  // Проверка, что все поля заполнены
  if (!regUsername || !regEmail || !regPassword) {
    return res.status(400).json({ success: false, message: 'Все поля обязательны для заполнения' });
  }

  try {
    // Проверка, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email: regEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(regPassword, 10);

    // Создание нового пользователя
    const newUser = new User({
      username: regUsername,
      email: regEmail,
      password: hashedPassword,
    });

    // Сохранение пользователя в базе данных
    await newUser.save();

    res.status(201).json({ success: true, message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка сервера', error });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
