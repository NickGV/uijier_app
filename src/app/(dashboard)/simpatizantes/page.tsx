import React from 'react';
import { useEffect, useState } from 'react';
import { fetchSimpatizantes } from '../../../lib/utils'; // Assuming a utility function to fetch data

const SimpatizantesPage = () => {
    const [simpatizantes, setSimpatizantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSimpatizantes = async () => {
            try {
                const data = await fetchSimpatizantes();
                setSimpatizantes(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadSimpatizantes();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading simpatizantes: {error.message}</div>;

    return (
        <div>
            <h1>Simpatizantes</h1>
            <ul>
                {simpatizantes.map((simpatizante) => (
                    <li key={simpatizante.id}>
                        {simpatizante.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SimpatizantesPage;