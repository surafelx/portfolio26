import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { About } from "@/lib/database";

interface AboutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (about: Omit<About, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<About>;
  isEditing?: boolean;
}

export const AboutFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  isEditing = false
}: AboutFormModalProps) => {
  const [about, setAbout] = useState<Omit<About, 'id' | 'createdAt' | 'updatedAt'>>({
    summary: "",
    qualifications: [],
    skills: {
      programming: [],
      tools: [],
      databases: [],
      ai: [],
      testing: [],
      devops: [],
      other: []
    },
    experience: [],
    education: {
      institution: "",
      degree: "",
      graduation: "",
      gpa: ""
    }
  });

  useEffect(() => {
    if (initialData) {
      setAbout({
        summary: initialData.summary || "",
        qualifications: initialData.qualifications || [],
        skills: initialData.skills || {
          programming: [],
          tools: [],
          databases: [],
          ai: [],
          testing: [],
          devops: [],
          other: []
        },
        experience: initialData.experience || [],
        education: initialData.education || {
          institution: "",
          degree: "",
          graduation: "",
          gpa: ""
        }
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(about);
    onClose();
  };

  const updateSkills = (category: keyof typeof about.skills, value: string) => {
    setAbout({
      ...about,
      skills: {
        ...about.skills,
        [category]: value.split(",").map(s => s.trim()).filter(s => s)
      }
    });
  };

  const addExperience = () => {
    setAbout({
      ...about,
      experience: [...about.experience, { company: "", position: "", dates: "", description: [] }]
    });
  };

  const updateExperience = (index: number, field: keyof typeof about.experience[0], value: string | string[]) => {
    const newExp = [...about.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setAbout({ ...about, experience: newExp });
  };

  const removeExperience = (index: number) => {
    setAbout({
      ...about,
      experience: about.experience.filter((_, i) => i !== index)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit About" : "Add About"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={about.summary}
              onChange={(e) => setAbout({...about, summary: e.target.value})}
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualifications & Certifications (one per line)</Label>
            <Textarea
              id="qualifications"
              value={about.qualifications.join('\n')}
              onChange={(e) => setAbout({...about, qualifications: e.target.value.split('\n').filter(s => s.trim())})}
              className="min-h-[80px]"
              placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional Developer&#10;Certified Scrum Master"
            />
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <Label>Technical Skills</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(about.skills).map((category) => (
                <div key={category} className="space-y-2">
                  <Label htmlFor={`skills-${category}`} className="capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Textarea
                    id={`skills-${category}`}
                    value={about.skills[category as keyof typeof about.skills].join(", ")}
                    onChange={(e) => updateSkills(category as keyof typeof about.skills, e.target.value)}
                    placeholder="Skill1, Skill2, Skill3"
                    className="min-h-[60px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Work Experience</Label>
              <Button type="button" onClick={addExperience} size="sm">
                Add Experience
              </Button>
            </div>
            {about.experience.map((exp, index) => (
              <div key={index} className="border p-4 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Experience {index + 1}</h4>
                  <Button type="button" onClick={() => removeExperience(index)} size="sm" variant="destructive">
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dates</Label>
                    <Input
                      value={exp.dates}
                      onChange={(e) => updateExperience(index, 'dates', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description (one per line)</Label>
                  <Textarea
                    value={exp.description.join('\n')}
                    onChange={(e) => updateExperience(index, 'description', e.target.value.split('\n').filter(s => s.trim()))}
                    className="min-h-[80px]"
                    placeholder="Description point 1&#10;Description point 2"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <Label>Education</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={about.education.institution}
                  onChange={(e) => setAbout({...about, education: {...about.education, institution: e.target.value}})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={about.education.degree}
                  onChange={(e) => setAbout({...about, education: {...about.education, degree: e.target.value}})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduation">Graduation</Label>
                <Input
                  id="graduation"
                  value={about.education.graduation}
                  onChange={(e) => setAbout({...about, education: {...about.education, graduation: e.target.value}})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA (optional)</Label>
                <Input
                  id="gpa"
                  value={about.education.gpa || ''}
                  onChange={(e) => setAbout({...about, education: {...about.education, gpa: e.target.value}})}
                  placeholder="3.6"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update About" : "Add About"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};