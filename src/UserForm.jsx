import React, { useState } from "react";

const UserForm = () => {
  // --- STATE DE CONTROL DE MODO FORMULARIO ----
  // modoConsulta = true → se consulta por id (GET)
  // modoConsulta = false → se crean fichas nuevas (POST)
  const [modoConsulta, setModoConsulta] = useState(true);

  // --- STATE PARA EL USERID PARA HACER GET ---
  const [searchId, setSearchId] = useState("");

  // --- STATE DEL FORMULARIO (datos del usuario) ---
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    avatar: ""
  });

  // --- STATE PARA MENSAJES DEL SISTEMA (errores, info, notificaciones) ---
  const [mensaje, setMensaje] = useState("");

  // -------------------------------------------------------------------
  // EVENTO para capturar cambios en los inputs y actualizar formData
  // -------------------------------------------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // -------------------------------------------------------------------
  // GET A USER by ID
  // -------------------------------------------------------------------
  const handleGet = async () => {
    try {
      const res = await fetch(`https://reqres.in/api/users/${searchId}`, {
        headers: {
          "x-api-key": "reqres-free-v1",
        }
      });
      if (!res.ok) {
        setMensaje("❗ Usuario no encontrado");
        return;
      }

      const data = await res.json();

      // Actualizamos FORM con los valores devueltos
      setFormData(data.data);
      setMensaje("✔ Usuario cargado correctamente");

    } catch (err) {
      setMensaje("⚠ Error al consultar usuario");
    }
  };

  // -------------------------------------------------------------------
  // MODO: CREAR NUEVA FICHA
  // -------------------------------------------------------------------
  const handleNuevo = () => {
    setFormData({ id: "", email: "", first_name: "", last_name: "", avatar: "" });
    setMensaje("🆕 Introduzca datos para crear un usuario");
    setModoConsulta(false);   // Cambia a modo ALTA
  };

  // -------------------------------------------------------------------
  // CANCELAR CREACIÓN (volver a modo consulta)
  // -------------------------------------------------------------------
  const handleCancel = () => {
    setFormData({ id: "", email: "", first_name: "", last_name: "", avatar: "" });
    setMensaje("🔎 Modo consulta activado");
    setModoConsulta(true);
  };

  // -------------------------------------------------------------------
  // POST → CREAR NUEVO USUARIO
  // -------------------------------------------------------------------
  const handleCreate = async () => {
    try {
      const res = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "reqres-free-v1" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      setMensaje(`✔ Usuario creado con ID: ${data.id || "?"}`);
      setModoConsulta(true);

    } catch (err) {
      setMensaje("⚠ Error en la creación de usuario");
    }
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      background: "#f9f9f9",
      padding: "20px",
      borderRadius: "8px",
      width: "420px",
    }}>

      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Gestor de Usuarios Reqres
      </h2>

      {/* ----------------- BLOQUE CONSULTA POR ID ---------------- */}
      {modoConsulta && (
        <div style={{
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "20px"
        }}>
          <h4>Consulta por ID</h4>
          <input
            type="number"
            placeholder="Introduzca ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          />

          <button onClick={handleGet} style={{ padding: "6px", width: "100%" }}>
            🔍 GET usuario por ID
          </button>
        </div>
      )}

      {/* ----------------- FORMULARIO DE EDICIÓN ---------------- */}
      <div style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "20px"
      }}>
        <h4>Datos del usuario</h4>

        {formData.avatar && (
          <img
            src={formData.avatar}
            alt="avatar"
            style={{ width: "120px", borderRadius: "8px", marginBottom: "10px" }}
          />
        )}

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          disabled={modoConsulta}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />

        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Nombre"
          disabled={modoConsulta}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />

        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Apellidos"
          disabled={modoConsulta}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />

        <input
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="URL avatar"
          disabled={modoConsulta}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />

      </div>

      {/* --------------- BOTONERA ---------------- */}
      <div style={{ display: "flex", gap: "8px" }}>
        {modoConsulta ? (
          <>
            <button
              onClick={handleNuevo}
              style={{ width: "100%", padding: "8px" }}
            >
              ➕ Nuevo
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCreate}
              style={{ width: "100%", padding: "8px", background: "#4caf50", color: "white" }}
            >
              ✔ Crear
            </button>
            <button
              onClick={handleCancel}
              style={{ width: "100%", padding: "8px", background: "#d32f2f", color: "white" }}
            >
              ✖ Cancelar
            </button>
          </>
        )}
      </div>

      {/* ---------------- MENSAJES ---------------- */}
      {mensaje && (
        <p style={{ marginTop: "15px", textAlign: "center" }}>{mensaje}</p>
      )}
    </div>
  );
};

export default UserForm;
