import React, { useState, useEffect } from "react";
import "./styles.css";

export default function ProductForm() {
  // -------------------- TOKEN -----------------------
  const [token, setToken] = useState("");

  // -------------------- FORMULARIO -----------------------
  const [modoConsulta, setModoConsulta] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    price: 0,
    description: "",
    category: "",
    image: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // -------------------- LISTADO DE PRODUCTOS -----------------------
  const [productos, setProductos] = useState([]);

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
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProductos(data || []);
    } catch (err) {
      console.log("Error al cargar productos", err);
    }
  };

  // -------------------- FUNCIONES FORMULARIO -----------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGet = async () => {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${searchId}`);
      if (!res.ok) {
        setMensaje(`❗ Producto no encontrado`);
        return;
      }
      const data = await res.json();
      setFormData(data);
      setMensaje("✔ Producto cargado");
      setModoConsulta(true);
    } catch (err) {
      setMensaje("⚠ Error al conectar con API");
    }
  };

  const handleNuevo = () => {
    setFormData({ id: 0, title: "", price: 0, description: "", category: "", image: "" });
    setMensaje("🆕 Introduzca datos para crear un producto");
    setModoConsulta(false);
    setMostrarFormulario(true);
  };

  const handleCancel = () => {
    setFormData({ id: 0, title: "", price: 0, description: "", category: "", image: "" });
    setMensaje("");
    setModoConsulta(true);
    setMostrarFormulario(false);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setMensaje(`✔ Producto creado con ID: ${data.id || "?"}`);
      setModoConsulta(true);
      cargarProductos();
    } catch (err) {
      setMensaje("⚠ Error al crear producto");
    }
  };

  // -------------------- CLICK EN FILA -----------------------
  const handleFilaClick = (producto) => {
    setFormData(producto);
    setModoConsulta(true);
    setMensaje(`✔ Producto ID ${producto.id} cargado`);
    setMostrarFormulario(true);
  };

  // -------------------- RENDER -----------------------
  return (
    <div className="product-container">
      {/* ---------------- BANDA SUPERIOR ---------------- */}
      <header className="product-header">
        <h1 className="product-header__title">🛒 Gestor de Productos</h1>
        <div className="product-header__buttons">
          <button 
            className="btn-header btn-header--nuevo"
            onClick={handleNuevo}
          >
            ➕ Nuevo Producto
          </button>
          <button 
            className="btn-header btn-header--toggle"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? "◀ Ocultar Panel" : "▶ Mostrar Panel"}
          </button>
        </div>
      </header>

      {/* ---------------- CONTENIDO PRINCIPAL ---------------- */}
      <div className="product-content">
        
        {/* ---------------- FORMULARIO (DESPLEGABLE) ---------------- */}
        {mostrarFormulario && (
          <div className="form-panel">
            <div className="form-panel__header">
              <h3 className="form-panel__title">
                {modoConsulta ? "📋 Detalle del Producto" : "✏️ Nuevo Producto"}
              </h3>
              <button 
                onClick={() => setMostrarFormulario(false)}
                className="form-panel__close"
              >
                ✕
              </button>
            </div>
            
            <div className="form-panel__body">
              {modoConsulta && (
                <div className="search-group">
                  <input
                    type="number"
                    placeholder="Buscar por ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="search-input"
                  />
                  <button onClick={handleGet} className="btn-search">
                    🔍
                  </button>
                </div>
              )}

              {formData.image && (
                <img
                  src={formData.image}
                  alt="producto"
                  className="product-image"
                />
              )}

              <div className="input-group">
                <label className="input-label">Título</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  disabled={modoConsulta}
                  className="input-field"
                />
              </div>

              <div className="input-group--row">
                <div className="input-group input-group--flex">
                  <label className="input-label">Precio</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={modoConsulta}
                    className="input-field"
                  />
                </div>
                <div className="input-group input-group--flex">
                  <label className="input-label">Categoría</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Categoría"
                    disabled={modoConsulta}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                  disabled={modoConsulta}
                  className="textarea-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">URL Imagen</label>
                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  disabled={modoConsulta}
                  className="input-field"
                />
              </div>

              <div className="btn-group">
                {modoConsulta ? (
                  <button onClick={handleNuevo} className="btn-primary">
                    ➕ Nuevo
                  </button>
                ) : (
                  <>
                    <button onClick={handleCreate} className="btn-primary">
                      ✔ Crear
                    </button>
                    <button onClick={handleCancel} className="btn-danger">
                      ✖ Cancelar
                    </button>
                  </>
                )}
              </div>

              {mensaje && <div className="mensaje">{mensaje}</div>}
            </div>
          </div>
        )}

        {/* ---------------- LISTADO PRODUCTOS ---------------- */}
        <div className="list-panel">
          <div className="list-panel__header">
            <h3 className="list-panel__title">📦 Listado de Productos ({productos.length})</h3>
          </div>
          <div className={`list-panel__body ${mostrarFormulario ? 'list-panel__body--expanded' : ''}`}>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th className="product-table th--center">Precio</th>
                  <th className="product-table th--category">Categoría</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id} onClick={() => handleFilaClick(prod)}>
                    <td>
                      <img src={prod.image} alt="producto" className="product-table__image" />
                    </td>
                    <td>{prod.title}</td>
                    <td className="product-table td--price">${prod.price}</td>
                    <td className="product-table td--category">
                      <span className="category-badge">{prod.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
