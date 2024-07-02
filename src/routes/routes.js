import express from 'express';
import { UserRepository } from '../models/user-repository.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });
    req.session.user = user; // Guardar el usuario en la sesión
    res.redirect('/');
  } catch (error) {
    res.render('login', { error: error.message });
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const id = await UserRepository.create({ username, password });
    res.render('register', { message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.render('register', { error: error.message });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Nueva ruta protegida
router.get('/protected', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('protected');
});

export default router;
