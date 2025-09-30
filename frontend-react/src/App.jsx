import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    genero: "",
    ciudad: "",
    correo: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [errors, setErrors] = useState({});

  // Validaciones
  const validate = () => {
    const errs = {};
    if (!/^\d+$/.test(formData.dni)) errs.dni = "DNI solo puede contener números";
    if (!/^[a-zA-Z\s]+$/.test(formData.nombres)) errs.nombres = "Nombres solo letras";
    if (!/^[a-zA-Z\s]+$/.test(formData.apellidos)) errs.apellidos = "Apellidos solo letras";
    if (!formData.fecha_nacimiento) errs.fecha_nacimiento = "Fecha requerida";
    if (!formData.genero) errs.genero = "Selecciona género";
    if (!formData.ciudad) errs.ciudad = "Selecciona ciudad";
    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo))
      errs.correo = "Correo inválido";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.message);

      setFormData({
        dni: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        genero: "",
        ciudad: "",
        correo: "",
      });

      getUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al guardar usuario");
    }
  };

  const getUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:3000/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  return (
    <div className="container">
      <h1>Formulario de Registro</h1>
      <form onSubmit={handleSubmit} className="formulario">
        <div className="form-group">
          <label>DNI:</label>
          <input name="dni" value={formData.dni} onChange={handleChange} />
          {errors.dni && <span className="error">{errors.dni}</span>}
        </div>

        <div className="form-group">
          <label>Nombres:</label>
          <input name="nombres" value={formData.nombres} onChange={handleChange} />
          {errors.nombres && <span className="error">{errors.nombres}</span>}
        </div>

        <div className="form-group">
          <label>Apellidos:</label>
          <input name="apellidos" value={formData.apellidos} onChange={handleChange} />
          {errors.apellidos && <span className="error">{errors.apellidos}</span>}
        </div>

        <div className="form-group">
          <label>Fecha de nacimiento:</label>
          <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
          {errors.fecha_nacimiento && <span className="error">{errors.fecha_nacimiento}</span>}
        </div>

        <div className="form-group">
          <label>Género:</label>
          <div>
            <label>
              <input type="radio" name="genero" value="Masculino" onChange={handleChange} /> Masculino
            </label>
            <label>
              <input type="radio" name="genero" value="Femenino" onChange={handleChange} /> Femenino
            </label>
          </div>
          {errors.genero && <span className="error">{errors.genero}</span>}
        </div>

        <div className="form-group">
          <label>Ciudad:</label>
          <select name="ciudad" value={formData.ciudad} onChange={handleChange}>
            <option value="">Seleccione</option>
            <option value="Quito">Quito</option>
            <option value="Guayaquil">Guayaquil</option>
            <option value="Cuenca">Cuenca</option>
          </select>
          {errors.ciudad && <span className="error">{errors.ciudad}</span>}
        </div>

        <div className="form-group">
          <label>Correo (opcional):</label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} />
          {errors.correo && <span className="error">{errors.correo}</span>}
        </div>

        <button type="submit">Guardar</button>
      </form>

      <h2>Lista de Usuarios</h2>
      <ul className="usuarios-list">
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.dni} - {u.nombres} {u.apellidos} ({u.genero}, {u.ciudad}) {u.correo && `- ${u.correo}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
