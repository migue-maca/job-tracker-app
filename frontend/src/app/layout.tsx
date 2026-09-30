import type { Metadata } from "next";
import "./globals.css";
import "../styles/tabla.css";

export const metadata: Metadata = {
  title: "Gestor de Postulaciones",
  description: "Aplicación para registrar y seguir postulaciones de empleo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
