import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const userCookie = cookieStore.get("session-user")?.value;
    
    const debug = {
      timestamp: new Date().toISOString(),
      cookies: {
        session: sessionCookie ? "presente" : "ausente",
        sessionUser: userCookie ? "presente" : "ausente",
      },
      firebase: {
        adminAuth: !!adminAuth,
        adminDb: !!adminDb,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasFirebaseProject: !!process.env.FIREBASE_PROJECT_ID,
        hasFirebaseServiceAccount: !!(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || 
                                      (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)),
      }
    };
    
    // Intentar obtener usuarios de la base de datos
    try {
      const usuariosSnapshot = await adminDb.collection("usuarios").limit(1).get();
      debug.firebase = {
        ...debug.firebase,
        canAccessFirestore: !usuariosSnapshot.empty,
        userCount: usuariosSnapshot.size,
      };
    } catch (firestoreError) {
      debug.firebase = {
        ...debug.firebase,
        canAccessFirestore: false,
        firestoreError: firestoreError instanceof Error ? firestoreError.message : "Error desconocido",
      };
    }
    
    // Si hay cookie de usuario, intentar parsearla
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        debug.cookies = {
          ...debug.cookies,
          sessionUserData: {
            id: userData.id,
            nombre: userData.nombre,
            rol: userData.rol,
            activo: userData.activo,
          }
        };
      } catch (parseError) {
        debug.cookies = {
          ...debug.cookies,
          sessionUserParseError: parseError instanceof Error ? parseError.message : "Error de parsing",
        };
      }
    }
    
    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Error en diagnóstico", 
        message: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json();
    
    if (action === "test-admin-login") {
      // Probar login con credenciales admin
      const nombre = "admin";
      const password = "admin123";
      
      const usuariosSnapshot = await adminDb
        .collection("usuarios")
        .where("nombre", "==", nombre)
        .get();
      
      if (usuariosSnapshot.empty) {
        return NextResponse.json({ 
          success: false, 
          error: "Usuario admin no encontrado",
          suggestion: "Ejecutar script para crear usuario admin"
        });
      }
      
      const userDoc = usuariosSnapshot.docs[0];
      const userData = userDoc.data();
      
      // Probar verificación de contraseña
      const salt = "ujier_salt_2025";
      const expectedPassword = btoa(password + salt);
      const passwordMatch = userData.password === expectedPassword;
      
      return NextResponse.json({
        success: true,
        userFound: true,
        passwordMatch,
        userData: {
          id: userDoc.id,
          nombre: userData.nombre,
          rol: userData.rol,
          activo: userData.activo,
          hasPassword: !!userData.password,
        },
        expectedPassword,
        storedPassword: userData.password,
      });
    }
    
    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Error en prueba", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      }, 
      { status: 500 }
    );
  }
}
