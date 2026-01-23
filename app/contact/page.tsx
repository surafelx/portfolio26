"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Clock } from "lucide-react";
import { toast } from "sonner";
import type { About } from "@/lib/database";

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<About['contact']>({
    email: "hello@example.dev",
    location: "San Francisco, CA",
    responseTime: "Usually responds within 24h"
  });

  useEffect(() => {
    // Fetch about data to get contact information
    fetch('/api/about')
      .then(res => res.json())
      .then((about: About) => {
        if (about?.contact) {
          setContactInfo({
            email: about.contact.email || "hello@example.dev",
            location: about.contact.location || "San Francisco, CA",
            responseTime: about.contact.responseTime || "Usually responds within 24h"
          });
        }
      })
      .catch(console.error);
  }, []);
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
      <div className="flex items-center gap-2 mb-6">
        <span className="text-muted-foreground">$</span>
        <span className="text-foreground">./contact</span>
        <span className="text-terminal-cyan">--interactive</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="terminal-border bg-card/50 p-4">
            <h2 className="text-lg text-primary terminal-glow mb-3">Get in Touch</h2>
            <p className="text-foreground/80 leading-relaxed mb-4 text-sm">
              Have a project in mind or want to collaborate?
              Drop me a message and I'll get back to you.
            </p>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-foreground/80">
                 <Mail size={16} className="text-primary" />
                 <span>{contactInfo.email}</span>
               </div>
               <div className="flex items-center gap-3 text-foreground/80">
                 <MapPin size={16} className="text-terminal-cyan" />
                 <span>{contactInfo.location}</span>
               </div>
               <div className="flex items-center gap-3 text-foreground/80">
                 <Clock size={16} className="text-terminal-amber" />
                 <span>{contactInfo.responseTime}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="terminal-border bg-card/50 p-4"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {">"} name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-secondary border border-border px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {">"} email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-secondary border border-border px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {">"} message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={3}
                className="w-full bg-secondary border border-border px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
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