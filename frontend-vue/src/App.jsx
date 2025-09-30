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
    id: null, // Para saber si estamos editando
  });

  const [usuarios, setUsuarios] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);  // Estado de carga

  // Validaciones de formulario
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
      setLoading(true);  // Activar el estado de carga

      let res;
      if (formData.id) {
        // Actualizar usuario
        res = await fetch(`http://localhost:5000/usuarios/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Crear usuario
        res = await fetch("http://localhost:5000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      alert(data.message);

      // Limpiar formulario
      setFormData({
        dni: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        genero: "",
        ciudad: "",
        correo: "",
        id: null, // Resetear el id para crear un nuevo usuario
      });

      // Recargar usuarios
      getUsuarios();

    } catch (err) {
      console.error(err);
      alert("Error al guardar usuario");
    } finally {
      setLoading(false);  // Desactivar el estado de carga
    }
  };

  const handleCancel = () => {
    // Resetear el formulario si el usuario desea cancelar
    setFormData({
      dni: "",
      nombres: "",
      apellidos: "",
      fecha_nacimiento: "",
      genero: "",
      ciudad: "",
      correo: "",
      id: null, // Vuelve al estado de "nuevo"
    });
  };

  // Leer usuarios
  const getUsuarios = async () => {
    setLoading(true);  // Activar el estado de carga
    try {
      const res = await fetch("http://localhost:5000/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);  // Desactivar el estado de carga
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  // Editar usuario
  const editUsuario = (usuario) => {
    setFormData({
      dni: usuario.dni,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      fecha_nacimiento: usuario.fecha_nacimiento,
      genero: usuario.genero,
      ciudad: usuario.ciudad,
      correo: usuario.correo || "",
      id: usuario.id,
    });
  };

  // Eliminar usuario
  const deleteUsuario = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await fetch(`http://localhost:5000/usuarios/${id}`, { method: "DELETE" });
      getUsuarios();  // Recargar la lista de usuarios
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

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
              <input type="radio" name="genero" value="Masculino" onChange={handleChange} checked={formData.genero === "Masculino"} /> Masculino
            </label>
            <label>
              <input type="radio" name="genero" value="Femenino" onChange={handleChange} checked={formData.genero === "Femenino"} /> Femenino
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

        <button type="submit">{formData.id ? "Actualizar" : "Guardar"}</button>

        {formData.id && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "#e74c3c",
              marginTop: "10px",
              marginLeft: "10px",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <h2>Lista de Usuarios</h2>
      {loading ? <p>Cargando...</p> : (
        <ul className="usuarios-list">
          {usuarios.map((u) => (
            <li key={u.id}>
              {u.dni} - {u.nombres} {u.apellidos} ({u.genero}, {u.ciudad}) {u.correo && `- ${u.correo}`}
              <button className="btn-edit" onClick={() => editUsuario(u)}>Editar</button>
              <button className="btn-delete" onClick={() => deleteUsuario(u.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
