---
title: Tailwind CSS
description: شرح مفهوم الـ Utility-first Framework وكيفية استخدام Tailwind CSS لتسريع بناء الواجهات.
---

# Tailwind CSS

## شنو هو Tailwind CSS؟
الـ Tailwind CSS هو عبارة عن "Utility-first CSS Framework". فكرته تختلف تماماً عن المكتبات التقليدية مثل Bootstrap. بدلاً من أن ينطيك مكونات جاهزة (مثل Navbar أو Buttons جاهزة)، هو ينطيك "أدوات" أو Classes صغيرة جداً، كل Class يسوي وظيفة وحدة بس (مثلاً يغير اللون، أو يضيف Padding).

انت تبني التصميم مالتك عن طريق تجميع هاي الـ Classes مباشرة داخل الـ HTML بدون ما تكتب سطر CSS واحد بملف خارجي.

![tailwindcss code example](https://raw.githubusercontent.com/tailwindlabs/tailwindcss-intellisense/main/packages/vscode-tailwindcss/.github/autocomplete.png)

## ليش نستخدمه؟
استخدام Tailwind صار Standard بكثير من الشركات للأسباب التالية:
1.  **سرعة التطوير (Development Speed):** ما تحتاج تفكر بأسماء للكلاسات (مثل `.wrapper-inner-left`) ولا تتنقل بين ملف الـ HTML والـ CSS.
2.  **حجم الملف (Performance):** عند الـ Build، الـ Tailwind يحذف كل الـ Classes اللي ما استخدمتها بالمشروع، فالملف النهائي يكون جداً صغير.
3.  **التناسق (Consistency):** المسافات والألوان وأحجام الخطوط محددة مسبقاً، فما راح تستخدم قيم عشوائية (Magic Numbers) بالتصميم.

## طريقة الكتابة (Syntax)
الفرق الأساسي هو أنك توصف شكل العنصر داخل الـ HTML مباشرة.

### مقارنة بين الطريقة العادية و Tailwind

**1. الطريقة التقليدية (Vanilla CSS):**
تكتب اسم كلاس بالـ HTML، وبعدين تروح لملف الـ CSS تكتب الخصائص.

```html
<button class="btn-primary">Click Me</button>
```

```css
/* CSS File */
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
```

**2. طريقة Tailwind CSS:**
تطبق الخصائص مباشرة باستخدام الـ Utility Classes.

```html
<button class="bg-blue-500 text-white py-2 px-4 rounded">
  Click Me
</button>
```

* `bg-blue-500`: يخلي الخلفية زرقاء.
* `text-white`: يخلي النص أبيض.
* `py-2`: يضيف Padding عمودي (فوق وجوه).
* `px-4`: يضيف Padding أفقي (يمين ويسار).
* `rounded`: يخلي الحواف دائرية (Border Radius).



## إعداد البيئة (Setup)
الـ Tailwind يفضل استخدامه مع الـ Build Tools (مثل Vite أو Next.js) حتى تستفاد من كل ميزاته.
أبسط طريقة للتجربة السريعة (لغرض التعلم فقط) هي استخدام الـ [Play CDN](https://tailwindcss.com/docs/installation/play-cdn)، لكن **لا تستخدمها** بمشاريع حقيقية لأنها ثقيلة.

```html
<script src="https://cdn.tailwindcss.com"></script>
```



## نصيحة للمبتدئين

لا تبدي تتعلم Tailwind CSS إذا انت ما فاهم [**CSS**](/web-development/frontend/technologies/css) الأصلي زين. الـ Tailwind هو مجرد طريقة كتابة مختلفة، اذا ما تعرف شنو يعني Flexbox أو Grid أو Padding، ما راح تفتهم الـ Tailwind . اضبط الأساسيات اول، وبعدين انتقل للـ Frameworks.

::youtube[https://www.youtube.com/watch?v=lCxcTsOHrjo]