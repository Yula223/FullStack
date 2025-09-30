const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;  // Cambié el puerto aquí también

app.use(cors());
app.use(express.json());

let usuarios = [];

// Ruta POST para crear un nuevo usuario
app.post("/usuarios", (req, res) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, correo } = req.body;

  // Validación de datos
  if (!dni || !nombres || !apellidos || !fecha_nacimiento || !genero || !ciudad) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  const nuevoUsuario = { id: usuarios.length + 1, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, correo };
  usuarios.push(nuevoUsuario);

  res.status(200).json({ message: "Usuario guardado correctamente", usuario: nuevoUsuario });
});

// Ruta GET para obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  res.status(200).json(usuarios);
});

// Ruta PUT para actualizar un usuario
app.put("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, correo } = req.body;

  const usuario = usuarios.find(u => u.id === parseInt(id));
  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  usuario.dni = dni;
  usuario.nombres = nombres;
  usuario.apellidos = apellidos;
  usuario.fecha_nacimiento = fecha_nacimiento;
  usuario.genero = genero;
  usuario.ciudad = ciudad;
  usuario.correo = correo;

  res.status(200).json({ message: "Usuario actualizado correctamente", usuario });
});

// Ruta DELETE para eliminar un usuario
app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const index = usuarios.findIndex(u => u.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  usuarios.splice(index, 1);
  res.status(200).json({ message: "Usuario eliminado correctamente" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
