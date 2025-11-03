import { Card } from "@/components/ui/card";

interface AdPlaceholderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const AdPlaceholder = ({
  size = "medium",
  className = "",
}: AdPlaceholderProps) => {
  const sizeClasses = {
    small: "h-32",
    medium: "h-64",
    large: "h-96",
  };

  return (
    <Card
      className={`bg-muted/30 border-dashed border-2 flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <div className="text-center text-muted-foreground">
        <p className="text-sm font-medium mb-1">Espaço para Anúncio</p>
        <p className="text-xs">Google Ads</p>
      </div>
    </Card>
  );
};
