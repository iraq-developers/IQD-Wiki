/* ══════════════════════════════════════════════════════
   BUILDER UI STRINGS (EN / AR)

   These translate the *builder's* chrome only. The CV
   document itself always renders LTR English — that's
   what recruiters and ATS systems expect.
══════════════════════════════════════════════════════ */

export type UILang = "en" | "ar";

const en = {
    /* ── App chrome ── */
    appTitle: "CV Builder",
    appSubtitle: "Build a clean, one-page CV",
    edit: "Edit",
    preview: "Preview",
    sections: "Sections",
    section: "Section",
    saved: "Saved",
    saving: "Saving…",
    savedHint: "Your CV is saved in this browser",
    more: "More",
    close: "Close",
    cancel: "Cancel",
    back: "Back",
    done: "Done",

    /* ── History ── */
    undo: "Undo",
    redo: "Redo",

    /* ── Section names ── */
    secPersonal: "Personal Info",
    secLinks: "Links",
    secSummary: "Summary",
    secSkills: "Skills",
    secExperience: "Work Experience",
    secProjects: "Projects",
    secEducation: "Education",
    secLanguages: "Languages",
    secLayout: "Layout & Sections",

    /* ── Field labels ── */
    fullName: "Full Name",
    jobTitle: "Job Title",
    phone: "Phone",
    location: "Location",
    email: "Email",
    sectionTitle: "Section Title",
    label: "Label",
    url: "URL",
    category: "Category",
    description: "Description",
    projectName: "Project Name",
    bulletPoints: "Bullet Points",
    titleAndCompany: "Job Title & Company",

    /* ── Hints ── */
    hintPersonal: "Your name, title, and contact details",
    hintLinks: "LinkedIn, GitHub, portfolio, etc.",
    hintSummary: "A short professional bio (2–4 sentences)",
    hintSkills: "Group your skills by category",
    hintExperience: "Manage your jobs — tap an entry to edit",
    hintProjects: "Manage your projects — tap an entry to edit",
    hintLayout: "Reorder sections or hide the ones you don't need",

    /* ── List actions ── */
    add: "Add",
    addBullet: "Add bullet",
    addLink: "Add link",
    addEntry: "Add entry",
    addSkillGroup: "Add skill category",
    addJob: "Add job",
    addProject: "Add project",
    remove: "Remove",
    duplicate: "Duplicate",
    moveUp: "Move up",
    moveDown: "Move down",
    show: "Show",
    hide: "Hide",

    /* ── Empty states ── */
    emptyJobs: "No work experience yet",
    emptyProjects: "No projects yet",
    emptyLinks: "No links yet",
    emptySkills: "No skills yet",
    emptyList: "Nothing here yet",
    emptyHint: "Add your first entry, or let the AI Builder fill it in for you.",

    /* ── Page fit ── */
    zoom: "Zoom",
    fit: "Fit",
    density: "Density",
    compact: "Compact",
    roomy: "Roomy",
    autoFit: "Auto-fit",
    autoFitDone: "Adjusted to fit one page",
    autoFitImpossible: "Still too long — try removing a few bullet points",
    overflowTitle: "Content runs past one page",
    overflowBody: "About {n} won't appear in your export.",
    overflowFits: "Fits on one page",

    /* ── Theme ── */
    themeColor: "Theme Color",
    customColor: "Custom colour",
    language: "Language",

    /* ── Export ── */
    export: "Export",
    exportPdf: "Download PDF",
    exportPng: "Download PNG",
    print: "Print / Save as PDF",
    printHint: "Best quality — text stays selectable",
    pdfHint: "Shareable image-based PDF with clickable links",
    pngHint: "High-resolution image",
    exporting: "Exporting…",
    exportFailed: "Export failed",
    exportReady: "Download ready",

    /* ── Data management ── */
    data: "Your data",
    downloadJson: "Download backup (.json)",
    uploadJson: "Restore from backup",
    resetSample: "Reset to sample CV",
    resetBlank: "Start from blank",
    resetTitle: "Replace your CV?",
    resetBody: "This overwrites everything currently in the builder. You can undo it right after.",
    resetConfirm: "Yes, replace it",
    importedOk: "CV loaded",
    importFailed: "Couldn't read that file",

    /* ── AI ── */
    aiBuilder: "AI Builder",
    aiTitle: "AI CV Builder",
    aiSubtitle: "Let an AI write your CV, then bring it back here in one paste.",
    aiStep1: "Pick what you want the AI to do",
    aiStep2: "Copy the prompt and open your AI",
    aiStep3: "Paste the AI's reply back here",
    aiModeBuild: "Build from scratch",
    aiModeBuildHint: "The AI interviews you, then writes the whole CV.",
    aiModeConvert: "Convert an existing CV",
    aiModeConvertHint: "Paste your old CV text and it gets structured automatically.",
    aiModeTailor: "Tailor to a job post",
    aiModeTailorHint: "Rewrite your current CV to match a specific job description.",
    aiPromptLang: "Prompt language",
    aiCopyPrompt: "Copy prompt",
    aiCopied: "Copied!",
    aiCopiedToast: "Prompt copied — just paste it into the chat",
    aiOpenIn: "Open in",
    aiPasteLabel: "Paste the AI's reply",
    aiPastePlaceholder: "Paste everything the AI sent back — the JSON block, extra chatter and all. We'll find the CV in it.",
    aiApply: "Review & apply",
    aiJobPostLabel: "Paste the job description",
    aiJobPostPlaceholder: "Paste the full job posting here — it gets embedded into the prompt.",
    aiOldCvLabel: "Paste your existing CV",
    aiOldCvPlaceholder: "Paste your current CV as plain text — any format works.",
    aiImprove: "Improve with AI",
    aiImproveHint: "Copies a focused prompt for just this part of your CV.",

    /* ── AI review ── */
    reviewTitle: "Review changes",
    reviewSubtitle: "Here's what the AI sent back. Nothing is applied until you choose.",
    reviewReplace: "Replace my CV",
    reviewMerge: "Merge into my CV",
    reviewMergeHint: "Keeps what you already wrote and appends anything new.",
    reviewReplaceHint: "Discards the current content entirely.",
    reviewField: "Field",
    reviewBefore: "Now",
    reviewAfter: "After",
    reviewApplied: "CV updated",
    reviewWarnings: "Worth checking",
    reviewNoChange: "Nothing looks different — the AI may have sent your CV back unchanged.",

    /* ── Paste errors ── */
    pasteEmpty: "Paste the AI's reply first.",
    pasteNoJson: "No CV data found in that text. Make sure you copied the AI's whole reply, including the ```json block.",
    pasteBadJson: "That JSON is malformed — the AI may have cut its reply short. Ask it to send the JSON again.",
    pasteNotCv: "That JSON doesn't look like a CV. Check that you copied the right block.",
    charCount: "{n} characters",
} as const;

type Dict = Record<keyof typeof en, string>;

const ar: Dict = {
    appTitle: "صانع السيرة الذاتية",
    appSubtitle: "أنشئ سيرة ذاتية أنيقة بصفحة واحدة",
    edit: "تحرير",
    preview: "معاينة",
    sections: "الأقسام",
    section: "القسم",
    saved: "تم الحفظ",
    saving: "جارٍ الحفظ…",
    savedHint: "سيرتك محفوظة في هذا المتصفح",
    more: "المزيد",
    close: "إغلاق",
    cancel: "إلغاء",
    back: "رجوع",
    done: "تم",

    undo: "تراجع",
    redo: "إعادة",

    secPersonal: "المعلومات الشخصية",
    secLinks: "الروابط",
    secSummary: "النبذة",
    secSkills: "المهارات",
    secExperience: "الخبرات العملية",
    secProjects: "المشاريع",
    secEducation: "التعليم",
    secLanguages: "اللغات",
    secLayout: "الترتيب والأقسام",

    fullName: "الاسم الكامل",
    jobTitle: "المسمى الوظيفي",
    phone: "رقم الهاتف",
    location: "الموقع",
    email: "البريد الإلكتروني",
    sectionTitle: "عنوان القسم",
    label: "التسمية",
    url: "الرابط",
    category: "الفئة",
    description: "الوصف",
    projectName: "اسم المشروع",
    bulletPoints: "النقاط",
    titleAndCompany: "المسمى الوظيفي والشركة",

    hintPersonal: "اسمك ومسماك الوظيفي وبيانات التواصل",
    hintLinks: "لينكد إن، غيت هب، الموقع الشخصي، إلخ",
    hintSummary: "نبذة مهنية قصيرة (٢-٤ جمل)",
    hintSkills: "رتّب مهاراتك حسب الفئة",
    hintExperience: "أدر خبراتك — اضغط على أي عنصر لتحريره",
    hintProjects: "أدر مشاريعك — اضغط على أي عنصر لتحريره",
    hintLayout: "أعد ترتيب الأقسام أو أخفِ ما لا تحتاجه",

    add: "إضافة",
    addBullet: "إضافة نقطة",
    addLink: "إضافة رابط",
    addEntry: "إضافة عنصر",
    addSkillGroup: "إضافة فئة مهارات",
    addJob: "إضافة خبرة",
    addProject: "إضافة مشروع",
    remove: "حذف",
    duplicate: "نسخ",
    moveUp: "تحريك للأعلى",
    moveDown: "تحريك للأسفل",
    show: "إظهار",
    hide: "إخفاء",

    emptyJobs: "لا توجد خبرات بعد",
    emptyProjects: "لا توجد مشاريع بعد",
    emptyLinks: "لا توجد روابط بعد",
    emptySkills: "لا توجد مهارات بعد",
    emptyList: "لا يوجد شيء هنا بعد",
    emptyHint: "أضف أول عنصر، أو دع صانع الذكاء الاصطناعي يملأه نيابة عنك.",

    zoom: "التكبير",
    fit: "ملائمة",
    density: "الكثافة",
    compact: "مضغوط",
    roomy: "واسع",
    autoFit: "ملاءمة تلقائية",
    autoFitDone: "تم الضبط ليناسب صفحة واحدة",
    autoFitImpossible: "لا يزال طويلاً — جرّب حذف بعض النقاط",
    overflowTitle: "المحتوى يتجاوز الصفحة الواحدة",
    overflowBody: "حوالي {n} لن تظهر عند التصدير.",
    overflowFits: "يناسب صفحة واحدة",

    themeColor: "لون السيرة",
    customColor: "لون مخصص",
    language: "اللغة",

    export: "تصدير",
    exportPdf: "تحميل PDF",
    exportPng: "تحميل صورة PNG",
    print: "طباعة / حفظ كـ PDF",
    printHint: "أفضل جودة — النص يبقى قابلاً للتحديد",
    pdfHint: "ملف PDF بصيغة صورة مع روابط قابلة للنقر",
    pngHint: "صورة عالية الدقة",
    exporting: "جارٍ التصدير…",
    exportFailed: "فشل التصدير",
    exportReady: "التحميل جاهز",

    data: "بياناتك",
    downloadJson: "تحميل نسخة احتياطية (.json)",
    uploadJson: "استعادة من نسخة احتياطية",
    resetSample: "إعادة تعيين للسيرة النموذجية",
    resetBlank: "البدء من صفحة فارغة",
    resetTitle: "استبدال سيرتك الذاتية؟",
    resetBody: "سيتم استبدال كل ما في المحرر حالياً. يمكنك التراجع مباشرة بعدها.",
    resetConfirm: "نعم، استبدلها",
    importedOk: "تم تحميل السيرة",
    importFailed: "تعذّرت قراءة هذا الملف",

    aiBuilder: "الذكاء الاصطناعي",
    aiTitle: "صانع السيرة بالذكاء الاصطناعي",
    aiSubtitle: "دع الذكاء الاصطناعي يكتب سيرتك، ثم أعدها إلى هنا بلصقة واحدة.",
    aiStep1: "اختر ما تريد من الذكاء الاصطناعي",
    aiStep2: "انسخ التعليمات وافتح المساعد",
    aiStep3: "الصق رد الذكاء الاصطناعي هنا",
    aiModeBuild: "إنشاء من الصفر",
    aiModeBuildHint: "يسألك المساعد أسئلة ثم يكتب السيرة كاملة.",
    aiModeConvert: "تحويل سيرة موجودة",
    aiModeConvertHint: "الصق نص سيرتك القديمة ليُعاد تنسيقها تلقائياً.",
    aiModeTailor: "تخصيص لوظيفة معيّنة",
    aiModeTailorHint: "أعد كتابة سيرتك الحالية لتناسب إعلان وظيفة محدد.",
    aiPromptLang: "لغة التعليمات",
    aiCopyPrompt: "نسخ التعليمات",
    aiCopied: "تم النسخ!",
    aiCopiedToast: "تم نسخ التعليمات — الصقها في المحادثة",
    aiOpenIn: "افتح في",
    aiPasteLabel: "الصق رد الذكاء الاصطناعي",
    aiPastePlaceholder: "الصق كل ما أرسله المساعد — كتلة الـ JSON وأي كلام إضافي. سنستخرج السيرة منه.",
    aiApply: "مراجعة وتطبيق",
    aiJobPostLabel: "الصق وصف الوظيفة",
    aiJobPostPlaceholder: "الصق إعلان الوظيفة كاملاً هنا — سيُضاف إلى التعليمات.",
    aiOldCvLabel: "الصق سيرتك الحالية",
    aiOldCvPlaceholder: "الصق سيرتك الحالية كنص عادي — أي تنسيق يعمل.",
    aiImprove: "تحسين بالذكاء الاصطناعي",
    aiImproveHint: "ينسخ تعليمات مركّزة على هذا الجزء فقط من سيرتك.",

    reviewTitle: "مراجعة التغييرات",
    reviewSubtitle: "هذا ما أرسله الذكاء الاصطناعي. لن يُطبَّق شيء حتى تختار.",
    reviewReplace: "استبدال سيرتي",
    reviewMerge: "دمج مع سيرتي",
    reviewMergeHint: "يبقي ما كتبته ويضيف الجديد فقط.",
    reviewReplaceHint: "يحذف المحتوى الحالي بالكامل.",
    reviewField: "الحقل",
    reviewBefore: "الآن",
    reviewAfter: "بعد التطبيق",
    reviewApplied: "تم تحديث السيرة",
    reviewWarnings: "يستحق المراجعة",
    reviewNoChange: "لا يبدو أن هناك اختلافاً — ربما أعاد المساعد سيرتك كما هي.",

    pasteEmpty: "الصق رد الذكاء الاصطناعي أولاً.",
    pasteNoJson: "لم نجد بيانات سيرة في هذا النص. تأكد من نسخ رد المساعد كاملاً مع كتلة ```json.",
    pasteBadJson: "صيغة الـ JSON غير صحيحة — ربما قُطع رد المساعد. اطلب منه إرسال الـ JSON مجدداً.",
    pasteNotCv: "هذا الـ JSON لا يبدو كسيرة ذاتية. تأكد من نسخ الكتلة الصحيحة.",
    charCount: "{n} حرفاً",
};

const dicts: Record<UILang, Dict> = { en, ar };

export type TFunc = (key: keyof typeof en, vars?: Record<string, string | number>) => string;

export function makeT(lang: UILang): TFunc {
    const dict = dicts[lang] ?? dicts.en;
    return (key, vars) => {
        let out = dict[key] ?? en[key] ?? String(key);
        if (vars) {
            for (const [k, v] of Object.entries(vars)) {
                out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
            }
        }
        return out;
    };
}

export const dirFor = (lang: UILang): "rtl" | "ltr" => (lang === "ar" ? "rtl" : "ltr");
