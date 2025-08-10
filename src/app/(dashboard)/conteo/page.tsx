import React from "react";
import BottomNavigation from "@/components/bottom-navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ConteoPage() {
  const user = await getCurrentUser();
  // All roles can access conteo
  return (
    <div className="pb-24 px-4">
      <h1 className="text-2xl font-semibold my-4">Conteo</h1>
      <p className="text-sm text-gray-600">Realiza el conteo.</p>
      <BottomNavigation />
    </div>
  );
}
