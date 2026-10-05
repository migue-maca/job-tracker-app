import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/tabla.css";

export const metadata: Metadata = {
  title: "Gestor de Postulaciones",
  description: "Aplicación para registrar y seguir postulaciones de empleo",
};

export const viewport: Viewport = {
  themeColor: "#f5f5f5",
  width: "device-width",
  initialScale: 1,
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
