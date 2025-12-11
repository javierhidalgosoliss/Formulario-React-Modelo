import React, { useState, useEffect } from "react";
import "./styles.css";

  export default function App() {
    // -------------------- TOKEN -----------------------
    const [token, setToken] = useState("");

    // -------------------- FORMULARIO -----------------------
    const [modoConsulta, setModoConsulta] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [formData, setFormData] = useState({
      id: "",
      email: "",
      first_name: "",
      last_name: "",
      avatar: ""
    });
    const [mensaje, setMensaje] = useState("");

    // -------------------- LISTADO DE USUARIOS -----------------------
    const [usuarios, setUsuarios] = useState([]);

    // -------------------- OBTENER TOKEN -----------------------
    const obtenerToken = async () => {
      try {
        const res = await fetch("https://apitest.soliss.org/tokenservice/token", {
          method: "GET",
          headers: {
            "usuario": "030119",
            "password": "Con_030119"
          }
        });

        if (!res.ok) {
          console.error("Error al obtener token:", res.status);
          return null;
        }

        const data = await res.json();

        // El token está en: data.token
        const bearer = data.token;

        setToken(bearer);
        console.log("TOKEN OBTENIDO:", bearer);

        return bearer;

      } catch (error) {
        console.error("Excepción obteniendo token:", error);
        return null;
      }
    };

    const asegurarToken = async () => {
      if (!token) {
        return await obtenerToken();
      }
      return token;
    };

  // -------------------- FETCH LISTADO INICIAL -----------------------
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("https://reqres.in/api/users?per_page=12", {
        headers: {
          "x-api-key": "reqres-free-v1"
        }
      });
      const data = await res.json();
      setUsuarios(data.data || []);
    } catch (err) {
      console.log("Error al cargar usuarios", err);
    }
  };

  // -------------------- FUNCIONES FORMULARIO -----------------------
  const handleChange = (e) => {
    setFormData({ ...formData ,[e.target.name]: e.target.value });
  };

  const handleGet = async () => {
    try {
      const res = await fetch(`https://reqres.in/api/users/${searchId}`, {
        headers: { "x-api-key": "reqres-free-v1" }
      });
      if (!res.ok) {
        setMensaje(`❗ Usuario no encontrado`);
        return;
      }
      const data = await res.json();
      setFormData(data.data);
      setMensaje("✔ Usuario cargado");
      setModoConsulta(true);
    } catch (err) {
      setMensaje("⚠ Error al conectar con API");
    }
  };

  const handleNuevo = () => {
    setFormData({ id: "", email: "", first_name: "", last_name: "", avatar: "" });
    setMensaje("🆕 Introduzca datos para crear un usuario");
    setModoConsulta(false);
  };

  const handleCancel = () => {
    setFormData({ id: "", email: "", first_name: "", last_name: "", avatar: "" });
    setMensaje("🔎 Modo consulta activado");
    setModoConsulta(true);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setMensaje(`✔ Usuario creado con ID: ${data.id || "?"}`);
      setModoConsulta(true);
      cargarUsuarios(); // recargar listado para mostrar nuevo usuario
    } catch (err) {
      setMensaje("⚠ Error al crear usuario");
    }
  };

  // -------------------- CLICK EN FILA -----------------------
  const handleFilaClick = (usuario) => {
    setFormData(usuario);
    setModoConsulta(true);
    setMensaje(`✔ Usuario ID ${usuario.id} cargado`);
  };

  // -------------------- RENDER -----------------------
  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* ---------------- FORMULARIO ---------------- */}
      <div style={{
        flex: 1,
        border: "1px solid #ccc",
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px"
      }}>
        <h2 style={{ textAlign: "center" }}>Gestor Reqres</h2>

        {modoConsulta && (
          <div style={{ marginBottom: "15px" }}>
            <input
              type="number"
              placeholder="ID del usuario"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
            />
            <button onClick={handleGet} style={{ width: "100%", padding: "6px" }}>
              🔍 Obtener por ID
            </button>
          </div>
        )}

        <div style={{ marginBottom: "10px" }}>
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
            style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
          />
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Nombre"
            disabled={modoConsulta}
            style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
          />
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Apellidos"
            disabled={modoConsulta}
            style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
          />
          <input
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="URL Avatar"
            disabled={modoConsulta}
            style={{ width: "100%", padding: "6px", marginBottom: "5px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "5px" }}>
          {modoConsulta ? (
            <button onClick={handleNuevo} style={{ flex: 1, padding: "6px" }}>➕ Nuevo</button>
          ) : (
            <>
              <button onClick={handleCreate} style={{ flex: 1, padding: "6px", background: "#4caf50", color: "white" }}>✔ Crear</button>
              <button onClick={handleCancel} style={{ flex: 1, padding: "6px", background: "#d32f2f", color: "white" }}>✖ Cancelar</button>
            </>
          )}
        </div>

        {mensaje && <p style={{ marginTop: "10px", textAlign: "center" }}>{mensaje}</p>}
      </div>

      {/* ---------------- LISTADO USUARIOS ---------------- */}
      <div style={{
        flex: 1,
        border: "1px solid #ccc",
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        maxHeight: "600px",
        overflowY: "auto"
      }}>
        <h3 style={{ textAlign: "center" }}>Listado de Usuarios</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #999", padding: "6px", textAlign: "left" }}>Nombre</th>
              <th style={{ borderBottom: "1px solid #999", padding: "6px" }}>Avatar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr
                key={user.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleFilaClick(user)}
              >
                <td style={{ padding: "6px" }}>{user.first_name} {user.last_name}</td>
                <td style={{ padding: "6px", textAlign: "center" }}>
                  <img src={user.avatar} alt="avatar" style={{ width: "40px", borderRadius: "50%" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


