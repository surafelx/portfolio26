import { motion } from "framer-motion";
import { Database, Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const LoadingSpinner = ({
  message = "Loading...",
  size = "md",
  showIcon = true
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {showIcon && (
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} text-primary`}
          >
            <Database size={size === "sm" ? 16 : size === "md" ? 24 : 32} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Loader2
              size={size === "sm" ? 16 : size === "md" ? 24 : 32}
              className={`${sizeClasses[size]} text-terminal-cyan`}
            />
          </motion.div>
        </div>
      )}
      <p className={`${textSizeClasses[size]} text-muted-foreground terminal-glow`}>
        {message}
      </p>
    </div>
  );
};