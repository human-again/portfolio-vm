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
      name: "Optum Contract Analysis Tool",
      label: "AI Project",
      description: "AI-powered tool to extract and analyze contract PDFs using OpenAI",
    },
    {
      name: "Medicare M3P Payment SDK",
      label: "Project",
      description: "Micro-frontend payment SDK for Medicare prescription payment plans",
    },
    {
      name: "Optum Pharmacy Help Desk",
      label: "Project",
      description: "Healthpay/Stripe integration for seamless pharmacy payment collection",
    },
    {
      name: "JoeFresh eCommerce",
      label: "Project",
      description: "Re-platformed Loblaw Digital's JoeFresh eCommerce site — +20% conversion",
    },
    {
      name: "Loblaw In-Store Tool",
      label: "Project",
      description: "Internal NextJS + GraphQL order fulfillment tool for Loblaw store colleagues",
    },
  ],

  skills: {
    frontend: [
      "Next.js", "React", "Redux", "Angular", "TypeScript", "JavaScript",
      "HTML5", "CSS3", "SASS/LESS", "Bootstrap", "GraphQL (Apollo)",
    ],
    backend: [
      "Node.js", "Express", "GraphQL", "Spring Boot", "Java",
      "MySQL", "MongoDB", "Redis", "Firebase",
    ],
    devops: [
      "Kubernetes", "Docker", "Azure", "GitLab CI/CD", "GitHub CI/CD",
      "Jenkins", "Jfrog Artifactory", "K6 Load Testing",
    ],
    ai: [
      "OpenAI", "Vector DB", "Python", "AppDynamics", "Prometheus",
    ],
  },

  contact: {
    email: "mhjn.varun@gmail.com",
    phone: "+1(647)-632-7485",
  },

  resume: {
    fullName: "Varun Mahajan",
    description: "14+ years of UI/Web development experience. Lead Experience Engineer at Publicis Sapient, Toronto.",
    filename: "Varun_Mahajan_May25.pdf",
    url: "/resume/resume.pdf",
    updatedAt: "May 2025",
    fileSize: "0.18 MB",
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
    bio: "Varun Mahajan is a Lead Experience Engineer with 14+ years of UI/Web development experience, specialising in high-performance web applications using React, Next.js, Node.js, and TypeScript. Based in Ontario, Canada, he has led large-scale frontend projects for global clients including UHG Optum and Loblaw Digital at Publicis Sapient. He also has hands-on experience with AI integrations using OpenAI and vector databases, cloud infrastructure (Azure, Kubernetes, Docker), and CI/CD pipelines.",

    // List all work experience, newest first
    experience: [
      {
        role: "Lead Experience Engineer",
        company: "Publicis Sapient",
        period: "June 2018 – Present",
        description:
          "Leading frontend engineering for major clients including UHG Optum and Loblaw Digital. Responsibilities span architecture design, team leadership (up to 10 engineers), performance optimisation, release planning, stakeholder management, and hands-on development of reusable React/Next.js component libraries. Key deliverables include AI-powered contract analysis tools, Medicare payment SDKs, pharmacy help desk systems, and large-scale eCommerce re-platforms.",
        technologies: ["Next.js", "React", "TypeScript", "Node.js", "Redux", "GraphQL", "Kubernetes", "Docker", "Azure", "OpenAI"],
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
        name: "Optum – Contract Analysis Tool (CAT)",
        description:
          "AI-powered application for UHG Optum that extracts and analyses relevant information from contract PDFs using OpenAI. SMEs use the tool to review, compare, and improve future contracts. Varun led the project as the lead frontend engineer, handling architecture design, reusable React component development, performance testing, and release planning.",
        technologies: ["Next.js", "Node.js", "TypeScript", "OpenAI", "Python", "GraphQL", "Azure App Service", "MongoDB", "Vector DB"],
        outcome: "Production tool in active use at UHG Optum (2025–present).",
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
      "Based in Ontario, Canada with 14+ years of international work experience (India → Canada).",
      "Led engineering teams of up to 10 developers across complex, high-traffic eCommerce platforms.",
      "Delivered AI-powered contract analysis tools using OpenAI — bridging enterprise software and modern AI.",
      "Helped drive a 20% uplift in eCommerce conversion at Loblaw Digital through frontend re-platforming.",
      "Permanent Resident of Canada, originally from India.",
    ],

    hobbies: ["Technology", "Continuous learning", "Problem solving", "Team mentorship", "Exploring Canada"],

    // Availability / open to work status
    availability: "Open to Staff Engineer, Principal Engineer, or hands-on Engineering Manager roles in Canada. Permanent Resident.",
  },
};

export type Topic = "projects" | "skills" | "fun" | "contact" | "resume" | "general";
