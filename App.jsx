import { useState, useEffect } from "react";

function App() {
  const [trabajos, setTrabajos] = useState([]);

  const [form, setForm] = useState({
    fecha: "",
    nombre: "",
    direccion: "",
    ubicacion: "",
    ip: "",
    conexion: "Antena",
    tecnico: "Franco",
    estado: "Pendiente",
    problema: "",
    trabajo: "",
    inicio: "",
    fin: "",
    foto: null,
  });

  const tecnicos = [
    "Franco",
    "Alex",
    "Alberto",
    "Franco y Alex",
    "Franco, Alex y Alberto",
  ];

  // ---------------------------------------------
  // FUNCIONES PARA CONECTAR CON EL SERVIDOR
  // ---------------------------------------------

  // Obtener trabajos desde el backend
  const obtenerTrabajos = async () => {
    try {
      const res = await fetch("http://localhost:3001/trabajos");
      const data = await res.json();
      setTrabajos(data);
    } catch (error) {
      console.error("Error al obtener trabajos:", error);
    }
  };

  // Agregar un trabajo al backend
  const agregarTrabajoServidor = async (nuevoTrabajo) => {
    try {
      await fetch("http://localhost:3001/trabajos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTrabajo),
      });
      obtenerTrabajos();
    } catch (error) {
      console.error("Error al agregar trabajo:", error);
    }
  };

  // ---------------------------------------------
  // USO DE EFECTO
  // ---------------------------------------------
  useEffect(() => {
    obtenerTrabajos(); // cargar trabajos al iniciar
  }, []);

  // ---------------------------------------------
  // MANEJADORES DE FORMULARIO
  // ---------------------------------------------
  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, foto: reader.result });
    };
    reader.readAsDataURL(archivo);
  };

  // ---------------------------------------------
  // ACCIONES DE TRABAJO
  // ---------------------------------------------
  const agregarTrabajo = () => {
    if (!form.fecha || !form.nombre || !form.direccion) {
      alert("Completá fecha, cliente y dirección");
      return;
    }

    const nuevoId =
      trabajos.length > 0
        ? Math.max(...trabajos.map((t) => t.id || 0)) + 1
        : 1;

    const nuevoTrabajo = {
      id: nuevoId,
      ...form,
      estado: "Pendiente",
      inicio: "",
      fin: "",
    };

    agregarTrabajoServidor(nuevoTrabajo);

    // reset del formulario
    setForm({
      fecha: "",
      nombre: "",
      direccion: "",
      ubicacion: "",
      ip: "",
      conexion: "Antena",
      tecnico: "Franco",
      estado: "Pendiente",
      problema: "",
      trabajo: "",
      inicio: "",
      fin: "",
      foto: null,
    });
  };

  const actualizarTrabajo = async (index, cambios) => {
    // Como nuestro backend simple no tiene PATCH, actualizamos todo localmente
    const actualizado = trabajos.map((t, i) =>
      i === index ? { ...t, ...cambios } : t
    );
    setTrabajos(actualizado);
    // Opcional: implementar PATCH en backend para persistencia real
  };

  const iniciarTrabajo = (index) => {
    const hora = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    actualizarTrabajo(index, { inicio: hora, estado: "En proceso" });
  };

  const finalizarTrabajo = (index) => {
    const hora = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    actualizarTrabajo(index, { fin: hora, estado: "Finalizado" });
  };

  const eliminarTrabajo = (index) => {
    if (confirm("¿Eliminar trabajo?")) {
      const filtrados = trabajos.filter((_, i) => i !== index);
      setTrabajos(filtrados);
      // Opcional: enviar DELETE al backend si se implementa
    }
  };

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div style={{ padding: 20 }}>
      <h1>Wisnet - Trabajos Técnicos</h1>

      <h2>Nuevo trabajo</h2>

      <input type="date" name="fecha" value={form.fecha} onChange={manejarCambio} /><br />
      <input name="nombre" placeholder="Cliente" value={form.nombre} onChange={manejarCambio} /><br />
      <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={manejarCambio} /><br />
      <input name="ubicacion" placeholder="Link Google Maps" value={form.ubicacion} onChange={manejarCambio} /><br />
      <input name="ip" placeholder="Dirección IP" value={form.ip} onChange={manejarCambio} /><br />

      <select name="conexion" value={form.conexion} onChange={manejarCambio}>
        <option>Antena</option>
        <option>Fibra</option>
      </select><br />

      <select name="tecnico" value={form.tecnico} onChange={manejarCambio}>
        {tecnicos.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select><br />

      <input name="problema" placeholder="Posible problema" value={form.problema} onChange={manejarCambio} /><br />
      <input name="trabajo" placeholder="Trabajo a realizar" value={form.trabajo} onChange={manejarCambio} /><br />

      <label>Foto:</label>
      <input type="file" accept="image/*" onChange={manejarFoto} /><br /><br />

      <button onClick={agregarTrabajo}>Agregar trabajo</button>

      <hr />

      <h2>Trabajos</h2>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Técnico</th>
            <th>IP</th>
            <th>Conexión</th>
            <th>Estado</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trabajos.map((t, i) => (
            <tr key={i}>
              <td>{t.id}</td>
              <td>{t.fecha}</td>
              <td>{t.nombre}</td>
              <td>{t.tecnico}</td>
              <td>{t.ip || "-"}</td>
              <td>{t.conexion}</td>
              <td>{t.estado}</td>
              <td>{t.inicio || "-"}</td>
              <td>{t.fin || "-"}</td>
              <td>
                <button onClick={() => iniciarTrabajo(i)} disabled={t.inicio}>
                  Iniciar
                </button>{" "}
                <button onClick={() => finalizarTrabajo(i)} disabled={!t.inicio || t.fin}>
                  Finalizar
                </button>{" "}
                <button onClick={() => eliminarTrabajo(i)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;