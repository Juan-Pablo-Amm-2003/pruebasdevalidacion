import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { UserRepository } from './models/user-repository.js'; // Ajusta la ruta según donde esté ubicado UserRepository

// Obtener la ruta del archivo actual (__filename) y su directorio (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Middleware para manejar JSON en las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3200;

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.render('index');
});


// Endpoint para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const id = await UserRepository.create({ username, password });
    res.render('register', { message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.render('register', { error: error.message });
  }
});

// Ruta para mostrar el formulario de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login'); // Aquí se espera que 'login' sea el nombre del archivo de plantilla en tu directorio de vistas
});

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });
    res.render('login', { message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    res.render('login', { error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});