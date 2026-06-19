"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Clock } from "lucide-react";
import { toast } from "sonner";
import { ScheduleCall } from "@/components/ScheduleCall";
import { getAbout } from "@/data";
import { SOCIAL_LINKS } from "@/lib/links";

const aboutContact = getAbout().contact;

export default function Contact() {
  const contactInfo = {
    email: aboutContact?.email || SOCIAL_LINKS.email,
    location: aboutContact?.location || "Remote",
    responseTime: aboutContact?.responseTime || "Usually responds within 24h",
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent!", {
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        toast.error("Failed to send message", {
          description: errorData.error || "Please try again later.",
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Contact</h1>
        <p className="text-muted-foreground">
          Have a project in mind or want to collaborate? Let&apos;s talk.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="terminal-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-3">Get in Touch</h2>
            <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
              Have a project in mind or want to collaborate?
              Drop me a message and I'll get back to you.
            </p>

            <div className="space-y-4 text-sm">
               <div className="flex items-center gap-3 text-muted-foreground">
                 <Mail size={16} className="text-primary" />
                 <span>{contactInfo.email}</span>
               </div>
               <div className="flex items-center gap-3 text-muted-foreground">
                 <MapPin size={16} className="text-primary" />
                 <span>{contactInfo.location}</span>
               </div>
               <div className="flex items-center gap-3 text-muted-foreground">
                 <Clock size={16} className="text-primary" />
                 <span>{contactInfo.responseTime}</span>
               </div>
             </div>
          </div>

          <ScheduleCall />
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="terminal-border bg-card p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow resize-none"
                placeholder="Your message..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 font-medium hover:brightness-110 transition-all"
            >
              <Send size={16} />
              <span>Send Message</span>
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}