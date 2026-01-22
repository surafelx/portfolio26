import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { Terminal, Mail, FileText, User, Settings, BarChart2, BookOpen, Contact } from "lucide-react";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-border bg-card/50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="text-primary" size={20} />
          <span className="text-primary font-medium terminal-glow">Surafel Yimam</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-terminal-cyan">~</span>
          <span className="text-muted-foreground">$</span>
        </div>
        <div className="flex items-center gap-4">
          <Navigation />
        </div>
      </div>
    </motion.header>
  );
};
