---
title: تعلم CSS
description: الدليل الشامل لتعلم CSS - تنسيق صفحات الويب وجعلها جذابة
---

# تعلم CSS 🎨

CSS (Cascading Style Sheets) هي اللغة المسؤولة عن جمال موقعك! الألوان، الخطوط، التخطيط، الحركات - كل هذا بفضل CSS.

## 🤔 ما هي CSS؟

إذا كانت HTML هي العظام، فـ CSS هي الجلد والملابس. تتحكم في:

- **الألوان والخلفيات**
- **الخطوط والأحجام**
- **المسافات والتخطيط**
- **الحركات والتأثيرات**

## 📝 طرق إضافة CSS

### 1. ملف خارجي (الأفضل)

```html
<link rel="stylesheet" href="style.css" />
```

### 2. داخل `<style>`

```html
<style>
  p {
    color: blue;
  }
</style>
```

### 3. مباشرة على العنصر

```html
<p style="color: blue;">نص أزرق</p>
```

## 🎯 المحددات (Selectors)

### المحددات الأساسية

```css
/* حسب اسم العنصر */
p {
  color: blue;
}

/* حسب الكلاس (class) */
.card {
  background: white;
}

/* حسب المعرف (ID) */
#header {
  height: 60px;
}

/* أي عنصر */
* {
  margin: 0;
  padding: 0;
}
```

### المحددات المركبة

```css
/* عناصر داخل عنصر */
.card p {
  font-size: 14px;
}

/* الأبناء المباشرين فقط */
.card > p {
  font-weight: bold;
}

/* عناصر متعددة */
h1,
h2,
h3 {
  font-family: "Cairo", sans-serif;
}

/* كلاسين معاً */
.card.featured {
  border: 2px solid gold;
}
```

### حالات العناصر (Pseudo-classes)

```css
a:hover {
  color: red;
}

button:active {
  transform: scale(0.95);
}

input:focus {
  border-color: blue;
}

li:first-child {
  font-weight: bold;
}

li:nth-child(even) {
  background: #f5f5f5;
}
```

## 🎨 الألوان

```css
.examples {
  /* بالاسم */
  color: red;

  /* HEX (الأكثر شيوعاً) */
  color: #ff5733;

  /* RGB */
  color: rgb(255, 87, 51);

  /* RGBA (مع شفافية) */
  color: rgba(255, 87, 51, 0.5);

  /* HSL (الأسهل للتعديل) */
  color: hsl(14, 100%, 60%);
}
```

## 📐 الصندوق (Box Model)

كل عنصر HTML هو صندوق يتكون من:

```
┌─────────────── margin ───────────────┐
│ ┌─────────── border ───────────────┐ │
│ │ ┌───────── padding ────────────┐ │ │
│ │ │ ┌─────── content ──────────┐ │ │ │
│ │ │ │                          │ │ │ │
│ │ │ │      المحتوى الفعلي       │ │ │ │
│ │ │ │                          │ │ │ │
│ │ │ └──────────────────────────┘ │ │ │
│ │ └──────────────────────────────┘ │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

```css
.box {
  width: 200px;
  height: 100px;
  padding: 20px; /* مسافة داخلية */
  border: 2px solid #333; /* الحدود */
  margin: 10px; /* مسافة خارجية */
  box-sizing: border-box; /* الحجم يشمل padding و border */
}
```

## 🏗️ التخطيط (Layout)

### Flexbox (الأكثر استخداماً)

```css
.container {
  display: flex;
  justify-content: center; /* توسيط أفقي */
  align-items: center; /* توسيط عمودي */
  gap: 20px; /* مسافة بين العناصر */
  flex-wrap: wrap; /* السماح بالالتفاف */
}

.item {
  flex: 1; /* يتمدد ليملأ المساحة */
}
```

### Grid (للشبكات المعقدة)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 أعمدة متساوية */
  gap: 20px;
}

/* العنصر يمتد على عمودين */
.wide {
  grid-column: span 2;
}
```

## 📱 التصميم المتجاوب

```css
/* الموبايل أولاً */
.card {
  width: 100%;
  padding: 16px;
}

/* شاشات متوسطة (تابلت) */
@media (min-width: 768px) {
  .card {
    width: 50%;
  }
}

/* شاشات كبيرة (ديسكتوب) */
@media (min-width: 1024px) {
  .card {
    width: 33.33%;
  }
}
```

## ✨ الحركات والتأثيرات

### Transitions (الانتقالات)

```css
.button {
  background: #667eea;
  transition: all 0.3s ease;
}

.button:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

### Animations (الحركات)

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.animated {
  animation: pulse 2s infinite;
}
```

## 🎨 مثال عملي: بطاقة جميلة

```css
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
}

.card-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.card-button:hover {
  opacity: 0.9;
}
```

## ✅ أفضل الممارسات

1. **استخدم الكلاسات**: تجنب تنسيق العناصر مباشرة
2. **أسماء واضحة**: `.card-title` أفضل من `.ct`
3. **Mobile First**: صمم للموبايل أولاً
4. **CSS Variables**: للألوان والأحجام المكررة

```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --text: #1a1a2e;
  --spacing: 16px;
}

.button {
  background: var(--primary);
  padding: var(--spacing);
}
```

## 🚀 الخطوة التالية

بعد إتقان CSS، تعلم:

- **Sass/SCSS**: CSS مع ميزات إضافية
- **Tailwind CSS**: إطار عمل CSS شهير
- **CSS Animations**: حركات متقدمة
