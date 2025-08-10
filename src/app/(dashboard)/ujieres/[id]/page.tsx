import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUjierById } from '@/lib/utils'; // Assuming you have a utility function to fetch ujier data

const UjierDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [ujier, setUjier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchUjier = async () => {
                try {
                    const data = await getUjierById(id);
                    setUjier(data);
                } catch (err) {
                    setError('Failed to load ujier details');
                } finally {
                    setLoading(false);
                }
            };

            fetchUjier();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Ujier Details</h1>
            {ujier ? (
                <div>
                    <h2>{ujier.name}</h2>
                    <p>{ujier.description}</p>
                    {/* Add more ujier details as needed */}
                </div>
            ) : (
                <p>No ujier found.</p>
            )}
        </div>
    );
};

export default UjierDetailPage;