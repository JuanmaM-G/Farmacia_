import { useEffect, useState } from "react";
import Edit_medi from "./Edit_medi";

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [medicamentoEditar, setMedicamentoEditar] = useState(null);
    const [busqueda, setBusqueda] = useState("");               

    
    const fetchMedicamentos = (marca = "") => {
        const url = marca
            ? `http://localhost:5000/api/Medicamento?marca=${encodeURIComponent(marca)}`
            : "http://localhost:5000/api/Medicamento";

        fetch(url)
            .then(response => response.json())
            .then(data => setMedicamentos(data))
            .catch(error => console.error("Error con los datos de medicamentos", error));
    };

    useEffect(() => {
        fetchMedicamentos();
    }, []);

    
    const handleBusqueda = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);
        fetchMedicamentos(valor);
    };

    const handleEliminar = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/Medicamento/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setMedicamentos(medicamentos.filter(m => m.id_medicamento !== id));
            } else {
                console.error("Error al eliminar el medicamento");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    if (medicamentoEditar) {
        return (
            <Edit_medi
                medicamento={medicamentoEditar}
                onVolver={() => {
                    setMedicamentoEditar(null);
                    fetchMedicamentos(busqueda); 
                }}
            />
        );
    }

    return (
        <div>
            <h1>Medicamentos</h1>

       
            <input
                type="text"
                placeholder="Buscar por marca..."
                value={busqueda}
                onChange={handleBusqueda}
            />

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