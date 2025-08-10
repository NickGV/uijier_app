import React from "react";
import BottomNavigation from "@/components/bottom-navigation";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HistorialPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "directiva" && user.role !== "admin"))
    redirect("/(dashboard)");

  return (
    <div className="pb-24 px-4">
      <h1 className="text-2xl font-semibold my-4">Historial</h1>
      <p className="text-sm text-gray-600">Historial de conteos y acciones.</p>
      <BottomNavigation />
    </div>
  );
}
