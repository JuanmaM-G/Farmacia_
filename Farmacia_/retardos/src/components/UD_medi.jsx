import { useState } from "react";


const manejarRespuesta = async (response) => {
    const data = await response.json();
    if (response.ok)
        return { tipo: "exito", texto: "Medicamento actualizado correctamente." };
    if (response.status === 400) {
        const detalle = data.errores ? data.errores.join(" | ") : data.error;
        return { tipo: "error", texto: `Datos inválidos: ${detalle}` };
    }
    if (response.status === 500)
        return { tipo: "error", texto: "Error interno del servidor. Intenta de nuevo más tarde." };
    return { tipo: "error", texto: `Error inesperado (código ${response.status}).` };
};

const UD_medi = ({ medicamento, onVolver }) => {
    const [formData, setFormData] = useState({
        nombre: medicamento.nombre,
        marca:  medicamento.marca || "",
        tipo:   medicamento.tipo,
        precio: medicamento.precio
    });
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(false);

    const validar = (datos) => {
        const e = {};
        if (!datos.nombre.trim()) e.nombre = "El nombre es obligatorio.";
        else if (datos.nombre.trim().length < 2) e.nombre = "Mínimo 2 caracteres.";
        else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.nombre.trim())) e.nombre = "Solo puede contener letras.";
        if (datos.marca.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(datos.marca.trim())) e.marca = "Solo puede contener letras.";
        const tiposValidos = ["Pastilla", "Jarabe", "Crema", "Gotas", "Inhalador"];
        if (!datos.tipo) e.tipo = "El tipo es obligatorio.";
        else if (!tiposValidos.includes(datos.tipo)) e.tipo = "Selecciona un tipo válido.";
        if (datos.precio === "" || datos.precio === null) e.precio = "El precio es obligatorio.";
        else if (isNaN(datos.precio) || Number(datos.precio) < 0) e.precio = "Debe ser un número positivo.";
        else if (!/^\d+(\.\d{1,2})?$/.test(String(datos.precio))) e.precio = "Máximo 2 decimales.";
        return e;
    };

    const handleChange = (e) => {
        const nuevo = { ...formData, [e.target.name]: e.target.value };
        setFormData(nuevo);
        setErrores(validar(nuevo));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const erroresFinales = validar(formData);
        if (Object.keys(erroresFinales).length > 0) { setErrores(erroresFinales); return; }
        setCargando(true);
        setMensaje(null);
        try {
            const response = await fetch(`http://localhost:5000/api/Medicamento/${medicamento.id_medicamento}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const resultado = await manejarRespuesta(response);
            setMensaje(resultado);
        } catch {
            setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor. Verifica tu conexión." });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="pagina">
            <h1>Editar Medicamento</h1>

            <div className="formulario">
                {mensaje && (
                    <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text" id="nombre" name="nombre"
                            value={formData.nombre} onChange={handleChange}
                            className={errores.nombre ? "error-input" : ""}
                        />
                        {errores.nombre && <span className="error-msg">{errores.nombre}</span>}
                    </div>

                    <div className="campo">
                        <label htmlFor="marca">Marca</label>
                        <input
                            type="text" id="marca" name="marca"
                            value={formData.marca} onChange={handleChange}
                            className={errores.marca ? "error-input" : ""}
                        />
                        {errores.marca && <span className="error-msg">{errores.marca}</span>}
                    </div>

                    <div className="campo">
                        <label htmlFor="tipo">Tipo</label>
                        <select
                            id="tipo" name="tipo"
                            value={formData.tipo} onChange={handleChange}
                            className={errores.tipo ? "error-input" : ""}
                        >
                            <option value="">-- Selecciona un tipo --</option>
                            <option value="Pastilla">Pastilla</option>
                            <option value="Jarabe">Jarabe</option>
                            <option value="Crema">Crema</option>
                            <option value="Gotas">Gotas</option>
                            <option value="Inhalador">Inhalador</option>
                        </select>
                        {errores.tipo && <span className="error-msg">{errores.tipo}</span>}
                    </div>

                    <div className="campo">
                        <label htmlFor="precio">Precio</label>
                        <input
                            type="number" id="precio" name="precio"
                            value={formData.precio} onChange={handleChange}
                            min="0" step="0.01"
                            className={errores.precio ? "error-input" : ""}
                        />
                        {errores.precio && <span className="error-msg">{errores.precio}</span>}
                    </div>

                    <div className="acciones-formulario">
                        <button type="submit" className="btn btn-primario" disabled={cargando}>
                            {cargando ? "Guardando..." : "Guardar cambios"}
                        </button>
                        <button type="button" className="btn btn-secundario" onClick={onVolver} disabled={cargando}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UD_medi;