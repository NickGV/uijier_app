import React from "react";
import BottomNavigation from "@/components/bottom-navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="pb-24 px-4">
      <h1 className="text-2xl font-semibold my-4">Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">
        Bienvenido{user?.email ? `, ${user.email}` : ""}.
      </p>
      <div className="flex justify-end">
        <LogoutButton />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={"/conteo" as const}
          className="border rounded p-4 hover:bg-gray-50"
        >
          Conteo
        </Link>
        <Link
          href={"/simpatizantes" as const}
          className="border rounded p-4 hover:bg-gray-50"
        >
          Simpatizantes
        </Link>
        {user?.role !== "ujier" && (
          <Link
            href={"/historial" as const}
            className="border rounded p-4 hover:bg-gray-50"
          >
            Historial
          </Link>
        )}
        {user?.role !== "ujier" && (
          <Link
            href={"/ujieres" as const}
            className="border rounded p-4 hover:bg-gray-50"
          >
            Ujieres
          </Link>
        )}
        {/* Admin section pending */}
      </div>
      <BottomNavigation />
    </div>
  );
}
