import dbLocal from 'db-local';
import bcrypt from 'bcrypt';

const { Schema } = new dbLocal({ path: './dB' });

const User = Schema('User', {
  username: { type: String, required: true },
  password: { type: String, required: true }
});

export class UserRepository {
  static async create({ username, password }) {
    Validaciones.username(username);
    Validaciones.password(password);

    // Evitar usuarios duplicados
    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error('El nombre de usuario ya existe');

    // Hash de la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear y guardar el usuario en la base de datos
    const newUser = await User.create({
      username,
      password: hashedPassword
    }).save();

    // Devolver el ID del usuario creado
    return newUser._id; // Utilizar _id en lugar de id si estás usando db-local
  }

  static async login({ username, password }) {
    Validaciones.username(username);
    Validaciones.password(password);

    // Buscar el usuario por nombre de usuario
    const user = await User.findOne({ username });
    if (!user) throw new Error('Nombre de usuario o contraseña inválidos');

    // Verificar la contraseña
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) throw new Error('Nombre de usuario o contraseña inválidos');

    // Devolver el usuario público (sin la contraseña)
    const { password: _, ...publicUser } = user;
    return publicUser;
  }
}

class Validaciones {
  static username(username) {
    if (typeof username !== 'string') throw new Error('El nombre de usuario debe ser una cadena');
    if (username.length < 3) throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('La contraseña debe ser una cadena');
    if (password.length < 3) throw new Error('La contraseña debe tener al menos 3 caracteres');
  }
}
