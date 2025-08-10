import React from "react";
import BottomNavigation from "@/components/bottom-navigation";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UjieresPage() {
  const user = await getCurrentUser();
  if (!user || user.role === "ujier") redirect("/(dashboard)");
  return (
    <div className="pb-24 px-4">
      <h1 className="text-2xl font-semibold my-4">Ujieres</h1>
      <p className="text-sm text-gray-600">
        Activar o desactivar ujieres (sin modificar datos).
      </p>
      {/* TODO: Implementar listado y toggle activo/inactivo */}
      <BottomNavigation />
    </div>
  );
}
