import { useEffect, useState } from "react";
import Edit_medi from "./Edit_medi";

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [medicamentoEditar, setMedicamentoEditar] = useState(null); // null = no se está editando

    const fetchMedicamentos = () => {
        fetch("http://localhost:5000/api/Medicamento")
            .then(response => response.json())
            .then(data => setMedicamentos(data))
            .catch(error => console.error("Error con los datos de medicamentos", error));
    };

    useEffect(() => {
        fetchMedicamentos();
    }, []);

    // Eliminar medicamento por id
    const handleEliminar = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/Medicamento/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                // Actualiza la lista sin recargar la página
                setMedicamentos(medicamentos.filter(m => m.id_medicamento !== id));
            } else {
                console.error("Error al eliminar el medicamento");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    // Si hay un medicamento seleccionado para editar, muestra el formulario de edición
    if (medicamentoEditar) {
        return (
            <Edit_medi
                medicamento={medicamentoEditar}
                onVolver={() => {
                    setMedicamentoEditar(null); // Regresa a la tabla
                    fetchMedicamentos();         // Refresca los datos
                }}
            />
        );
    }

    return (
        <div>
            <h1>Medicamentos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Marca</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {medicamentos.map((medica) => (
                        <tr key={medica.id_medicamento}>
                            <td>{medica.nombre}</td>
                            <td>{medica.marca}</td>
                            <td>{medica.tipo}</td>
                            <td>{medica.precio}</td>
                            <td>
                                {/* Guarda el medicamento seleccionado y cambia la vista */}
                                <button onClick={() => setMedicamentoEditar(medica)}>
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(medica.id_medicamento)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Medicamentos;