import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ProjectSearchCompactProps {
  modules: string[];
  onSearch: (query: string, module: string) => void;
}

export const ProjectSearchCompact = ({ 
  modules, 
  onSearch
}: ProjectSearchCompactProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery, selectedModule);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedModule("all");
    onSearch("", "all");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:bg-background"
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Search & Filter</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClear}
              className="h-6 w-6 p-0 text-muted-foreground"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-10 h-9"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="flex gap-2 items-center">
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Module" />
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

              <Button onClick={handleSearch} size="sm" className="h-9">
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};