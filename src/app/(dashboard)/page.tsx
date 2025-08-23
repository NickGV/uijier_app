"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { Calculator, Users, UserCheck, Clock, Settings, Home } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Conteo",
        description: "Registrar asistencia del servicio",
        icon: Calculator,
        path: "/conteo",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
      {
        title: "Simpatizantes",
        description: "Gestionar visitantes",
        icon: Users,
        path: "/simpatizantes",
        color: "bg-green-50 text-green-700 border-green-200",
      },
    ];

    if (user?.rol !== "ujier") {
      baseActions.push(
        {
          title: "Historial",
          description: "Ver registros anteriores",
          icon: Clock,
          path: "/historial",
          color: "bg-purple-50 text-purple-700 border-purple-200",
        },
        {
          title: "Ujieres",
          description: user?.rol === "admin" ? "Gestionar usuarios" : "Ver usuarios",
          icon: Settings,
          path: "/ujieres",
          color: "bg-orange-50 text-orange-700 border-orange-200",
        }
      );
    }

    if (user?.rol === "admin") {
      baseActions.push({
        title: "Miembros",
        description: "Gestionar miembros de la iglesia",
        icon: UserCheck,
        path: "/miembros",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      });
    }

    return baseActions;
  };

  const quickActions = getQuickActions();

  const getRoleDisplayName = (rol: string) => {
    switch (rol) {
      case "admin":
        return "Administrador";
      case "directiva":
        return "Directiva";
      default:
        return "Ujier";
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                ¡Bienvenido, {user?.nombre}!
              </CardTitle>
              <p className="text-sm text-gray-600">
                {getRoleDisplayName(user?.rol || "")}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Home className="w-5 h-5" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.path}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-start gap-2 ${action.color} hover:shadow-md transition-all`}
                  onClick={() => router.push(action.path)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{action.title}</span>
                  </div>
                  <p className="text-xs text-left opacity-75">
                    {action.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats or Additional Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">--</div>
              <div className="text-xs text-gray-600">Simpatizantes</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">--</div>
              <div className="text-xs text-gray-600">Miembros</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Datos actualizados en tiempo real
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
