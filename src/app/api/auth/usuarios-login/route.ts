import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const verifyPassword = (
  password: string,
  encryptedPassword: string
): boolean => {
  const salt = "ujier_salt_2025";
  return btoa(password + salt) === encryptedPassword;
};

export async function GET() {
  try {
    const usuariosSnapshot = await adminDb.collection("usuarios").get();
    const usuarios = usuariosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, password } = await req.json();

    if (!nombre || !password) {
      return NextResponse.json(
        { error: "Nombre y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Buscar usuario por nombre
    const usuariosSnapshot = await adminDb
      .collection("usuarios")
      .where("nombre", "==", nombre.trim())
      .get();

    if (usuariosSnapshot.empty) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    const userDoc = usuariosSnapshot.docs[0];
    const userData = userDoc.data();

    // Verificar si el usuario está activo (los admins siempre están activos)
    if (!userData.activo && userData.rol !== "admin") {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 401 });
    }

    // Verificar contraseña usando el mismo sistema de la aplicación anterior
    const isValidPassword = verifyPassword(password, userData.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Retornar datos del usuario (sin la contraseña)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = userData;
    return NextResponse.json({
      success: true,
      user: {
        id: userDoc.id,
        ...userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return NextResponse.json(
      { error: "Error al autenticar usuario" },
      { status: 500 }
    );
  }
}
