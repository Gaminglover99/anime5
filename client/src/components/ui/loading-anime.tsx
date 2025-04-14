import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingAnimeProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingAnime = ({ text = "Loading...", size = "md", className }: LoadingAnimeProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className={cn("mt-2 text-muted-foreground", textClasses[size])}>{text}</p>}
    </div>
  );
};

export default LoadingAnime;