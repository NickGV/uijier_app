import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMiembroById } from '@/lib/firebase/client'; // Adjust the import based on your Firebase client setup
import ErrorBoundary from '@/components/error-boundary';
import Loading from '@/components/ui/loading'; // Assuming you have a loading component

const MiembroDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [miembro, setMiembro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchMiembro = async () => {
                try {
                    const data = await getMiembroById(id);
                    setMiembro(data);
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchMiembro();
        }
    }, [id]);

    if (loading) return <Loading />;
    if (error) return <div>Error loading miembro details: {error.message}</div>;

    return (
        <ErrorBoundary>
            <div>
                <h1>Miembro Details</h1>
                {miembro ? (
                    <div>
                        <h2>{miembro.name}</h2>
                        <p>{miembro.description}</p>
                        {/* Add more miembro details as needed */}
                    </div>
                ) : (
                    <p>No miembro found.</p>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default MiembroDetailPage;