---
title: لغة البرمجة جافاسكريبت (JavaScript)
---

# JavaScript (JS)

## شنو يعني JavaScript؟

اذا **HTML** هو الهيكل، و **CSS** هو الشكل، لعد **JavaScript** هي "العقل والروح" للموقع. هي اللغة اللي تحول الموقع من صفحة جامدة الى تطبيق تفاعلي.

بواسطة JS تكدر تسوي:

- تعديل المحتوى بدون ما تسوي Refresh للصفحة.
- تفاعل مع المستخدم (ضغطات أزرار، ادخال بيانات).
- إرسال واستقبال بيانات من السيرفر (API Calls).
- بناء تطبيقات ومواقع كاملة معقدة (مثل Facebook, Netflix).

---

> **⚠️ نصيحة مهمة جداً**
> لا تستعجل وتطفر لتعلم **React** أو **Vue** أو **Next.js** قبل ما تضبط أساسيات الـ JavaScript (Vanilla JS).
>
> 90% من المشاكل اللي راح تواجهك بتعلم React هي بالحقيقة مشاكل بأساسيات اللغة نفسها (مثل `this`, `Promises`, `Destructuring`).
> **استثمر وقتك بالأساس، وراح ترتاح بعدين.**

---

## أساسيات الكتابة (Syntax)

الـ JavaScript لغة مرنة جداً، وهذا سلاح ذو حدين.

```javascript
// تعريف المتغيرات (Variables)
let name = "Omar"; // متغير قابل للتغيير
const age = 25; // ثابت غير قابل للتغيير (الأفضل استخدامه دائماً)

// الدوال (Functions)
function sayHello(personName) {
  return "Hello, " + personName;
}

// Arrow Functions (الطريقة الحديثة)
const sayHelloModern = (personName) => {
  return `Hello, ${personName}`; // Template Literals
};

// الشروط (Conditionals)
if (age > 18) {
  console.log("بالغ");
} else {
  console.log("قاصر");
}
```

---

## مفاهيم أساسية لازم تضبطها (Core Concepts)

قبل ما تنتقل لأي فريم ورك، تأكد انك فاهم هاي المواضيع زين:

### 1. التعامل مع البيانات (Data Manipulation)

- **Array Methods:** (`map`, `filter`, `reduce`, `find`). هاي راح تستخدمها يومياً بـ React.
- **Objects:** شلون توصل للبيانات (`dot notation`, `bracket notation`).
- **Destructuring:** استخراج البيانات بسهولة (`const { name } = user`).

### 2. التزامن (Asynchronous JS)

الجافاسكريبت تشتغل بـ Thread واحد، يعني تنفذ أمر واحد بنفس الوقت. بس مرات نحتاج ننتظر بيانات من السيرفر بدون ما نجمد الواجهة. هنا يجي دور:

- **Promises**
- **Async / Await** (الطريقة الأسهل والأحدث).

### 3. الـ DOM Manipulation

شلون تعدل عناصر الـ HTML وتسمع للأحداث (Events) مثل الضغط والكتابة باستخدام كود JS.

---

## مصادر التعلم (Resources)

### 1. التأسيس (YouTube)

- **[كورس JavaScript - Elzero Web School](https://www.youtube.com/watch?v=GM6dQBmc-Xg&list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv)**
  (أفضل كورس عربي شامل وتفصيلي).

### 2. المراجع (Documentation)

- **[MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** (المرجع الرسمي).
- **[JavaScript.info](https://javascript.info/)** (موقع ممتاز يشرح كل التفاصيل بعمق).

---

**[الخطوة التالية: لغة TypeScript (النسخة المطورة) ←](/web-development/frontend/technologies/typescript)**
