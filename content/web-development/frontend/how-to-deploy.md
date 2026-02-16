---
title: طرق رفع الموقع (Website Deployment)
description: شرح لأفضل الطرق المجانية لرفع موقعك على الإنترنت باستخدام GitHub Pages, Netlify, Vercel وشلون تشتري وتربط Domain خاص بيك.
---

# رفع الموقع على الإنترنت (Deployment)

## شنو يعني Deployment؟
الـ Deployment هو عملية نقل ملفات الموقع (HTML, CSS, JS) من حاسبتك الشخصية (Local Environment) إلى خادم (Server) متصل بالإنترنت، حتى يكدر أي شخص يفتح الموقع عن طريق رابط (Domain/URL). بدون هاي الخطوة، الموقع يبقى محبوس داخل حاسبتك.

راح نشرح 3 طرق شائعة ومجانية لرفع موقعك، وبعدها نشرح شلون تسوي رابط احترافي (Domain).

---

## 1. GitHub Pages
وحدة من أسهل الطرق اذا كان الكود مالتك موجود أصلاً على GitHub. ميزتها أنها مجانية بالكامل ومباشرة من الـ Repository.

### الخطوات:
1. ارفع مشروعك على **GitHub Repository** وتأكد ان ملفك الرئيسي اسمه `index.html`.
2. ادخل على الـ **Settings** الخاصة بالـ Repository.
3. من القائمة الجانبية اختار **Pages**.
4. تحت قسم **Build and deployment**، اختار الـ **Branch** (غالباً يكون `main` أو `master`) واضغط **Save**.

![upload to github](https://i.imgur.com/xQQEBYC.png)

![enable github pages](https://i.imgur.com/CTGP4WR.png)

![website is live!](https://i.imgur.com/HnnhSEO.png)

بعد دقيقة تقريباً، راح ينطيك رابط موقعك ويكون بهذا الشكل: `username.github.io/repo-name`.

---

## 2. Netlify
منصة قوية جداً وسريعة، تدعم الـ Drag & Drop (سحب وافلات) وتدعم الربط مع GitHub للتحديث التلقائي.

### الطريقة الأولى: السحب والافلات (Manual Deploy)
1. سوي حساب على [Netlify](https://www.netlify.com).
2. بعد تسجيل الدخول، روح على صفحة **Sites**.
3. اسحب فولدر المشروع مالتك (اللي يحتوي على ملف `index.html`) وشمره داخل المتصفح بالمكان المخصص.

![Netlify Drag and Drop Area](https://i.imgur.com/tvaLrXX.png)

### الطريقة الثانية: الربط مع GitHub (Recommended)
1. اضغط على **Add new site** واختار **Import from existing project**.
2. اختار **GitHub**.
3. اختار الـ Repository الخاص بموقعك.
4. اضغط **Deploy Site**.
الميزة هنا ان أي تغيير (Push) تسويه على GitHub، الموقع راح يتحدث تلقائياً (Continuous Deployment).

---

## 3. Vercel
مشابه لـ Netlify، لكنه يعتبر الخيار الأول اذا كنت تشتغل بـ Frameworks حديثة مثل Next.js، وأدائه ممتاز جداً حتى للمواقع العادية (Static Sites).

### الخطوات:
1. سوي حساب على [Vercel](https://vercel.com).
2. اضغط على **Add New** > **Project**.
3. سوي Import للـ Git Repository مالتك.
4. اترك الاعدادات الافتراضية (Build Settings) مثل ما هي اذا كان موقع HTML/CSS بسيط.
5. اضغط **Deploy**.

![Vercel Import Project Screen](https://i.imgur.com/cAy5W1M.png)

---

## 4. الدومين الاحترافي (Custom Domain)
أكيد ميعجبك رابط موقعك يبقى طويل مثل `my-site.netlify.app`. حتى يصير موقعك احترافي (مثلاً `ahmed-tech.com`)، تحتاج تشتري **Domain Name**.

راح نستخدم **Namecheap** للشراء، و نربطه بـ **Netlify**.

### أولاً: شراء الدومين من Namecheap
1. ادخل على موقع [Namecheap](https://www.namecheap.com) وسوي حساب.
2. اكتب اسم الموقع اللي تريده بالبحث (مثلاً `iq-developer`).
3. اختار الامتداد المناسب (`.com` هو الأفضل دائماً) واضغط **Add to Cart**.
4. كمل عملية الدفع (Checkout). سعر الـ `.com` تقريباً 10$ بالسنة.

![Namecheap Search Interface](https://i.imgur.com/r1IaQnF.png)

### ثانياً: ربط الدومين مع Netlify
هسة لازم نكول لـ Netlify "هذا الدومين صار ملكي"، ونكول لـ Namecheap "وجه الزوار لـ Netlify".

1. افتح مشروعك في **Netlify**.
2. روح على **Domain management**.
3. اضغط على **Add a domain** واكتب اسم الدومين اللي اشتريته (مثلاً `iq-developer.com`).
4. راح يطلعلك تنبيه (Check DNS configuration)، اضغط عليه.
5. راح ينطيك Netlify عناوين سيرفرات اسمها **Nameservers** (غالباً تكون 4 روابط مثل `dns1.p01.nsone.net`). انسخها.

![Netlify Domain Settings](https://i.imgur.com/ePuXqwp.png)

### ثالثاً: تحديث الـ DNS في Namecheap
1. ارجع لـ **Namecheap Dashboard**، وروح على الـ Domain List.
2. اضغط **Manage** يم الدومين مالتك.
3. بصف كلمة **Nameservers**، غير الاختيار من "Namecheap BasicDNS" الى **Custom DNS**.
4. الصق الـ Nameservers الأربعة اللي اخذتها من Netlify.
5. اضغط علامة الصح الخضراء للحفظ.

**ملاحظة:** عملية الربط ممكن تتأخر من دقائق الى 24 ساعة (Global Propagation) حتى يشتغل الموقع بكل العالم.

## نصيحة أخيرة
اذا ردت تسوي بورتفوليو احترافي للتقديم على الشركات، استثمر 10$ واشتري دومين `.com` باسمك. هذا ينطي انطباع انك مهتم و Professional.