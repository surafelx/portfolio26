"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import type { About } from "@/lib/database";

interface PDFResumeProps {
  about: About;
}

export const PDFResume = ({ about }: PDFResumeProps) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // For now, create a simple text-based PDF
      // In a real implementation, you'd use react-pdf or jsPDF
      const resumeText = `
${about.summary}

TECHNICAL SKILLS
${Object.entries(about.skills).map(([category, skills]) =>
  `${category.toUpperCase()}: ${skills.join(", ")}`
).join('\n')}

WORK EXPERIENCE
${about.experience.map(exp =>
  `${exp.position}
${exp.company} • ${exp.dates}
${exp.description.map(desc => `• ${desc}`).join('\n')}`
).join('\n\n')}

EDUCATION
${about.education.degree}
${about.education.institution} • ${about.education.graduation}
      `.trim();

      // Create a blob and download
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={generating}
      className="bg-primary hover:bg-primary/90"
    >
      {generating ? (
        <>
          <FileText size={16} className="mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download size={16} className="mr-2" />
          Download Resume PDF
        </>
      )}
    </Button>
  );
};