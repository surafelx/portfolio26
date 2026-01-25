import { config } from 'dotenv';
import { updateAbout } from '../src/lib/database';

// Load environment variables
config({ path: '../.env' });

async function populateAbout() {
  try {
    const aboutData = {
      summary: "Full-Stack Software Engineer with 8+ years of experience. Ex-CTO at Budera. I've been building and creating since I was a kid, driven by a passion for solving problems and turning ideas into innovative, user-friendly and fun products. Currently, exploring AI agent development to combine full-stack expertise with intelligent automation.",
      contact: {
        email: "hello@example.dev",
        location: "San Francisco, CA",
        responseTime: "Usually responds within 24h"
      },
      socialLinks: {
        github: "https://github.com/username",
        linkedin: "https://linkedin.com/in/username",
        twitter: "https://twitter.com/username",
        instagram: "https://instagram.com/username",
        youtube: "https://youtube.com/@username",
        website: "https://yourwebsite.com"
      },
      resumeUrl: "/resume.pdf",
      qualifications: [
        "TECHNICAL SKILLS",
        "PROGRAMMING & FRAMEWORKS",
        "Python (Django, FastAPI, Flask)",
        "JavaScript / TypeScript",
        "React.js / Next.js",
        "Node.js",
        "HTML5, CSS3, SASS/SCSS",
        "Material UI (MUI), Tailwind CSS, Chakra UI",
        "TOOLS & WORKFLOWS",
        "Git / GitHub / GitLab / Bitbucket",
        "Jira / Trello / Notion",
        "Postman / Insomnia",
        "Webpack / Vite / Babel",
        "Figma / Adobe XD",
        "WORK EXPERIENCE",
        "DATABASES",
        "PostgreSQL",
        "MySQL / MariaDB",
        "MongoDB",
        "Redis",
        "AI & AUTOMATION",
        "LangChain, OpenAI API, GPT-agents",
        "Natural Language Processing (NLP)",
        "Pandas, NumPy, Scikit-learn",
        "Automation & Workflow orchestration",
        "TESTING & QUALITY",
        "Unit, Integration, E2E",
        "Test-Driven Development (TDD)",
        "Linting & code formatting tools",
        "DEVOPS & CLOUD",
        "Docker / Docker Compose",
        "Kubernetes (basic)",
        "AWS (EC2, S3, RDS, Lambda)",
        "CI/CD (GH Actions, GitLab CI)",
        "Linux server management",
        "OTHER",
        "WebSockets / RTC",
        "GraphQL / RESTful API design",
        "Payment integrations (Stripe, PayPal)",
        "Jupyter Notebooks (data analysis)",
        "Agile/Scrum methodologies",
        "AI-assisted Dev, Review, Debugging",
        "Prompt engineering"
      ],
      skills: {
        programming: [
          "Python (Django, FastAPI, Flask)",
          "JavaScript / TypeScript",
          "React.js / Next.js",
          "Node.js",
          "HTML5, CSS3, SASS/SCSS",
          "Material UI (MUI), Tailwind CSS, Chakra UI"
        ],
        tools: [
          "Git / GitHub / GitLab / Bitbucket",
          "Jira / Trello / Notion",
          "Postman / Insomnia",
          "Webpack / Vite / Babel",
          "Figma / Adobe XD"
        ],
        databases: [
          "PostgreSQL",
          "MySQL / MariaDB",
          "MongoDB",
          "Redis"
        ],
        ai: [
          "LangChain, OpenAI API, GPT-agents",
          "Natural Language Processing (NLP)",
          "Pandas, NumPy, Scikit-learn",
          "Automation & Workflow orchestration"
        ],
        testing: [
          "Unit, Integration, E2E",
          "Test-Driven Development (TDD)",
          "Linting & code formatting tools"
        ],
        devops: [
          "Docker / Docker Compose",
          "Kubernetes (basic)",
          "AWS (EC2, S3, RDS, Lambda)",
          "CI/CD (GH Actions, GitLab CI)",
          "Linux server management"
        ],
        other: [
          "WebSockets / RTC",
          "GraphQL / RESTful API design",
          "Payment integrations (Stripe, PayPal)",
          "Jupyter Notebooks (data analysis)",
          "Agile/Scrum methodologies",
          "AI-assisted Dev, Review, Debugging",
          "Prompt engineering"
        ]
      },
      experience: [
        {
          company: "AGRISUN ENGINEERING",
          position: "SENIOR SOFTWARE ENGINEER",
          dates: "SEPTEMBER 2024 - PRESENT",
          description: [
            "Developed software solutions for solar-powered agricultural systems and inverter technologies.",
            "Designed a countertop smart mini-farm prototype with IoT integration for indoor sustainable food production.",
            "Built websites, inventory systems, and marketing analytics dashboards to streamline operations and track impact.",
            "Implemented project tracking dashboards for cross-team visibility, improving reporting and execution timelines.",
            "Integrated IoT devices and solar data into centralized platforms, enabling real-time monitoring and decision-making."
          ]
        },
        {
          company: "BUDERA",
          position: "CHIEF TECHNOLOGY OFFICER / SENIOR SOFTWARE ENGINEER",
          dates: "APRIL 2025 - AUGUST 2025",
          description: [
            "Co-conceived and built the initial product vision for an AI-powered business partner SaaS.",
            "Designed and implemented 5 independent AI agents that automated diverse business management tasks.",
            "Architected scalable backend systems to support multi-agent orchestration and real-time workflows.",
            "Directed product development from idea to MVP, working closely with the cofounder.",
            "Built the technical foundation with Python, React, PgSQL, and AI tooling (LangChain, OpenAI API, vector DBs)."
          ]
        },
        {
          company: "EMPIRE SYNDICATE",
          position: "SENIOR SOFTWARE ENGINEER",
          dates: "OCTOBER 2024 - JANUARY 2025",
          description: [
            "Designed and implemented custom sales funnels in GoHighLevel, significantly improving client lead conversion.",
            "Automated CRM workflows to enhance customer engagement, retention, and lifecycle management.",
            "Integrated third-party APIs and tools to expand marketing automation capabilities and reduce manual effort.",
            "Delivered data-driven insights dashboards that optimized sales strategies based on performance analytics.",
            "Supported cross-functional teams by rapidly iterating on web solutions, ensuring smooth client onboarding."
          ]
        },
        {
          company: "CELERUS",
          position: "CHIEF TECHNOLOGY OFFICER / SENIOR SOFTWARE ENGINEER",
          dates: "AUGUST 2024 - JANUARY 2025",
          description: [
            "Developed a talent assessment tool to pre-assess candidates for clients, enabling data-driven hiring decisions.",
            "Built job scraping and application automation tools to streamline recruitment workflows.",
            "Delivered advanced analytics solutions, creating dashboards and predictive models aligned with business goals.",
            "Automated data collection and transformation processes, improving workflow efficiency and consistency.",
            "Created data visualizations in Python and Tableau to provide actionable insights for global clients."
          ]
        },
        {
          company: "NIBRET",
          position: "CHIEF TECHNOLOGY OFFICER / SENIOR SOFTWARE ENGINEER",
          dates: "JUNE 2024 - AUGUST 2025",
          description: [
            "Designed and implemented a full-stack SaaS real estate platform for web, Android, and iOS.",
            "Built dynamic front-end interfaces with React/Next.js and Material UI for smooth user experience.",
            "Developed backend APIs and database systems to handle listings, users, and transactions.",
            "Integrated a CRM system to manage client interactions, leads, and property inquiries efficiently.",
            "Implemented analytics dashboards, secure authentication, payments, and notifications."
          ]
        },
        {
          company: "INDEPENDENT CONTRACT",
          position: "SOFTWARE ENGINEER / DATA ENGINEER",
          dates: "MAY 2024 - SEPTEMBER 2025",
          description: [
            "Worked independently under NDA supporting large-scale enterprise clients, building ETL solutions and pipelines.",
            "Developed a data pipeline tool to automate ingestion, transformation, and loading of diverse data.",
            "Cleaned and optimized the data environment, improving reliability and efficiency for downstream analytics.",
            "Designed and maintained workflows using Apache Airflow for scheduling and orchestrating complex tasks.",
            "Integrated and processed data in Snowflake, ensuring high data accuracy, accessibility, and scalability."
          ]
        },
        {
          company: "ITIO",
          position: "SOFTWARE ENGINEER",
          dates: "AUGUST 2022 - MAY 2024",
          description: [
            "Built end-to-end web applications using Node.js, React, and MongoDB with a focus on performance and scalability.",
            "Applied Test-Driven Development (TDD) practices to deliver robust backend logic and reduce production bugs.",
            "Developed and maintained data scraping systems to enrich user experiences and support platform content.",
            "Directed deployment of scalable systems tailored for agricultural and IoT use cases, ensuring reliable operations.",
            "Produced technical content and tutorials, increasing community engagement and platform visibility."
          ]
        },
        {
          company: "FREELANCE WORK ON UPWORK",
          position: "SOFTWARE ENGINEER",
          dates: "JULY 2020 - AUGUST 2022",
          description: [
            "Delivered 20+ full-stack projects across web and mobile platforms, consistently receiving good client feedback.",
            "Built rapid prototypes and MVPs using React, Node.js, and Python, accelerating client go-to-market timelines.",
            "Integrated APIs and third-party services for e-commerce, automation, and analytics solutions.",
            "Designed custom dashboards and reporting tools to enable data-driven decision-making for clients.",
            "Maintained long-term client relationships through reliable, scalable, and high-quality software delivery."
          ]
        },
        {
          company: "INDEPENDENT CONTRACT",
          position: "SOFTWARE ENGINEER",
          dates: "JUNE 2019 - JULY 2020",
          description: [
            "Developed real-time monitoring systems for weather, energy, and electricity metrics.",
            "Designed and optimized schematics and equipment selection for accurate and efficient deployment in fields.",
            "Implemented scalable backend solutions to support continuous data collection and analysis.",
            "Ensured secure data handling and robust system architecture for reliable decision-making.",
            "Created dashboard interfaces and visualizations to provide actionable insights for operational teams."
          ]
        },
        {
          company: "SOLAR VILLAGE ETHIOPIA",
          position: "IT / SOFTWARE ENGINEER",
          dates: "AUGUST 2018 - JUNE 2019",
          description: [
            "Developed Python-based tools to support small-scale agricultural and solar energy projects.",
            "Built data collection and processing scripts to monitor system performance and efficiency.",
            "Assisted in hardware-software integration for local energy and farming solutions.",
            "Created basic dashboards and reporting tools for project tracking and operational insights.",
            "Provided technical support and maintenance for deployed systems, ensuring smooth functionality."
          ]
        },
        {
          company: "DYKESOFT",
          position: "IT / SOFTWARE ENGINEER",
          dates: "JUNE 2017 - SEPTEMBER 2018",
          description: [
            "Developed full-stack desktop applications for rental management, inventory tracking, and modular ERP systems.",
            "Designed scalable and secure solutions to support data-driven decision-making across multi-branch companies.",
            "Implemented custom features and automation to streamline client workflows and improve operational efficiency.",
            "Provided training, user manuals, and ongoing support to ensure smooth adoption and client satisfaction.",
            "Collaborated with clients to gather requirements and deliver software solutions aligned with business needs."
          ]
        }
      ],
      education: {
        institution: "University of Gondar",
        degree: "BSc. Biomedical Engineering, Cum Laude",
        graduation: "GRADUATED 202",
        gpa: "3.6"
      }
    };

    await updateAbout(aboutData);
    console.log('✅ About data populated successfully!');
    console.log('📄 Summary:', aboutData.summary.substring(0, 100) + '...');
    console.log('💼 Experience entries:', aboutData.experience.length);
    console.log('🎓 Education:', aboutData.education.degree);
  } catch (error) {
    console.error('❌ Error populating about data:', error);
  }
}

populateAbout();