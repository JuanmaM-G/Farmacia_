import { useState } from "react";

const AG_medi = async (response) => {
    const data = await response.json();

    if (response.ok) {
        return { tipo: "exito", texto: "Medicamento agregado correctamente." };
    }

    if (response.status === 400) {
        // El backend devuelve lista de errores de validación
        const detalle = data.errores ? data.errores.join(" | ") : data.error;
        return { tipo: "error", texto: `Datos inválidos: ${detalle}` };
    }

    if (response.status === 500) {
        return { tipo: "error", texto: "Error interno del servidor. Intenta de nuevo más tarde." };
    }

    return { tipo: "error", texto: `Error inesperado (código ${response.status}).` };
};

const AgregarMedicamento = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        marca: "",
        tipo: "",
        precio: ""
    });

    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(false); // Evita doble envío

    const validar = (datos) => {
        const nuevosErrores = {};

        if (!datos.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio.";
        } else if (datos.nombre.trim().length < 2) {
            nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.nombre.trim())) {
            nuevosErrores.nombre = "El nombre solo puede contener letras.";
        }

        if (datos.marca.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.marca.trim())) {
            nuevosErrores.marca = "La marca solo puede contener letras.";
        }

        const tiposValidos = ["Pastilla", "Jarabe", "Crema", "Gotas", "Inhalador"];
        if (!datos.tipo) {
            nuevosErrores.tipo = "El tipo es obligatorio.";
        } else if (!tiposValidos.includes(datos.tipo)) {
            nuevosErrores.tipo = "Selecciona un tipo válido.";
        }

        if (datos.precio === "") {
            nuevosErrores.precio = "El precio es obligatorio.";
        } else if (isNaN(datos.precio) || Number(datos.precio) < 0) {
            nuevosErrores.precio = "El precio debe ser un número positivo.";
        } else if (!/^\d+(\.\d{1,2})?$/.test(datos.precio)) {
            nuevosErrores.precio = "El precio puede tener máximo 2 decimales.";
        }

        return nuevosErrores;
    };

    const handleChange = (e) => {
        const nuevoFormData = { ...formData, [e.target.name]: e.target.value };
        setFormData(nuevoFormData);
        setErrores(validar(nuevoFormData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const erroresFinales = validar(formData);
        if (Object.keys(erroresFinales).length > 0) {
            setErrores(erroresFinales);
            return;
        }

        setCargando(true);
        setMensaje(null);

        try {
            const response = await fetch("http://localhost:5000/api/Medicamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const resultado = await manejarRespuesta(response);
            setMensaje(resultado);

            if (resultado.tipo === "exito") {
                setFormData({ nombre: "", marca: "", tipo: "", precio: "" });
                setErrores({});
            }

        } catch (error) {
            // fetch lanza excepción solo cuando no hay conexión al servidor
            setMensaje({
                tipo: "error",
                texto: "No se pudo conectar con el servidor. Verifica tu conexión."
            });
        } finally {
            setCargando(false);
        }
    };

    const estiloError = { color: "red", fontSize: "0.85rem", marginTop: "2px" };

    return (
        <>
            <div>
                <h1>Agregar Medicamento</h1>

                {mensaje && (
                    <p style={{ color: mensaje.tipo === "exito" ? "green" : "red" }}>
                        {mensaje.texto}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                        {errores.nombre && <p style={estiloError}>{errores.nombre}</p>}
                    </div>

                    <div>
                        <label htmlFor="marca">Marca:</label>
                        <input
                            type="text"
                            id="marca"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                        />
                        {errores.marca && <p style={estiloError}>{errores.marca}</p>}
                    </div>

                    <div>
                        <label htmlFor="tipo">Tipo:</label>
                        <select
                            id="tipo"
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                        >
                            <option value="">-- Selecciona un tipo --</option>
                            <option value="Pastilla">Pastilla</option>
                            <option value="Jarabe">Jarabe</option>
                            <option value="Crema">Crema</option>
                            <option value="Gotas">Gotas</option>
                            <option value="Inhalador">Inhalador</option>
                        </select>
                        {errores.tipo && <p style={estiloError}>{errores.tipo}</p>}
                    </div>

                    <div>
                        <label htmlFor="precio">Precio:</label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />
                        {errores.precio && <p style={estiloError}>{errores.precio}</p>}
                    </div>

                    {/* Deshabilita el botón mientras se envía para evitar doble submit */}
                    <button type="submit" disabled={cargando}>
                        {cargando ? "Guardando..." : "Agregar"}
                    </button>

                </form>
            </div>
        </>
    );
};

export default AG_medi;