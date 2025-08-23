"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DebugInfo, TestResult } from "@/app/types";

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/auth");
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error("Error fetching debug info:", error);
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test-admin-login" }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      console.error("Error testing admin login:", error);
    } finally {
      setLoading(false);
    }
  };

  const tryLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/usuarios-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "admin",
          password: "admin123",
          createSession: true,
        }),
      });
      const data = await response.json();
      setTestResult(data);

      if (data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error trying login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Diagnóstico de Autenticación</h1>

      <div className="flex gap-4">
        <Button onClick={fetchDebugInfo} disabled={loading}>
          Obtener Info de Diagnóstico
        </Button>
        <Button onClick={testAdminLogin} disabled={loading} variant="outline">
          Probar Usuario Admin
        </Button>
        <Button onClick={tryLogin} disabled={loading} variant="secondary">
          Intentar Login Completo
        </Button>
      </div>

      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado de Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            1. <strong>Obtener Info de Diagnóstico</strong>: Verifica la
            configuración del sistema
          </p>
          <p>
            2. <strong>Probar Usuario Admin</strong>: Verifica que el usuario
            admin existe y la contraseña es correcta
          </p>
          <p>
            3. <strong>Intentar Login Completo</strong>: Prueba el flujo
            completo de login
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Credenciales de emergencia: <code>admin / admin123</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
