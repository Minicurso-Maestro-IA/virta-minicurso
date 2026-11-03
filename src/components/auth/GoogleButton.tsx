import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { isGoogleEnabled } from "@/config/env";

type GoogleButtonProps = {
  /** Recebe o ID token (credential) devolvido pelo Google. */
  onCredential: (credential: string) => void;
  onError?: () => void;
};

export function GoogleButton({ onCredential, onError }: GoogleButtonProps) {
  const { t } = useTranslation();

  // Sem Client ID nao ha login com Google: a tela nao mostra nem o botao nem o
  // separador "ou". O separador mora aqui dentro justamente para sumir junto.
  if (!isGoogleEnabled) return null;

  return (
    <>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs uppercase tracking-wide text-zinc-400">
          {t("login.google.or")}
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>
      <div className="flex justify-center [color-scheme:light]">
        <GoogleLogin
          onSuccess={(res) => {
            if (res.credential) onCredential(res.credential);
            else onError?.();
          }}
          onError={() => onError?.()}
          text="signin_with"
          shape="rectangular"
        />
      </div>
    </>
  );
}
