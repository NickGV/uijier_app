import React from 'react';
import { useEffect, useState } from 'react';
import { fetchUjieres } from '@/lib/utils'; // Assuming a utility function to fetch ujieres

const UjieresPage = () => {
    const [ujieres, setUjieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUjieres = async () => {
            try {
                const data = await fetchUjieres();
                setUjieres(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getUjieres();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Ujieres List</h1>
            <ul>
                {ujieres.map((ujier) => (
                    <li key={ujier.id}>
                        <a href={`/ujieres/${ujier.id}`}>{ujier.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UjieresPage;