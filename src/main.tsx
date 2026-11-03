import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { env } from "@/config/env";
import { instalarServidorFalso } from "@/mock/servidor";

// Fork de aula: não há backend. O servidor falso responde as rotas da API a
// partir do navegador, e precisa estar de pé antes do primeiro render.
instalarServidorFalso();

function Root() {
  const { i18n } = useTranslation();
  // The Google button text follows the app language. The `key` forces a reload
  // of the GIS script when the user switches between PT/EN.
  const locale = i18n.language.startsWith("en") ? "en" : "pt-BR";

  return (
    <GoogleOAuthProvider
      key={locale}
      clientId={env.googleClientId}
      locale={locale}
    >
      {/* basename: o site é publicado numa subpasta do GitHub Pages. */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <App />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<FullScreenLoader />}>
      <Root />
    </Suspense>
  </StrictMode>,
);
