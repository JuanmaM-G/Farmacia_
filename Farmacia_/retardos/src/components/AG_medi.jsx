import { useState } from "react";

const AG_medi = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        marca: "",
        tipo: "",
        precio: ""
    });


    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState(null);

    // =====================================================
    // VALIDACIÓN FRONTEND
    // Retorna un objeto con los errores encontrados.
    // Si está vacío, no hay errores.
    // =====================================================
    const validar = (datos) => {
        const nuevosErrores = {};

        // nombre: obligatorio, solo letras y espacios, mínimo 2 caracteres
        if (!datos.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio.";
        } else if (datos.nombre.trim().length < 2) {
            nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.nombre.trim())) {
            nuevosErrores.nombre = "El nombre solo puede contener letras.";
        }

        // marca: opcional, pero si se ingresa debe ser solo letras
        if (datos.marca.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.marca.trim())) {
            nuevosErrores.marca = "La marca solo puede contener letras.";
        }

        // tipo: obligatorio, debe ser uno de los valores del ENUM
        const tiposValidos = ["Pastilla", "Jarabe", "Crema", "Gotas", "Inhalador"];
        if (!datos.tipo) {
            nuevosErrores.tipo = "El tipo es obligatorio.";
        } else if (!tiposValidos.includes(datos.tipo)) {
            nuevosErrores.tipo = "Selecciona un tipo válido.";
        }

        // precio: obligatorio, debe ser número positivo con máximo 2 decimales
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


        const nuevosErrores = validar(nuevoFormData);
        setErrores(nuevosErrores);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valida antes de enviar
        const erroresFinales = validar(formData);
        if (Object.keys(erroresFinales).length > 0) {
            setErrores(erroresFinales);
            return; // Detiene el envío si hay errores
        }

        try {
            const response = await fetch("http://localhost:5000/api/Medicamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: "Medicamento agregado correctamente." });
                setFormData({ nombre: "", marca: "", tipo: "", precio: "" });
                setErrores({});
            } else {
                // Muestra el error que devuelve el backend
                setMensaje({ tipo: "error", texto: data.error || "Error al agregar medicamento." });
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor." });
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
                        {/* Muestra error solo si existe para este campo */}
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

                    <button type="submit">Agregar</button>
                </form>
            </div>
        </>
    );
};

export default AG_medi;