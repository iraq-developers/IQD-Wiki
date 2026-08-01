import { uid, makeBullet, makeLink, makeSimple, makeSkill, DEFAULT_SECTIONS, type CVData } from "./types";
import { emptyCV } from "./cv-schema";

/* ══════════════════════════════════════════════════════
   DEFAULT CV DATA
══════════════════════════════════════════════════════ */
export function mkInitial(): CVData {
    return {
        name: "JOHN DOE",
        titleLine: "Full Stack Software Engineer",
        phone: "+1 234 567 8900",
        location: "San Francisco, CA",
        email: "john.doe@example.com",
        links: [
            makeLink("LinkedIn", "https://linkedin.com/in/johndoe"),
            makeLink("GitHub", "https://github.com/johndoe"),
            makeLink("Website", "https://johndoe.dev"),
        ],
        summary:
            "Experienced software engineer with 5+ years of expertise in building scalable web applications and distributed systems. Passionate about clean code, agile methodologies, and delivering high-quality user experiences.",
        skillsTitle: "Skills & Technologies",
        skills: [
            makeSkill("Frontend", "React, Vue.js, TypeScript, TailwindCSS, HTML5, CSS3"),
            makeSkill("Backend", "Node.js, Python, PostgreSQL, MongoDB, REST APIs, GraphQL"),
            makeSkill("DevOps", "Docker, Kubernetes, AWS, CI/CD, GitHub Actions"),
            makeSkill("Tools", "Git, VS Code, Jira, Figma"),
        ],
        expTitle: "Work Experience",
        jobs: [
            {
                id: uid(),
                title: "Senior Developer | TechFlow Inc. (2022-Present)",
                bullets: [
                    makeBullet("Led a team of 5 developers to build a real-time analytics platform using React and Node.js"),
                    makeBullet("Improved application performance by 40% through code optimization and database indexing"),
                    makeBullet("Implemented automated testing pipelines reducing deployment failures by 25%"),
                    makeBullet("Mentored junior developers and established code quality standards"),
                    makeBullet("Tech stack: React, TypeScript, Node.js, PostgreSQL, AWS"),
                ],
            },
            {
                id: uid(),
                title: "Frontend Developer | Creative Solutions (2019 - 2022)",
                bullets: [
                    makeBullet("Developed responsive and accessible user interfaces for e-commerce clients"),
                    makeBullet("Collaborated with designers to implement pixel-perfect designs from Figma"),
                    makeBullet("Integrated third-party payment gateways and RESTful APIs"),
                    makeBullet("Maintained and updated legacy codebases to modern standards"),
                    makeBullet("Tech stack: Vue.js, JavaScript, SASS, REST APIs"),
                ],
            },
        ],
        projTitle: "Featured Projects",
        projects: [
            {
                id: uid(),
                name: "E-Commerce Platform",
                links: [makeLink("demo.com", "https://demo.example.com")],
                description: "A full-featured e-commerce platform with inventory management, cart, and secure checkout.",
                bullets: [
                    makeBullet("Built scalable backend architecture using Node.js and MongoDB"),
                    makeBullet("Implemented secure user authentication and authorization using JWT"),
                    makeBullet("Integrated Stripe for seamless payment processing"),
                    makeBullet("Developed admin dashboard for product and order management"),
                ],
            },
            {
                id: uid(),
                name: "Task Management App",
                links: [
                    makeLink("github", "https://github.com/johndoe/task-app"),
                    makeLink("live demo", "https://taskapp.example.com"),
                ],
                description: "A collaborative task management application with real-time updates and team features.",
                bullets: [
                    makeBullet("Utilized WebSockets for real-time collaboration features"),
                    makeBullet("Designed intuitive drag-and-drop interface for task organization"),
                    makeBullet("Implemented robust state management using Redux"),
                ],
            },
        ],
        eduTitle: "Education",
        education: [
            makeSimple("Bachelor of Science in Computer Science from State University (2015 – 2019)"),
        ],
        langTitle: "Languages",
        languages: [
            makeSimple("English (Native)"),
            makeSimple("Spanish (Conversational)"),
        ],
        sections: DEFAULT_SECTIONS.map(s => ({ ...s })),
    };
}

/* ── A blank CV, for "start from scratch" ── */
export function mkEmpty(): CVData {
    return emptyCV();
}
