import type { CVData } from "../types";
import type { UILang } from "../i18n";

/* ══════════════════════════════════════════════════════
   AI PROMPTS

   Three jobs the AI can do for the user, in English or
   Arabic. Every prompt ends with the same hard output
   contract so `smart-paste` always finds something usable.

   Note the schema below omits every `id` field: the app
   regenerates ids on import anyway, so asking the model
   for them only wastes tokens and invites collisions.
══════════════════════════════════════════════════════ */

export type AIMode = "build" | "convert" | "tailor";

export const AI_MODES: AIMode[] = ["build", "convert", "tailor"];

const SCHEMA = `{
  "name": "Full Name",
  "titleLine": "Job title, e.g. Frontend Developer",
  "phone": "+964 770 000 0000",
  "location": "City, Country",
  "email": "you@example.com",
  "links": [{ "label": "LinkedIn", "href": "https://linkedin.com/in/…" }],
  "summary": "2–3 sentence professional summary.",
  "skillsTitle": "Skills & Technologies",
  "skills": [{ "label": "Frontend", "value": "React, Next.js, TypeScript" }],
  "expTitle": "Work Experience",
  "jobs": [
    {
      "title": "Role | Company (2022 – Present)",
      "bullets": ["Achievement with a number in it", "Another achievement"]
    }
  ],
  "projTitle": "Featured Projects",
  "projects": [
    {
      "name": "Project Name",
      "links": [{ "label": "github", "href": "https://github.com/…" }],
      "description": "One line on what it is.",
      "bullets": ["What you built and the impact it had"]
    }
  ],
  "eduTitle": "Education",
  "education": ["B.Sc. Computer Science — University of Baghdad (2018 – 2022)"],
  "langTitle": "Languages",
  "languages": ["Arabic (Native)", "English (Fluent)"]
}`;

const RULES_EN = `WRITING RULES
- The CV must fit on ONE A4 page. Budget: summary max 3 sentences, 3–4 bullets per job, 2–3 bullets per project, at most 3 jobs and 3 projects.
- Every bullet starts with a strong past-tense action verb (Built, Led, Shipped, Reduced, Automated…). No "Responsible for".
- Put a number in a bullet whenever one honestly exists (%, users, ms, team size, revenue). Never invent numbers.
- Plain text only — no markdown, emoji, tables or special characters inside the values.
- Write the CV itself in ENGLISH even if we are talking in another language.

OUTPUT CONTRACT
- When I say I'm done (or "generate my CV"), reply with ONE \`\`\`json code block and NOTHING after it.
- Match this exact shape. Do not add, rename or nest keys. Do not include "id" fields.
- "bullets", "education" and "languages" are plain arrays of strings.
- If you genuinely have nothing for a section, use an empty array [].

${SCHEMA}`;

const RULES_AR = `قواعد الكتابة
- يجب أن تتسع السيرة في صفحة A4 واحدة. الميزانية: النبذة ٣ جمل كحد أقصى، ٣-٤ نقاط لكل خبرة، ٢-٣ نقاط لكل مشروع، وبحد أقصى ٣ خبرات و٣ مشاريع.
- كل نقطة تبدأ بفعل قوي في الماضي (بنى، قاد، أطلق، قلّل، أتمت…). تجنّب عبارة "مسؤول عن".
- ضع رقماً في النقطة كلما وُجد رقم حقيقي (نسبة، عدد مستخدمين، مللي ثانية، حجم فريق، إيرادات). لا تخترع أرقاماً أبداً.
- نص عادي فقط — بدون تنسيق ماركداون أو إيموجي أو جداول أو رموز خاصة داخل القيم.
- **اكتب محتوى السيرة الذاتية باللغة الإنجليزية** حتى لو كنا نتحدث بالعربية.

عقد المخرجات
- عندما أقول إنني انتهيت (أو "ولّد سيرتي")، أجب بكتلة \`\`\`json واحدة فقط ولا تكتب أي شيء بعدها.
- التزم بهذا الشكل بالضبط. لا تضف أو تعيد تسمية أو تداخل المفاتيح. لا تضع حقول "id".
- الحقول "bullets" و"education" و"languages" هي مصفوفات نصية بسيطة.
- إذا لم يكن لديك محتوى لقسم ما، استخدم مصفوفة فارغة [].

${SCHEMA}`;

/** The user's real CV, minus the ids — used by the "tailor" mode. */
function cvForPrompt(cv: CVData): string {
    return JSON.stringify(
        {
            name: cv.name,
            titleLine: cv.titleLine,
            phone: cv.phone,
            location: cv.location,
            email: cv.email,
            links: cv.links.map(l => ({ label: l.label, href: l.href })),
            summary: cv.summary,
            skillsTitle: cv.skillsTitle,
            skills: cv.skills.map(s => ({ label: s.label, value: s.value })),
            expTitle: cv.expTitle,
            jobs: cv.jobs.map(j => ({ title: j.title, bullets: j.bullets.map(b => b.text) })),
            projTitle: cv.projTitle,
            projects: cv.projects.map(p => ({
                name: p.name,
                links: p.links.map(l => ({ label: l.label, href: l.href })),
                description: p.description,
                bullets: p.bullets.map(b => b.text),
            })),
            eduTitle: cv.eduTitle,
            education: cv.education.map(e => e.text),
            langTitle: cv.langTitle,
            languages: cv.languages.map(l => l.text),
        },
        null,
        2
    );
}

export interface PromptInput {
    mode: AIMode;
    lang: UILang;
    cv: CVData;
    /** Job description text, for the "tailor" mode. */
    jobPost?: string;
    /** Existing CV text, for the "convert" mode. */
    oldCV?: string;
}

export function buildPrompt({ mode, lang, cv, jobPost, oldCV }: PromptInput): string {
    const ar = lang === "ar";
    const rules = ar ? RULES_AR : RULES_EN;

    if (mode === "convert") {
        return ar
            ? `أنت خبير في كتابة السير الذاتية. مهمتك: تحويل سيرتي الذاتية الحالية (نص خام في الأسفل) إلى سيرة منظّمة واحترافية بصيغة JSON.

أعد صياغة المحتوى ليكون أقوى وأوضح — حسّن النقاط الضعيفة وأضف أفعالاً قوية — لكن **لا تخترع** أي خبرة أو مهارة أو رقم غير موجود في النص.
إن كانت هناك معلومة ناقصة ومهمة (مثل البريد الإلكتروني أو التواريخ)، اسألني عنها أولاً قبل توليد الـ JSON.

سيرتي الذاتية الحالية:
"""
${oldCV?.trim() || "(الصق سيرتك في الخانة المخصصة قبل نسخ التعليمات)"}
"""

${rules}`
            : `You are an expert CV writer. Your task: convert my existing CV (raw text below) into a clean, structured JSON CV.

Rewrite the content so it reads sharper and more professional — strengthen weak bullets, add action verbs — but do NOT invent any experience, skill or number that isn't in the text.
If something important is missing (email, dates, job titles), ask me for it BEFORE producing the JSON.

My current CV:
"""
${oldCV?.trim() || "(paste your CV in the box above before copying this prompt)"}
"""

${rules}`;
    }

    if (mode === "tailor") {
        return ar
            ? `أنت خبير توظيف وكتابة سير ذاتية. لديّ سيرة ذاتية وإعلان وظيفة. مهمتك: إعادة كتابة سيرتي لتناسب هذه الوظيفة تحديداً وتتجاوز أنظمة الـ ATS.

ما أريده:
1. أعد ترتيب وصياغة المحتوى لإبراز ما يهم هذه الوظيفة أكثر.
2. استخدم نفس المصطلحات والكلمات المفتاحية الواردة في الإعلان (متى ما كانت تنطبق عليّ فعلاً).
3. أعد كتابة النبذة لتخاطب هذا الدور مباشرة.
4. **لا تخترع** أي خبرة أو مهارة أو رقم لا يوجد في سيرتي. إن كانت هناك فجوة مهمة، أخبرني بها في رسالة منفصلة قبل الـ JSON.
5. قبل الـ JSON، اذكر في ٣ نقاط قصيرة ما غيّرته ولماذا.

إعلان الوظيفة:
"""
${jobPost?.trim() || "(الصق إعلان الوظيفة في الخانة المخصصة قبل نسخ التعليمات)"}
"""

سيرتي الذاتية الحالية:
\`\`\`json
${cvForPrompt(cv)}
\`\`\`

${rules}`
            : `You are an expert recruiter and CV writer. I have a CV and a job posting. Your task: rewrite my CV so it targets this specific role and passes ATS keyword screening.

What I want:
1. Reorder and rewrite content so what matters most for THIS job appears first and reads strongest.
2. Mirror the terminology and keywords from the posting — but only where they genuinely apply to me.
3. Rewrite the summary to speak directly to this role.
4. Do NOT invent experience, skills or numbers I don't have. If there's an important gap, tell me about it in plain text BEFORE the JSON.
5. Before the JSON, list in 3 short bullets what you changed and why.

The job posting:
"""
${jobPost?.trim() || "(paste the job posting in the box above before copying this prompt)"}
"""

My current CV:
\`\`\`json
${cvForPrompt(cv)}
\`\`\`

${rules}`;
    }

    /* ── build ── */
    return ar
        ? `أنت خبير في كتابة السير الذاتية. ساعدني في بناء سيرة ذاتية احترافية من الصفر.

ابدأ بطرح الأسئلة عليّ لجمع المعلومات: خلفيتي المهنية، خبراتي، تعليمي، مهاراتي، ومشاريعي.
اطرح سؤالين أو ثلاثة كحد أقصى في كل رسالة، وانتظر ردي. إن كانت إجاباتي مختصرة، اطلب تفاصيل أكثر — خصوصاً الأرقام والنتائج الملموسة.
يمكننا التحدث بالعربية، لكن السيرة النهائية تكون بالإنجليزية.

لا تولّد الـ JSON إلا بعد أن أخبرك أنني انتهيت.

${rules}`
        : `You are an expert CV writer. Help me build a professional CV from scratch.

Start by asking me questions to gather the material: my background, work history, education, skills and projects.
Ask at most 2–3 questions per message and wait for my answer. If my answers are thin, push for more detail — especially concrete numbers and outcomes.

Do not produce the JSON until I tell you I'm done.

${rules}`;
}

/* ══════════════════════════════════════════════════════
   FIELD-LEVEL PROMPT — the ✨ button next to a summary,
   job or project. Focused, tiny, and returns plain text.
══════════════════════════════════════════════════════ */

export function buildFieldPrompt(field: string, current: string, lang: UILang, cv: CVData): string {
    const role = cv.titleLine || "the role I'm targeting";

    if (lang === "ar") {
        return `أنت خبير في كتابة السير الذاتية. أعد كتابة الجزء التالي من سيرتي الذاتية (${field}) ليكون أقوى وأوضح.

السياق: أنا ${role}.

القواعد:
- ابدأ كل نقطة بفعل قوي في الماضي، وتجنّب الحشو وعبارة "مسؤول عن".
- أضف أرقاماً حقيقية فقط — لا تخترع أي رقم أو إنجاز.
- اجعل كل نقطة في سطر واحد (لا تتجاوز ~١٤٠ حرفاً) لأن السيرة يجب أن تتسع في صفحة A4 واحدة.
- بالإنجليزية، نص عادي فقط.

أعطني ٢-٣ خيارات مختلفة، ثم اسألني أيها أفضّل.

النص الحالي:
"""
${current || "(فارغ — اكتب نسخة أولى بناءً على السياق أعلاه واسألني عن التفاصيل الناقصة)"}
"""`;
    }

    return `You are an expert CV writer. Rewrite the following part of my CV (${field}) so it reads sharper and more impressive.

Context: I am ${role}.

Rules:
- Start each bullet with a strong past-tense action verb. Cut filler and never write "Responsible for".
- Add real numbers only — do not invent any metric or achievement.
- Keep each bullet to a single line (~140 characters max); the CV has to fit one A4 page.
- Plain English text, no markdown.

Give me 2–3 different options, then ask which one I prefer.

Current text:
"""
${current || "(empty — write a first draft from the context above and ask me for whatever details you need)"}
"""`;
}

/* ══════════════════════════════════════════════════════
   PROVIDERS
══════════════════════════════════════════════════════ */

export interface Provider {
    id: string;
    name: string;
    url: string;
}

export const PROVIDERS: Provider[] = [
    { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/" },
    { id: "claude", name: "Claude", url: "https://claude.ai/new" },
    { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app" },
];
