"use client";
import React, { useEffect, useState } from "react";
import { fetchMiembros } from "@/lib/utils";
import Link from "next/link";
type Item = { id: string; name: string };

const MiembrosPage = () => {
  const [miembros, setMiembros] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMiembros = async () => {
      try {
        const data = await fetchMiembros();
        setMiembros(data);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error cargando miembros";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    getMiembros();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading miembros: {error}</div>;

  return (
    <div>
      <h1>Miembros</h1>
      <ul>
        {miembros.map((miembro) => (
          <li key={miembro.id}>
            <Link href={`/miembros/${miembro.id}` as const}>
              {miembro.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MiembrosPage;
