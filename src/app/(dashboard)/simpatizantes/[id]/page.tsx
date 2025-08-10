import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSimpatizanteById } from '@/lib/firebase/client'; // Adjust the import based on your Firebase client setup
import ErrorBoundary from '@/components/error-boundary';

const SimpatizanteDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [simpatizante, setSimpatizante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchSimpatizante = async () => {
        try {
          const data = await getSimpatizanteById(id);
          setSimpatizante(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchSimpatizante();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading simpatizante details.</div>;

  return (
    <div>
      <h1>Simpatizante Details</h1>
      {simpatizante ? (
        <div>
          <h2>{simpatizante.name}</h2>
          <p>{simpatizante.description}</p>
          {/* Add more fields as necessary */}
        </div>
      ) : (
        <p>No details found for this simpatizante.</p>
      )}
    </div>
  );
};

const Page = () => (
  <ErrorBoundary>
    <SimpatizanteDetail />
  </ErrorBoundary>
);

export default Page;