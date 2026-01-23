"use client";
import { motion } from "framer-motion";
import { FileText, BookOpen, Contact, BarChart2, Plus, Edit, Trash, ChevronLeft, ChevronRight, Book, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { ArticleFormModal } from "@/components/ArticleFormModal";
import { AboutFormModal } from "@/components/AboutFormModal";
import { NoteFormModal } from "@/components/NoteFormModal";
import { AdminSearchFilter } from "@/components/AdminSearchFilter";
import { useProjects } from "@/hooks/useProjects";
import { useArticles } from "@/hooks/useArticles";
import { useNotes } from "@/hooks/useNotes";
import type { Project } from "@/data/projects";
import type { Article, Note } from "@/types/database";

interface AdminClientProps {
  initialProjects: Project[];
  initialArticles: Article[];
  initialNotes: Note[];
  initialAbout: any;
}

export default function AdminClient({ initialProjects, initialArticles, initialNotes, initialAbout }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingBlogPost, setEditingBlogPost] = useState(null);
  const [editingAbout, setEditingAbout] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [actionLoading, setActionLoading] = useState<string | null>(null); // Track which action is loading

  // Analytics data
  const [analytics, setAnalytics] = useState({
    visitors: 0,
    pageViews: 0,
    bounceRate: 0,
    projectsViewed: 0,
    uniqueVisitors: 0,
    projectStats: [],
    articleStats: [],
    noteStats: []
  });

  // Use hooks for data management and mutations
  const { projects, loading: projectsLoading, error: projectsError, addProject, editProject, removeProject } = useProjects();
  const { articles, loading: articlesLoading, error: articlesError, addArticle, editArticle, removeArticle } = useArticles();
  const { notes, loading: notesLoading, error: notesError, addNote, editNote, removeNote } = useNotes();

  // About state
  const [about, setAbout] = useState(initialAbout);

  // Use initial data if hooks haven't loaded yet
  const displayProjects = projects.length > 0 ? projects : initialProjects;
  const displayArticles = articles.length > 0 ? articles : initialArticles;
  const displayNotes = notes.length > 0 ? notes : initialNotes;
  const displayAbout = about || initialAbout;

  // Fetch analytics
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    fetch(`${baseUrl}/api/analytics`)
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(console.error);
  }, []);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    setActionLoading(`delete-project-${projectId}`);
    try {
      await removeProject(projectId);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddBlogPost = () => {
    setEditingBlogPost(null);
    setIsBlogModalOpen(true);
  };

  const handleEditBlogPost = (post) => {
    setEditingBlogPost(post);
    setIsBlogModalOpen(true);
  };

  const handleDeleteBlogPost = async (postId) => {
    setActionLoading(`delete-article-${postId}`);
    try {
      await removeArticle(postId);
      toast.success("Article deleted successfully");
    } catch (error) {
      console.error("Failed to delete article:", error);
      toast.error("Failed to delete article");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitProject = async (project) => {
    setActionLoading(editingProject ? "edit-project" : "add-project");
    try {
      if (editingProject) {
        await editProject(editingProject.id, project);
        toast.success("Project updated successfully");
      } else {
        await addProject(project);
        toast.success("Project added successfully");
      }
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Failed to submit project:", error);
      toast.error("Failed to save project");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitBlogPost = async (post) => {
    setActionLoading(editingBlogPost ? "edit-article" : "add-article");
    try {
      if (editingBlogPost) {
        await editArticle(editingBlogPost.id, post);
        toast.success("Article updated successfully");
      } else {
        await addArticle(post);
        toast.success("Article added successfully");
      }
      setIsBlogModalOpen(false);
      setEditingBlogPost(null);
    } catch (error) {
      console.error("Failed to submit article:", error);
      toast.error("Failed to save article");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditAbout = () => {
    setEditingAbout(displayAbout);
    setIsAboutModalOpen(true);
  };

  const handleSubmitAbout = async (aboutData) => {
    setActionLoading("edit-about");
    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      });
      if (response.ok) {
        const updatedAbout = await response.json();
        setAbout(updatedAbout);
        toast.success("About updated successfully");
      } else {
        throw new Error('Failed to update about');
      }
      setIsAboutModalOpen(false);
      setEditingAbout(null);
    } catch (error) {
      console.error("Failed to submit about:", error);
      toast.error("Failed to save about");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleDeleteNote = async (noteId) => {
    setActionLoading(`delete-note-${noteId}`);
    try {
      await removeNote(noteId);
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitNote = async (note) => {
    setActionLoading(editingNote ? "edit-note" : "add-note");
    try {
      if (editingNote) {
        await editNote(editingNote.id, note);
        toast.success("Note updated successfully");
      } else {
        await addNote(note);
        toast.success("Note added successfully");
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (error) {
      console.error("Failed to submit note:", error);
      toast.error("Failed to save note");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter and search logic
  const filteredProjects = displayProjects.filter((project) => {
    const matchesSearch = searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.brief.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterValue === "all" || project.tags.includes(filterValue);

    return matchesSearch && matchesFilter;
  });

  const filteredNotes = displayNotes.filter((note) => {
    return searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.blocks.some(block =>
        block.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  });

  const filteredArticles = displayArticles.filter((article) => {
    return searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination logic
  const getCurrentData = () => {
    switch (activeTab) {
      case "about":
        return displayAbout ? [displayAbout] : [];
      case "projects":
        return filteredProjects;
      case "articles":
        return filteredArticles;
      case "notes":
        return filteredNotes;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "about":
        return "about";
      case "projects":
        return "projects";
      case "articles":
        return "articles";
      case "notes":
        return "notes";
      default:
        return "items";
    }
  };

  const adminTabs = [
    { id: "about", name: "About", icon: User },
    { id: "projects", name: "Projects", icon: FileText },
    { id: "articles", name: "Articles", icon: Book },
    { id: "notes", name: "Notes", icon: BookOpen },
    { id: "analytics", name: "Analytics", icon: BarChart2 },
    { id: "contact", name: "Contact", icon: Contact }
  ];

  const projectFilterOptions = [
    { value: "all", label: "All Projects" },
    { value: "AI/ML", label: "AI/ML" },
    { value: "Security", label: "Security" },
    { value: "DevOps", label: "DevOps" },
    { value: "Developer Tools", label: "Developer Tools" }
  ];

  const notesFilterOptions = [
    { value: "all", label: "All Notes" },
    { value: "recent", label: "Recent (30 days)" },
    { value: "older", label: "Older than 30 days" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-muted-foreground">$</span>
        <span className="text-foreground">sudo</span>
        <span className="text-terminal-cyan">admin</span>
      </div>

      {/* Analytics Dashboard - Moved to top */}
      <div className="mb-6">
        <h2 className="text-base text-primary mb-3 flex items-center gap-2">
          <BarChart2 size={16} /> Analytics Dashboard
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="terminal-border bg-card/50 p-3">
            <h4 className="text-primary mb-1 text-sm">Visitors</h4>
            <p className="text-lg font-bold">{analytics.visitors}</p>
          </div>
          <div className="terminal-border bg-card/50 p-3">
            <h4 className="text-primary mb-1 text-sm">Page Views</h4>
            <p className="text-lg font-bold">{analytics.pageViews}</p>
          </div>
          <div className="terminal-border bg-card/50 p-3">
            <h4 className="text-primary mb-1 text-sm">Bounce Rate</h4>
            <p className="text-lg font-bold">{analytics.bounceRate}%</p>
          </div>
          <div className="terminal-border bg-card/50 p-3">
            <h4 className="text-primary mb-1 text-sm">Projects Viewed</h4>
            <p className="text-lg font-bold">{analytics.projectsViewed}</p>
          </div>
          <div className="terminal-border bg-card/50 p-3">
            <h4 className="text-primary mb-1 text-sm">Unique Visitors</h4>
            <p className="text-lg font-bold">{analytics.uniqueVisitors}</p>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-muted-foreground">$</span>
        <span className="text-foreground">./admin</span>
        <span className="text-terminal-cyan">--manage</span>
      </div>

      <div className="flex gap-2 mb-6 border-b border-border">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
              setSearchQuery("");
              setFilterValue("all");
            }}
            className={`px-4 py-2 flex items-center gap-2 text-sm ${activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === "about" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base text-primary flex items-center gap-2">
                <User size={16} /> About Management
              </h2>
              <Button onClick={handleEditAbout} size="sm">
                <Edit size={14} className="mr-2" /> Edit About
              </Button>
            </div>

            {displayAbout ? (
              <div className="space-y-4">
                <div className="terminal-border bg-card/50 p-4">
                  <h3 className="text-sm text-primary mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">{displayAbout.summary}</p>
                </div>

                <div className="terminal-border bg-card/50 p-4">
                  <h3 className="text-sm text-primary mb-2">Skills</h3>
                  <div className="space-y-2">
                    {Object.entries(displayAbout.skills).map(([category, skills]: [string, any]) => (
                      <div key={category}>
                        <span className="text-xs text-primary capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {skills.map((skill: string) => (
                            <span key={skill} className="text-xs px-2 py-1 bg-secondary text-foreground border border-border">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="terminal-border bg-card/50 p-4">
                  <h3 className="text-sm text-primary mb-2">Experience ({displayAbout.experience.length} entries)</h3>
                  <div className="space-y-2">
                    {displayAbout.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/30 pl-3">
                        <p className="text-xs text-primary">{exp.position} at {exp.company} ({exp.dates})</p>
                        <ul className="text-xs text-muted-foreground mt-1">
                          {exp.description.map((desc: string, i: number) => (
                            <li key={i}>• {desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="terminal-border bg-card/50 p-4">
                  <h3 className="text-sm text-primary mb-2">Education</h3>
                  <p className="text-sm text-muted-foreground">
                    {displayAbout.education.degree} from {displayAbout.education.institution} ({displayAbout.education.graduation})
                  </p>
                </div>
              </div>
            ) : (
              <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                No about data found. Click "Edit About" to add content.
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base text-primary flex items-center gap-2">
                <FileText size={16} /> Projects Management
              </h2>
              <Button onClick={handleAddProject} size="sm">
                <Plus size={14} className="mr-2" /> Add Project
              </Button>
            </div>

            {/* Search and Filter */}
            <AdminSearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterValue={filterValue}
              onFilterChange={setFilterValue}
              filterOptions={projectFilterOptions}
            />

            {/* Projects List */}
            <div className="space-y-3">
              {projectsLoading && displayProjects.length === 0 ? (
                <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                  Loading projects...
                </div>
              ) : projectsError ? (
                <div className="terminal-border bg-card/50 p-4 text-center text-destructive">
                  Error loading projects: {projectsError}
                </div>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((project) => (
                  <div key={project.id} className="terminal-border bg-card/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-primary font-medium text-sm">{project.title}</h4>
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded">
                            Priority: {project.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.brief}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-secondary text-foreground border border-border">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          disabled={actionLoading === `delete-project-${project.id}`}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                  No projects found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "articles" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base text-primary flex items-center gap-2">
                <Book size={16} /> Articles Management
              </h2>
              <Button onClick={handleAddBlogPost} size="sm">
                <Plus size={14} className="mr-2" /> Add Article
              </Button>
            </div>

            {/* Articles List */}
            <div className="space-y-3">
              {articlesLoading && displayArticles.length === 0 ? (
                <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                  Loading articles...
                </div>
              ) : articlesError ? (
                <div className="terminal-border bg-card/50 p-4 text-center text-destructive">
                  Error loading articles: {articlesError}
                </div>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((article) => (
                  <div key={article.id} className="terminal-border bg-card/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-primary font-medium mb-1 text-sm">{article.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-secondary text-foreground border border-border">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBlogPost(article)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBlogPost(article.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          disabled={actionLoading === `delete-article-${article.id}`}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                  No articles found matching your criteria.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {paginatedData.length} of {currentData.length} {getTabLabel(activeTab)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="flex items-center px-3 text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base text-primary flex items-center gap-2">
                <BookOpen size={16} /> Notes Management
              </h2>
              <Button onClick={handleAddNote} size="sm">
                <Plus size={14} className="mr-2" /> Add Note
              </Button>
            </div>

            {/* Search and Filter */}
            <AdminSearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterValue={filterValue}
              onFilterChange={setFilterValue}
              filterOptions={notesFilterOptions}
            />

            {/* Notes List */}
            <div className="space-y-3">
              {notesLoading && displayNotes.length === 0 ? (
                <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                  Loading notes...
                </div>
              ) : notesError ? (
                <div className="terminal-border bg-card/50 p-4 text-center text-destructive">
                  Error loading notes: {notesError}
                </div>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((note) => (
                  <div key={note.id} className="terminal-border bg-card/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-primary font-medium mb-1 text-sm">{note.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {note.blocks?.length || 0} blocks
                        </p>
                        <p className="text-xs text-muted-foreground/70">{new Date(note.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          disabled={actionLoading === `delete-note-${note.id}`}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                  No notes found matching your criteria.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {paginatedData.length} of {currentData.length} {getTabLabel(activeTab)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="flex items-center px-3 text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h2 className="text-base text-primary flex items-center gap-2 mb-3">
              <BarChart2 size={16} /> Detailed Analytics
            </h2>

            <div className="space-y-6">
              {/* Top Projects */}
              <div>
                <h3 className="text-sm text-primary mb-3">Most Viewed Projects</h3>
                <div className="space-y-2">
                  {analytics.projectStats.slice(0, 10).map((stat, index) => {
                    const project = displayProjects.find(p => p.id === stat.projectId);
                    return (
                      <div key={stat.projectId} className="terminal-border bg-card/50 p-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-6">#{index + 1}</span>
                          <span className="text-sm">{project?.title || stat.projectId}</span>
                        </div>
                        <span className="text-sm text-primary">{stat.views} views</span>
                      </div>
                    );
                  })}
                  {analytics.projectStats.length === 0 && (
                    <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                      No project views recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Top Articles */}
              <div>
                <h3 className="text-sm text-primary mb-3">Most Read Articles</h3>
                <div className="space-y-2">
                  {analytics.articleStats.slice(0, 10).map((stat, index) => {
                    const article = displayArticles.find(a => a.id === stat.articleId);
                    return (
                      <div key={stat.articleId} className="terminal-border bg-card/50 p-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-6">#{index + 1}</span>
                          <span className="text-sm">{article?.title || stat.articleId}</span>
                        </div>
                        <span className="text-sm text-primary">{stat.views} reads</span>
                      </div>
                    );
                  })}
                  {analytics.articleStats.length === 0 && (
                    <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                      No article reads recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Top Notes */}
              <div>
                <h3 className="text-sm text-primary mb-3">Most Viewed Notes</h3>
                <div className="space-y-2">
                  {analytics.noteStats.slice(0, 10).map((stat, index) => {
                    const note = displayNotes.find(n => n.id === stat.noteId);
                    return (
                      <div key={stat.noteId} className="terminal-border bg-card/50 p-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-6">#{index + 1}</span>
                          <span className="text-sm">{note?.title || stat.noteId}</span>
                        </div>
                        <span className="text-sm text-primary">{stat.views} views</span>
                      </div>
                    );
                  })}
                  {analytics.noteStats.length === 0 && (
                    <div className="terminal-border bg-card/50 p-4 text-center text-muted-foreground">
                      No note views recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div>
            <h2 className="text-lg text-primary mb-4 flex items-center gap-2">
              <Contact size={18} /> Contact Management
            </h2>
            <div className="terminal-border bg-card/50 p-4">
              <p className="text-muted-foreground">Contact form submissions and messages management.</p>
            </div>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProject}
        initialData={editingProject}
        isEditing={!!editingProject}
      />

      {/* Article Form Modal */}
      <ArticleFormModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSubmit={handleSubmitBlogPost}
        initialData={editingBlogPost}
        isEditing={!!editingBlogPost}
      />

      {/* About Form Modal */}
      <AboutFormModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onSubmit={handleSubmitAbout}
        initialData={editingAbout}
        isEditing={!!editingAbout}
      />

      {/* Note Form Modal */}
      <NoteFormModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSubmit={handleSubmitNote}
        initialData={editingNote}
        isEditing={!!editingNote}
      />
    </motion.div>
  );
}