"use client";
import React, { useEffect, useState } from "react";
import { fetchSimpatizantes } from "@/lib/utils";
type Item = { id: string; name: string };

const SimpatizantesPage = () => {
  const [simpatizantes, setSimpatizantes] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSimpatizantes = async () => {
      try {
        const data = await fetchSimpatizantes();
        setSimpatizantes(data);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error cargando simpatizantes";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadSimpatizantes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading simpatizantes: {error}</div>;

  return (
    <div>
      <h1>Simpatizantes</h1>
      <ul>
        {simpatizantes.map((simpatizante) => (
          <li key={simpatizante.id}>
            <span>{simpatizante.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimpatizantesPage;
