import { useEffect, useState } from "react";
import UD_medi from "./UD_medi";


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

    useEffect(() => { fetchMedicamentos(); }, []);

    const handleBusqueda = (e) => {
        const valor = e.target.value;
        setBusqueda(valor);
        fetchMedicamentos(valor);
    };

    const handleEliminar = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/Medicamento/${id}`, { method: "DELETE" });
            if (response.ok) setMedicamentos(medicamentos.filter(m => m.id_medicamento !== id));
            else console.error("Error al eliminar el medicamento");
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    if (medicamentoEditar) {
        return (
            <UD_medi
                medicamento={medicamentoEditar}
                onVolver={() => { setMedicamentoEditar(null); fetchMedicamentos(busqueda); }}
            />
        );
    }

    return (
        <div className="pagina">
            <h1>Medicamentos</h1>

            <div className="barra-busqueda">
                <input
                    type="text"
                    placeholder="Buscar por marca..."
                    value={busqueda}
                    onChange={handleBusqueda}
                />
            </div>

            <div className="tabla-wrapper">
                <table className="tabla-medicamentos">
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
                        {medicamentos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="sin-resultados">
                                    No se encontraron medicamentos.
                                </td>
                            </tr>
                        ) : (
                            medicamentos.map((medica) => (
                                <tr key={medica.id_medicamento}>
                                    <td>{medica.nombre}</td>
                                    <td>{medica.marca}</td>
                                    <td>{medica.tipo}</td>
                                    <td>${Number(medica.precio).toFixed(2)}</td>
                                    <td>
                                        <button className="btn btn-advertencia" onClick={() => setMedicamentoEditar(medica)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-peligro" onClick={() => handleEliminar(medica.id_medicamento)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Medicamentos;