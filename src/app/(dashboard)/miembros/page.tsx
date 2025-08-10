import React from 'react';
import { useEffect, useState } from 'react';
import { fetchMiembros } from '@/lib/utils'; // Assuming you have a utility function to fetch miembros

const MiembrosPage = () => {
    const [miembros, setMiembros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMiembros = async () => {
            try {
                const data = await fetchMiembros();
                setMiembros(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getMiembros();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading miembros: {error.message}</div>;

    return (
        <div>
            <h1>Miembros</h1>
            <ul>
                {miembros.map((miembro) => (
                    <li key={miembro.id}>
                        <a href={`/dashboard/miembros/${miembro.id}`}>{miembro.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MiembrosPage;