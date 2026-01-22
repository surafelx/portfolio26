import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface TerminalInputProps {
  onSubmit?: (message: string) => void;
}

export const TerminalInput = ({ onSubmit }: TerminalInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSubmit) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        className={`flex items-center gap-2 bg-secondary/60 px-2 py-1.5 border border-border/50 transition-all duration-300 ${
          isFocused ? "border-primary/50 bg-secondary/80" : ""
        }`}
      >
        <span className="text-muted-foreground select-none text-sm">{">"}</span>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="send me a message..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none text-sm"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-primary hover:text-primary/80 transition-all disabled:opacity-30"
          disabled={!message.trim()}
        >
          <Send size={14} />
        </motion.button>
        <span className="text-primary cursor-blink text-sm">▋</span>
      </div>
    </motion.form>
  );
};
