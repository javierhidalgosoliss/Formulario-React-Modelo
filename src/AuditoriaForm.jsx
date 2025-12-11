import React, { useEffect, useState } from "react";

// =============================================================
// Componente principal Auditoría
// Contiene:
//   - Listado de auditorías (izquierda)
//   - Formulario de edición/consulta (derecha)
//   - Funciones GET/POST + token automático
// =============================================================
export default function AuditoriaForm() {
  // --------------------------
  // 📌 ESTADOS PRINCIPALES
  // --------------------------

  // Listado completo de auditorías
  const [lista, setLista] = useState([]);

  // Datos del formulario de auditoría
  const [formData, setFormData] = useState({
    entidadModificada: "",
    entidadModificadaId: "",
    campoModificado: "",
    valorAnterior: "",
    valorNuevo: "",
    usuarioModificacion: ""
  });

  // Id de búsqueda / consulta
  const [searchId, setSearchId] = useState("");

  // Token Bearer obtenido automáticamente
  const [token, setToken] = useState("");

  // Modo consulta (true) / modo alta (false)
  const [modoConsulta, setModoConsulta] = useState(true);

  // Mensajes informativos
  const [mensaje, setMensaje] = useState("");

  // =============================================================
  // 📌 1) OBTENER TOKEN AUTOMÁTICAMENTE
  // =============================================================
  const obtenerToken = async () => {
    try {
      const res = await fetch("https://apitest.soliss.org/tokenservice/token", {
        method: "GET",
        headers: {
          "usuario": "030119",
          "password": "12Isa_Jime6"
        }
      });

      if (!res.ok) {
        console.error("❗ Error al obtener token");
        return null;
      }

      const data = await res.json();
      setToken(data.token);
      return data.token;

    } catch (error) {
      console.error("❗ Excepción token:", error);
      return null;
    }
  };

  // Si no hay token, lo solicita
  const asegurarToken = async () => {
    if (!token) return await obtenerToken();
    return token;
  };

  // =============================================================
  // 📌 2) CARGAR LISTADO DE AUDITORÍAS
  // =============================================================
  const cargarListado = async () => {
    try {
      const t = await asegurarToken();

      const res = await fetch("https://apitest.soliss.org/informes/api/Auditoria", {
        headers: {
          Authorization: `Bearer ${t}`
        }
      });

      const data = await res.json();
      setLista(data);

    } catch (error) {
      console.error("❗ Error listado auditoría:", error);
    }
  };

  useEffect(() => {
    cargarListado();
  }, []);

  // =============================================================
  // 📌 3) GET UNA FILA DE AUDITORÍA POR ID
  // =============================================================
  const handleGet = async () => {
    try {
      const t = await asegurarToken();

      const res = await fetch(
        `https://apitest.soliss.org/informes/api/Auditoria/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${t}`
          }
        }
      );

      if (!res.ok) {
        setMensaje(`❗ No existe registro con ID ${searchId}`);
        return;
      }

      const data = await res.json();

      setFormData(data);
      setModoConsulta(true);
      setMensaje("✔ Ficha cargada correctamente");

    } catch (e) {
      setMensaje("⚠ Error al cargar auditoría");
    }
  };

  // =============================================================
  // 📌 4) POST NUEVA AUDITORÍA
  // =============================================================
  const handleCreate = async () => {
    try {
      const t = await asegurarToken();

      const res = await fetch(
        "https://apitest.soliss.org/informes/api/Auditoria",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${t}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!res.ok) {
        setMensaje("❗ Error en creación");
        return;
      }

      setMensaje("✔ Auditoría creada correctamente");
      setModoConsulta(true);
      cargarListado();

    } catch (e) {
      setMensaje("⚠ Error al crear auditoría");
    }
  };

  // =============================================================
  // 📌 5) CAMBIOS EN LOS CONTROLES
  // =============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // =============================================================
  // 📌 6) NUEVA FICHA EN BLANCO
  // =============================================================
  const nuevaFicha = () => {
    setFormData({
      entidadModificada: "",
      entidadModificadaId: "",
      campoModificado: "",
      valorAnterior: "",
      valorNuevo: "",
      usuarioModificacion: ""
    });

    setModoConsulta(false);
    setMensaje("🆕 Modo alta");
  };

  // =============================================================
  // 📌 7) URL DEL AVATAR
  // =============================================================
  const obtenerAvatar = () => {
    if (!formData.usuarioModificacion) return "";
    return `https://intranet.soliss.es/intranet/fotos_empleados/thumbs/F${formData.usuarioModificacion}2.jpg`;
  };

  // =============================================================
  // 📌 RENDER DE LA UI
  // =============================================================
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      
      {/* =========================================================
          PANEL IZQUIERDO: LISTA DE AUDITORÍAS
      ========================================================== */}
      <div style={{ width: "45%", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Listado de auditorías</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>ID</th>
              <th>Entidad</th>
              <th>Usuario</th>
              <th>Avatar</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(a => (
              <tr
                key={a.id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSearchId(a.id);
                  setTimeout(handleGet, 100);
                }}
              >
                <td>{a.id}</td>
                <td>{a.entidadModificada}</td>
                <td>{a.usuarioModificacion}</td>
                <td>
                  <img
                    src={`https://intranet.soliss.es/intranet/fotos_empleados/thumbs/F${a.usuarioModificacion}2.jpg`}
                    alt="Foto"
                    style={{ width: "40px", borderRadius: "5px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          PANEL DERECHO: FICHA DETALLE
      ========================================================== */}
      <div style={{ width: "50%", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Ficha de auditoría</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>ID: </label>
          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleGet}>Consultar</button>
          <button onClick={nuevaFicha}>+ Nueva</button>
        </div>

        {/* FOTO */}
        {formData.usuarioModificacion && (
          <img
            src={obtenerAvatar()}
            alt="avatar"
            style={{ width: "80px", borderRadius: "10px", marginBottom: "20px" }}
          />
        )}

        {/* CAMPOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          <input
            name="entidadModificada"
            placeholder="Entidad"
            value={formData.entidadModificada}
            onChange={handleChange}
          />

          <input
            name="entidadModificadaId"
            placeholder="Entidad ID"
            value={formData.entidadModificadaId}
            onChange={handleChange}
          />

          <input
            name="campoModificado"
            placeholder="Campo modificado"
            value={formData.campoModificado}
            onChange={handleChange}
          />

          <input
            name="valorAnterior"
            placeholder="Valor anterior"
            value={formData.valorAnterior}
            onChange={handleChange}
          />

          <input
            name="valorNuevo"
            placeholder="Valor nuevo"
            value={formData.valorNuevo}
            onChange={handleChange}
          />

          <input
            name="usuarioModificacion"
            placeholder="Usuario modificación"
            value={formData.usuarioModificacion}
            onChange={handleChange}
          />
        </div>

        {/* BOTONES */}
        <div style={{ marginTop: "15px" }}>
          {!modoConsulta && (
            <>
              <button onClick={handleCreate}>Crear</button>
              <button onClick={() => setModoConsulta(true)}>Cancelar</button>
            </>
          )}
        </div>

        {/* MENSAJE */}
        <p style={{ marginTop: "10px", fontStyle: "italic" }}>{mensaje}</p>
      </div>

    </div>
  );
}
