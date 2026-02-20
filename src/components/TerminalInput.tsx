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
        className={`flex items-center gap-1 bg-secondary/40 px-1 py-0.5 border border-border/30 transition-all duration-300 ${
          isFocused ? "border-green-300/40 bg-secondary/60" : ""
        }`}
      >
        <span className="text-muted-foreground select-none text-xs">{">"}</span>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="send me a message..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-xs"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-green-300 hover:text-green-200 transition-all disabled:opacity-20"
          disabled={!message.trim()}
        >
          <Send size={10} />
        </motion.button>
        <span className="text-green-300 cursor-blink text-xs">▋</span>
      </div>
    </motion.form>
  );
};
