import { useState } from "react";

const AG_medi = () => {
  
    const [formData, setFormData] = useState({
        nombre: "",
        marca: "",
        tipo: "",
        precio: ""
    });

    const [mensaje, setMensaje] = useState(null); r

    // Actualiza el campo correspondiente en el estado cuando el usuario escribe
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); 

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
            } else {
                setMensaje({ tipo: "error", texto: data.error || "Error al agregar medicamento." });
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            setMensaje({ tipo: "error", texto: "No se pudo conectar con el servidor." });
        }
    };

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

                    <button type="submit">Agregar</button>
                </form>
            </div>
        </>
    );
};

export default AG_medi;