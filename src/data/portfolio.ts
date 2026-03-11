// ─────────────────────────────────────────────────────────────────────────────
// portfolio.ts — Single source of truth for ALL portfolio content.
//
// Two consumers:
//   1. UI components  → use the structured sections (profile, projects, skills…)
//   2. LLM system prompt → use the `content` section (rich text, no RAG needed)
//
// Fill in your real information. Everything in `content` is injected verbatim
// into the system prompt sent to the LLM on every chat request.
// ─────────────────────────────────────────────────────────────────────────────

// ── UI DATA ──────────────────────────────────────────────────────────────────

export const portfolio = {
  profile: {
    name: "Varun Mahajan",
    tagline: "Varun Mahajan's",
    headline: "AI Portfolio",
    avatar: "/images/vm-profile.png",
    watermarkText: "varun",
  },

  projects: [
    {
      name: "BOM Requests Enrichment",
      label: "AI Project",
      description: "Agentic AI automation platform using LangGraph + human-in-the-loop gates to process ServiceNow tickets end-to-end",
    },
    {
      name: "Invictus (Protein Synthesis)",
      label: "Open Source",
      description: "Full-stack AI agent that searches UniProt, retrieves publications, and extracts protein synthesis protocols using LLMs",
    },
    {
      name: "Optum Contract Analysis Tool",
      label: "AI Project",
      description: "Production AI platform using OpenAI + RAG to extract and analyze contract PDFs — 40% reduction in SME analysis time",
    },
    {
      name: "Medicare M3P Payment SDK",
      label: "Project",
      description: "Micro-frontend payment SDK for Medicare prescription payment plans with A/B testing and WCAG 2.1 compliance",
    },
    {
      name: "JoeFresh eCommerce",
      label: "Project",
      description: "Re-platformed Loblaw Digital's JoeFresh site to Next.js — +20% conversion, +10% AOV, +15% time on site",
    },
  ],

  skills: {
    frontend: [
      "Next.js", "React 18", "Redux", "TypeScript", "JavaScript",
      "HTML5", "CSS3", "GraphQL (Apollo)", "Web Components", "Tailwind CSS",
    ],
    backend: [
      "Node.js", "Express", "GraphQL", "Spring Boot", "FastAPI", "Python",
      "MongoDB", "PostgreSQL", "Redis", "Firebase",
    ],
    devops: [
      "Kubernetes", "Docker", "Azure", "GitHub CI/CD", "GitLab CI/CD",
      "Jfrog Artifactory", "K6 Load Testing", "Vercel",
    ],
    ai: [
      "LangChain", "LangGraph", "OpenAI", "Anthropic", "Vector Databases",
      "RAG pipelines", "Prompt Engineering", "Agentic AI", "Guardrails",
    ],
  },

  contact: {
    email: "mhjn.varun@gmail.com",
    phone: "+1(647)-632-7485",
  },

  resume: {
    fullName: "Varun Mahajan",
    description: "15+ years building high-impact web platforms with AI integration. Lead Engineer at Publicis Sapient, specializing in agentic AI systems and frontend architecture at scale.",
    filename: "Varun_Mahajan_Resume_2026.pdf",
    url: "/resume/resume.pdf",
    updatedAt: "March 2026",
    fileSize: "0.22 MB",
  },

  fun: {
    heading: "Life Outside Code",
    subtitle: "Based in Ontario, Canada — passionate about technology, continuous learning, and exploring new ideas.",
    photos: [
      "/images/fun/photo1.svg",
      "/images/fun/photo2.svg",
      "/images/fun/photo3.svg",
    ],
  },

  topicQueries: {
    projects: "What are your projects? What are you working on right now?",
    skills: "What are your skills? Give me a list of your soft and hard skills.",
    fun: "What's the craziest thing you've ever done? What are your hobbies?",
    contact: "How can I contact you?",
    resume: "Can you show me your resume or CV?",
  },

  // ── CONTENT (injected into LLM system prompt) ────────────────────────────
  // Replace every placeholder below with your real information.
  // This is what the AI uses to answer questions accurately.
  content: {
    // 1–3 sentence professional summary
    bio: "Varun Mahajan is a Lead Engineer specializing in agentic AI systems and full-stack architecture, with 15+ years building high-impact platforms for Fortune 500 clients. At Publicis Sapient, he leads production AI initiatives including LangGraph-powered agent orchestration, RAG-based document analysis, and large-scale frontend re-platforming. Based in Ontario, Canada, he combines deep frontend expertise (React, Next.js, TypeScript) with modern AI tooling (LangChain, LangGraph, OpenAI) and enterprise architecture (Kubernetes, Azure, GraphQL).",

    // List all work experience, newest first
    experience: [
      {
        role: "Lead Engineer — AI & Frontend",
        company: "Publicis Sapient",
        period: "June 2018 – Present",
        description:
          "Leading full-stack development and AI delivery for Fortune 500 healthcare and retail clients (UHG Optum, Loblaw Digital). Architecting production agentic AI systems using LangGraph with human-in-the-loop gates, multi-stage verification pipelines, and full auditability. Managing teams of 10–15 engineers; designing system architecture, performance optimization, and WCAG compliance. Key deliverables: BOM Requests Enrichment (LangGraph + FastAPI + guardrails), Contract Analysis Tool (OpenAI + RAG), Medicare Payment SDK (micro-frontends, +15% conversion), JoeFresh eCommerce re-platform (+20% conversion).",
        technologies: ["Next.js", "React 18", "TypeScript", "Node.js", "FastAPI", "LangChain", "LangGraph", "GraphQL", "Kubernetes", "Docker", "Azure", "OpenAI", "PostgreSQL + pgvector"],
      },
      {
        role: "Senior Associate Experience Technology",
        company: "SapientRazorfish",
        period: "September 2015 – April 2018",
        description:
          "Senior front-end developer and architect on eCommerce projects for Bed Bath & Beyond and Cardinal Health MedeComm B2B platform. Set up project architecture, led component design, drove WCAG compliance, mentored junior developers, and coordinated with onsite teams and clients. Worked extensively with React, Angular2, and Node.js stacks.",
        technologies: ["React", "Redux", "Angular2", "Node.js", "Express", "HTML5", "CSS3", "D3", "Adobe AEM"],
      },
      {
        role: "Assistant Manager",
        company: "Genpact",
        period: "November 2011 – September 2015",
        description:
          "Developed and maintained web applications using HTML5, CSS3, JavaScript, Java, and Apache Cordova. Contributed to internal tooling and digital transformation initiatives.",
        technologies: ["HTML5", "CSS3", "JavaScript", "Java", "Cordova"],
      },
      {
        role: "Software Engineer",
        company: "Melstar Information Technologies",
        period: "December 2010 – November 2011",
        description:
          "Built web interfaces using HTML5, CSS3, JavaScript, and Java.",
        technologies: ["HTML5", "CSS3", "JavaScript", "Java"],
      },
      {
        role: "Software Engineer",
        company: "Magicedtech",
        period: "2007 – 2010",
        description:
          "Developed interactive web applications and e-learning content using HTML, CSS, JavaScript, Java, Flash, and ActionScript.",
        technologies: ["HTML", "CSS", "JavaScript", "Java", "Flash", "ActionScript"],
      },
    ],

    // Projects (can mirror the UI projects section with more detail)
    projectDetails: [
      {
        name: "Optum – BOM Requests Enrichment (Agentic AI Automation)",
        description:
          "A full-stack agentic automation platform using LangGraph that ingests ServiceNow BOM (Bill of Materials) tickets and autonomously generates standardized coding specification documents. The system uses a stateful agent graph with distinct nodes for intent detection, task planning, guarded execution (add/update/delete), spec generation, and feedback capture. Includes governance guardrails to prevent destructive actions and PHI exposure, plus a BOM Portal for operational visibility, decision tracing, and feedback-driven optimization. This demonstrates production-grade agentic AI with proper state management, human-in-the-loop gates, and enterprise-ready auditability.",
        technologies: ["FastAPI", "LangChain", "LangGraph", "Python", "MongoDB", "Azure ADLS", "ServiceNow API", "Next.js", "React", "GraphQL"],
        outcome: "Eliminates manual BOM analysis effort for engineering teams; production deployment in progress (2025–present).",
      },
      {
        name: "Invictus – AI Protein Synthesis Protocol Extractor (Open Source)",
        description:
          "A full-stack open-source AI agent (github.com/human-again/invictus-prototype) that autonomously searches UniProt protein databases, retrieves scientific publications via Perplexity/PubMed/Semantic Scholar APIs, extracts protein synthesis protocols using local LLMs (Ollama), and performs biomedical entity extraction with scispaCy. Includes a verification dashboard with accuracy metrics against a reference dataset. Built as a research tool demonstrating end-to-end AI integration: multi-source API orchestration, LLM inference, NLP pipelines, and full-stack UI.",
        technologies: ["FastAPI", "Node.js", "Next.js", "React", "TypeScript", "Ollama (local LLMs)", "scispaCy", "Vercel (deployment)"],
        outcome: "Open-source project with live demo at invictus-prototype.vercel.app; showcases independent AI system design (2024–present).",
      },
      {
        name: "Optum – Contract Analysis Tool (CAT)",
        description:
          "Production AI platform for UHG Optum that extracts and analyzes contract PDF data using OpenAI + RAG + vector databases. SMEs use the tool to review, compare, and improve future contracts with 40% reduction in analysis time. Built with Next.js frontend, GraphQL API layer, and SSE-based streaming for real-time chat interface. Varun led full architecture design, component development, performance optimization, and release planning.",
        technologies: ["Next.js", "Node.js", "TypeScript", "OpenAI", "Python", "GraphQL", "pgvector", "Azure App Service", "MongoDB"],
        outcome: "40% reduction in contract analysis time; production deployment at UHG Optum (2025–present).",
      },
      {
        name: "Optum – Medicare Prescription Payment Plan (M3P)",
        description:
          "A payment SDK for Medicare prescription plans, built as web components for easy multi-client integration. Features Stripe payment collection, micro-frontend architecture published to Jfrog Artifactory, config-as-a-service, and WCAG 2.1 compliance. Varun led architecture, team coordination, API schema definition, and storybook documentation.",
        technologies: ["Next.js", "Node.js", "TypeScript", "React 18", "Redux", "Webpack", "Express", "Stripe", "Kubernetes", "Docker", "Azure", "GitHub CI/CD"],
        outcome: "Delivered as SDK to multiple Optum clients (2023–2024).",
      },
      {
        name: "Optum – Pharmacy Help Desk",
        description:
          "A one-time payment solution integrating the Healthpay/Stripe system with Optum's existing infrastructure to collect application fees. Built with Next.js and Spring Boot backend, with Gitlab CI/CD and accessibility compliance baked in.",
        technologies: ["Next.js", "React 18", "TypeScript", "Redux", "Node.js", "Express", "Spring Boot", "SQL", "Jest", "RTL", "Kubernetes", "Docker", "GitLab CI/CD"],
        outcome: "Seamlessly integrated payment flow with full accessibility compliance (2023–2024).",
      },
      {
        name: "JoeFresh eCommerce Re-platform (Loblaw Digital)",
        description:
          "Re-platformed and redesigned Loblaw Digital's JoeFresh eCommerce site to a modern Next.js stack. Varun managed a team of 10, built components for the organisation-wide internal UI library, led code reviews, performance optimisation, AODA/WCAG 2.0 compliance, and stakeholder communications.",
        technologies: ["Next.js", "Node.js", "TypeScript", "React 18", "Redux", "Webpack", "Express", "Jest", "RTL", "Kubernetes", "Docker", "K6", "GitLab CI/CD"],
        outcome: "Conversion +20%, AOV +10%, Time on Site +15% (2020–2023).",
      },
      {
        name: "Loblaw Digital – Internal Store Fulfillment Tool",
        description:
          "Internal Next.js + GraphQL (Apollo) order fulfillment tool for Loblaw store colleagues to process in-store orders. Built from scratch with GraphQL wrapping existing APIs and scaled to multiple stores.",
        technologies: ["Next.js", "React 17", "Redux", "GraphQL", "Apollo", "AgGrid", "HTML5", "CSS3", "Jenkins CI/CD"],
        outcome: "Deployed to all Loblaw stores across Canada (2018–2020).",
      },
      {
        name: "Bed Bath & Beyond eCommerce Redesign",
        description:
          "Redesign of the Bed Bath & Beyond eCommerce website. Varun led the frontend architecture, component development, and mentored the team. Worked with React, Redux-Saga, and a Node.js/Express backend.",
        technologies: ["React", "Redux", "Redux-Saga", "Node.js", "Express", "HTML5", "CSS3", "Foundation 6", "Karma", "Mocha", "Jenkins CI/CD"],
        outcome: "Full eCommerce redesign shipped to production (2017–2018).",
      },
      {
        name: "Cardinal Health MedeComm B2B Platform",
        description:
          "New B2B eCommerce platform for Cardinal Health featuring powerful search, smart cart, and checkout. Built with Angular2 and integrated with Adobe AEM. Varun set up architecture, led component design, and coordinated with onsite teams.",
        technologies: ["Angular2", "Node.js", "HTML5", "CSS3", "D3", "Gulp", "Adobe AEM", "Jasmine-Karma", "Cucumber", "GEB", "Jenkins"],
        outcome: "Launched as Cardinal Health's primary B2B ordering platform (2016–2017).",
      },
    ],

    // Education history
    education: [
      {
        degree: "Bachelor of Technology in Electronics and Communication Engineering",
        school: "Uttar Pradesh Technical University, Lucknow",
        period: "Completed",
        notes: "Work Authorization: Permanent Resident — Canada",
      },
    ],

    // Optional certifications / courses
    certifications: [] as string[],

    // Fun / personal section
    funFacts: [
      "Based in Ontario, Canada — 15+ years of international work experience (India → Canada, permanent resident).",
      "Built production agentic AI systems using LangGraph with human-in-the-loop gates, guardrails, and full auditability — not just API wrappers.",
      "Led engineering teams of 10–15 engineers across enterprise AI and high-traffic eCommerce platforms.",
      "Designed and shipped two AI-powered systems in parallel: a ServiceNow automation agent (LangGraph + FastAPI) and a contract analysis tool (OpenAI + RAG).",
      "Helped drive a 20% uplift in eCommerce conversion at Loblaw Digital through Next.js re-platforming and component architecture.",
      "Built open-source AI systems independently (Invictus protein synthesis agent) demonstrating full-stack AI design from APIs to NLP to frontend.",
    ],

    hobbies: ["Technology", "Continuous learning", "Problem solving", "Team mentorship", "Exploring Canada"],

    // Availability / open to work status
    availability: "Open to Staff Engineer, Principal Frontend Engineer, or Engineering Manager roles at product companies. Seeking opportunities to architect and lead AI-integrated systems at scale. Permanent Resident of Canada.",
  },
};

export type Topic = "projects" | "skills" | "fun" | "contact" | "resume" | "general";
