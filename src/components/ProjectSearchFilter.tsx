import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";

interface ProjectSearchFilterProps {
  modules: string[];
  onSearch: (query: string, module: string) => void;
  photoUrl?: string;
}

export const ProjectSearchFilter = ({ 
  modules, 
  onSearch, 
  photoUrl
}: ProjectSearchFilterProps) => {
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
    <div className="mb-6 border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-background/50">
        <div className="flex items-center gap-4">
          {photoUrl && (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={photoUrl} alt="Module" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">Search & Filter</h3>
            <p className="text-xs text-muted-foreground">Find projects by module or keyword</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground"
        >
          {isExpanded ? (
            <>Hide <ChevronUp className="ml-2 h-4 w-4" /></>
          ) : (
            <>Show <ChevronDown className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={{ duration: 0.3 }} 
            className="overflow-hidden"
          >
            <div className="p-4 border-t">
              <div className="grid gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search projects..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-4 items-center">
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