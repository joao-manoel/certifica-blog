import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorState({
  message,
  onRetry,
  isLoading,
}: {
  message?: string;
  onRetry: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-3xl border border-[#e0b5a3] bg-[#fff6f1] px-6 py-14 text-center">
      <AlertTriangle
        className="mx-auto size-8 text-secondary"
        aria-hidden="true"
      />
      <p className="mt-4 font-oswald text-2xl font-bold uppercase text-primary">
        Não foi possível carregar os artigos
      </p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-[#62655f]">
        {message ??
          "Houve uma falha temporária na conexão. Tente novamente em alguns instantes."}
      </p>
      <Button
        variant="outline"
        onClick={onRetry}
        disabled={isLoading}
        className="mt-6 min-h-11 border-primary bg-transparent px-5 text-primary"
      >
        {isLoading ? "Tentando novamente..." : "Tentar novamente"}
      </Button>
    </div>
  );
}
