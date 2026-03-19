import { useEffect, useState } from "react";

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/Medicamento")
            .then(response => response.json())
            .then(data => {
                // AQUÍ es donde la consola te dirá qué llegó de la base de datos
                console.log("Datos recibidos de Flask:", data); 
                setMedicamentos(data);
            })
            .catch(error => console.error("Error con los datos de medicamentos", error));
    }, []);


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
                    </tr>
                </thead>
                <tbody>
                    {medicamentos.map((medica) => (  /*esta funcion vendria siendo un "li" en un html, aqui se encarga de */
                        <tr key={medica.id_medicamento}>
                            <td>{medica.nombre}</td>
                            <td>{medica.marca}</td>
                            <td>{medica.tipo}</td>
                            <td>{medica.precio}</td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default Medicamentos;