import { useState } from "react";

const Edit_medi = ({ medicamento, onVolver }) => {


    const [formData, setFormData] = useState({
        nombre: medicamento.nombre,
        marca:  medicamento.marca  || "",
        tipo:   medicamento.tipo,
        precio: medicamento.precio
    });

    const [mensaje, setMensaje] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/Medicamento/${medicamento.id_medicamento}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: "Medicamento actualizado correctamente." });
            } else {
                setMensaje({ tipo: "error", texto: data.error || "Error al actualizar." });
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor." });
        }
    };

    return (
        <div>
            <h1>Editar Medicamento</h1>

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
                        required
                    />
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
                </div>

                <div>
                    <label htmlFor="tipo">Tipo:</label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Selecciona un tipo --</option>
                        <option value="Pastilla">Pastilla</option>
                        <option value="Jarabe">Jarabe</option>
                        <option value="Crema">Crema</option>
                        <option value="Gotas">Gotas</option>
                        <option value="Inhalador">Inhalador</option>
                    </select>
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
                        required
                    />
                </div>

                <button type="submit">Guardar cambios</button>


                <button type="button" onClick={onVolver}>
                    Cancelar
                </button>

            </form>
        </div>
    );
};

export default Edit_medi;