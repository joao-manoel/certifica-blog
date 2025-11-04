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
    <div className="text-center py-12 space-y-4">
      <p className="text-red-500">
        Falha ao carregar posts{message ? `: ${message}` : ""}
      </p>
      <Button variant="outline" onClick={onRetry} disabled={isLoading}>
        Tentar novamente
      </Button>
    </div>
  );
}
