import { Calendar, Clock, ArrowLeft, Play, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// Sample partners data - in a real app, this would come from a database
const partners = [
  {
    id: "techcorp",
    name: "TechCorp",
    logo: "/placeholder.svg",
    description: "Leading technology solutions provider specializing in enterprise software development and digital transformation.",
    fullDescription: `TechCorp has been at the forefront of technological innovation for over 15 years. We specialize in creating cutting-edge software solutions that drive digital transformation for enterprises worldwide.

Our expertise spans across:
• Enterprise application development
• Cloud infrastructure solutions
• AI-powered business intelligence
• Cybersecurity implementations
• Digital workflow automation

We believe in building long-term partnerships with our clients, understanding their unique challenges, and delivering solutions that not only meet their current needs but also scale with their future growth.`,
    founded: "2008",
    headquarters: "San Francisco, CA",
    employees: "500+",
    website: "https://techcorp.com",
    videoUrl: "", // Can be populated with actual video
    achievements: [
      "Winner of Tech Innovation Award 2023",
      "ISO 27001 Certified",
      "Serving 200+ Enterprise Clients",
      "Global Presence in 15 Countries"
    ],
    services: [
      "Custom Software Development",
      "Cloud Migration Services",
      "AI & Machine Learning Solutions",
      "DevOps & CI/CD Implementation",
      "Cybersecurity Consulting"
    ]
  },
  {
    id: "innovatelab",
    name: "InnovateLab",
    logo: "/placeholder.svg",
    description: "AI research and development company focused on breakthrough technologies and machine learning solutions.",
    fullDescription: `InnovateLab is dedicated to pushing the boundaries of artificial intelligence and machine learning. Our team of world-class researchers and engineers work on cutting-edge projects that shape the future of technology.

Our research focuses on:
• Deep learning and neural networks
• Natural language processing
• Computer vision applications
• Reinforcement learning
• AI ethics and responsible AI development

We collaborate with leading universities and research institutions to advance the field of AI while ensuring our innovations benefit society as a whole.`,
    founded: "2015",
    headquarters: "Boston, MA",
    employees: "150+",
    website: "https://innovatelab.ai",
    videoUrl: "",
    achievements: [
      "Published 200+ Research Papers",
      "MIT Technology Review's 50 Smartest Companies",
      "AI for Social Good Initiative",
      "Open Source Contributions to Major AI Frameworks"
    ],
    services: [
      "AI Research & Development",
      "Machine Learning Consulting",
      "Custom AI Model Training",
      "AI Ethics Consulting",
      "Technology Transfer & Licensing"
    ]
  },
  {
    id: "dataflow",
    name: "DataFlow",
    logo: "/placeholder.svg",
    description: "Big data analytics platform that helps organizations turn raw data into actionable insights.",
    fullDescription: `DataFlow revolutionizes how organizations handle and analyze their data. Our comprehensive platform provides end-to-end solutions for data ingestion, processing, analysis, and visualization.

Our platform capabilities include:
• Real-time data streaming
• Advanced analytics and machine learning
• Interactive dashboards and reporting
• Data governance and security
• Multi-cloud data management

We serve industries ranging from finance and healthcare to retail and manufacturing, helping them unlock the true value of their data assets.`,
    founded: "2012",
    headquarters: "Austin, TX",
    employees: "300+",
    website: "https://dataflow.com",
    videoUrl: "",
    achievements: [
      "Leader in Gartner Magic Quadrant for Data Analytics",
      "SOC 2 Type II Certified",
      "Processing 100+ Petabytes Daily",
      "99.9% Uptime SLA"
    ],
    services: [
      "Big Data Platform",
      "Real-time Analytics",
      "Data Visualization",
      "Machine Learning on Big Data",
      "Data Governance Solutions"
    ]
  },
  {
    id: "cloudsync",
    name: "CloudSync",
    logo: "/placeholder.svg",
    description: "Cloud infrastructure services providing scalable, secure, and cost-effective cloud solutions.",
    fullDescription: `CloudSync delivers enterprise-grade cloud infrastructure services that enable organizations to focus on their core business while we handle the complexity of cloud operations.

Our comprehensive cloud services include:
• Multi-cloud management
• Infrastructure as Code
• Container orchestration
• Serverless computing
• Cloud security and compliance
• Disaster recovery and backup

We support hybrid and multi-cloud strategies, ensuring our clients can leverage the best of each cloud provider while maintaining operational simplicity.`,
    founded: "2010",
    headquarters: "Seattle, WA",
    employees: "400+",
    website: "https://cloudsync.com",
    videoUrl: "",
    achievements: [
      "AWS Advanced Consulting Partner",
      "Google Cloud Premier Partner",
      "Microsoft Gold Cloud Platform Competency",
      "ISO 27001 & SOC 2 Certified"
    ],
    services: [
      "Cloud Migration Services",
      "Multi-Cloud Management",
      "Infrastructure Automation",
      "Cloud Security",
      "Cost Optimization"
    ]
  },
  {
    id: "codecraft",
    name: "CodeCraft",
    logo: "/placeholder.svg",
    description: "Full-service software development agency specializing in web and mobile applications.",
    fullDescription: `CodeCraft is a premier software development agency that transforms ideas into exceptional digital experiences. Our team of skilled developers, designers, and product managers work collaboratively to deliver high-quality software solutions.

Our development expertise covers:
• Web application development
• Mobile app development (iOS/Android)
• Progressive Web Apps
• E-commerce platforms
• SaaS applications
• API development and integration

We follow agile methodologies and maintain transparent communication throughout the development process, ensuring our clients are involved every step of the way.`,
    founded: "2016",
    headquarters: "Denver, CO",
    employees: "120+",
    website: "https://codecraft.dev",
    videoUrl: "",
    achievements: [
      "Clutch Top 1000 Companies 2023",
      "Google for Startups Partner",
      "Built 500+ Successful Applications",
      "Average 4.9/5 Client Satisfaction"
    ],
    services: [
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
      "Product Strategy",
      "Quality Assurance",
      "Maintenance & Support"
    ]
  },
  {
    id: "devops-pro",
    name: "DevOps Pro",
    logo: "/placeholder.svg",
    description: "DevOps consulting and tools company helping organizations streamline their development and deployment processes.",
    fullDescription: `DevOps Pro empowers organizations to accelerate their software delivery while maintaining high quality and reliability. Our comprehensive DevOps solutions bridge the gap between development and operations teams.

Our DevOps services include:
• CI/CD pipeline implementation
• Infrastructure automation
• Monitoring and observability
• Containerization and orchestration
• Security integration (DevSecOps)
• Performance optimization

We work with organizations of all sizes, from startups to Fortune 500 companies, helping them achieve faster time-to-market and improved operational efficiency.`,
    founded: "2014",
    headquarters: "Portland, OR",
    employees: "80+",
    website: "https://devopspro.com",
    videoUrl: "",
    achievements: [
      "Docker Certified Partner",
      "Kubernetes Certified Service Provider",
      "Reduced Client Deployment Times by 75%",
      "Industry Leader in DevOps Maturity Assessment"
    ],
    services: [
      "CI/CD Implementation",
      "Infrastructure as Code",
      "Container Orchestration",
      "Monitoring & Alerting",
      "DevSecOps",
      "Performance Engineering"
    ]
  }
];

export default function PartnerPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const partner = partners.find(p => p.id === id);

  if (!partner) {
    notFound();
  }

  return (
    <div>
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Partner Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary/50 flex items-center justify-center">
            <ImageWithFallback
              src={partner.logo}
              alt={partner.name}
              className="w-12 h-12 object-contain"
              fallbackText={partner.name.charAt(0)}
              showIcon={false}
            />
          </div>
          <div>
            <h1 className="text-3xl text-primary terminal-glow mb-2">
              {partner.name}
            </h1>
            <p className="text-muted-foreground">{partner.description}</p>
          </div>
        </div>

        {/* Partner Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="terminal-border bg-card/30 p-3 text-center">
            <div className="text-sm text-primary font-medium">Founded</div>
            <div className="text-lg">{partner.founded}</div>
          </div>
          <div className="terminal-border bg-card/30 p-3 text-center">
            <div className="text-sm text-primary font-medium">Headquarters</div>
            <div className="text-sm">{partner.headquarters}</div>
          </div>
          <div className="terminal-border bg-card/30 p-3 text-center">
            <div className="text-sm text-primary font-medium">Team Size</div>
            <div className="text-lg">{partner.employees}</div>
          </div>
          <div className="terminal-border bg-card/30 p-3 text-center">
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
            >
              Website <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Partner Video (if available) */}
      {partner.videoUrl && (
        <div className="mb-8">
          <h2 className="text-xl text-primary mb-4 flex items-center gap-2">
            <Play size={18} />
            Company Video
          </h2>
          <div className="terminal-border bg-secondary/30 p-4">
            <div className="aspect-video">
              <iframe
                src={partner.videoUrl}
                title={`${partner.name} Company Video`}
                className="w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="mb-8">
        <h2 className="text-xl text-primary mb-4">About {partner.name}</h2>
        <div className="terminal-border bg-card/30 p-6">
          <div className="prose prose-invert max-w-none">
            {partner.fullDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h2 className="text-xl text-primary mb-4">Achievements & Recognition</h2>
        <div className="grid gap-3">
          {partner.achievements.map((achievement, index) => (
            <div key={index} className="terminal-border bg-card/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground/90">{achievement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="mb-8">
        <h2 className="text-xl text-primary mb-4">Services & Expertise</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {partner.services.map((service, index) => (
            <div key={index} className="terminal-border bg-card/30 p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-terminal-cyan rounded-full"></div>
                <span className="text-foreground/90">{service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact/CTA Section */}
      <div className="terminal-border bg-card/30 p-6 text-center">
        <h3 className="text-lg text-primary mb-2">Interested in Working Together?</h3>
        <p className="text-muted-foreground mb-4">
          {partner.name} is always looking for new opportunities to collaborate and innovate.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded transition-colors"
          >
            Visit Website <ExternalLink size={16} />
          </a>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}