import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

interface ProjectSearchAccordionProps {
  modules: string[];
  onSearch: (query: string, module: string) => void;
  photoUrl?: string;
}

export const ProjectSearchAccordion = ({ 
  modules, 
  onSearch, 
  photoUrl = "/placeholder.svg"
}: ProjectSearchAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");

  const handleSearch = () => {
    onSearch(searchQuery, selectedModule);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedModule("all");
    onSearch("", "all");
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-card/50 hover:bg-card transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            Featured Projects
          </h2>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
           <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.3 }} 
            className="overflow-hidden border-t"
          >
            <div className="p-4">
              <div className="grid gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search projects by title, description, tags..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Select value={selectedModule} onValueChange={setSelectedModule}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        {modules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSearch} size="sm">
                    <Search className="h-4 w-4 mr-2" /> Search
                  </Button>
                  <Button onClick={handleClear} size="sm" variant="outline">
                    <X className="h-4 w-4 mr-2" /> Clear
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};