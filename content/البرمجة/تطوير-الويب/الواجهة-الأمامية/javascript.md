---
title: تعلم JavaScript
description: الدليل الشامل لتعلم JavaScript - لغة الويب الأساسية للتفاعل
---

# تعلم JavaScript 🚀

JavaScript هي اللغة التي تحيي صفحات الويب! كل زر يعمل، كل قائمة تنفتح، كل محتوى يتحدث - كله بفضل JavaScript.

## 🤔 لماذا JavaScript؟

- **لغة الويب الوحيدة**: المتصفحات تفهم JavaScript فقط
- **متعددة الاستخدامات**: Front-end، Back-end، Mobile، Desktop
- **سهلة البداية**: نتائج فورية في المتصفح
- **مجتمع ضخم**: ملايين المطورين والمكتبات

## 📝 أول كود JavaScript

```javascript
console.log("مرحباً بالعالم! 🌍");
alert("أهلاً بك!");
```

## 📦 المتغيرات

```javascript
// المتغير القابل للتغيير
let age = 25;
age = 26; // ✅ يمكن تغييره

// الثابت
const name = "أحمد";
// name = "محمد"; // ❌ خطأ! لا يمكن تغييره

// القديم (تجنبه)
var oldWay = "استخدم let أو const بدلاً مني";
```

## 📊 أنواع البيانات

```javascript
// النصوص (Strings)
const greeting = "مرحباً";
const name = "أحمد";
const message = `أهلاً يا ${name}!`; // Template Literal

// الأرقام (Numbers)
const price = 99.99;
const quantity = 5;

// القيم المنطقية (Booleans)
const isLoggedIn = true;
const isEmpty = false;

// المصفوفات (Arrays)
const colors = ["أحمر", "أخضر", "أزرق"];
const mixed = [1, "نص", true, { key: "value" }];

// الكائنات (Objects)
const user = {
  name: "أحمد",
  age: 25,
  isActive: true,
};

// Null و Undefined
let empty = null; // قيمة فارغة معروفة
let notDefined; // undefined (لم يُعرّف بعد)
```

## 🔧 العمليات

```javascript
// العمليات الحسابية
const sum = 10 + 5; // 15
const diff = 10 - 5; // 5
const product = 10 * 5; // 50
const quotient = 10 / 5; // 2
const remainder = 10 % 3; // 1

// العمليات المنطقية
const and = true && false; // false
const or = true || false; // true
const not = !true; // false

// المقارنات
const isEqual = 5 === 5; // true (المساواة الصارمة)
const isGreater = 10 > 5; // true
const isLessOrEqual = 5 <= 5; // true
```

## 🔀 الشروط

```javascript
const age = 20;

if (age >= 18) {
  console.log("أنت بالغ");
} else if (age >= 13) {
  console.log("أنت مراهق");
} else {
  console.log("أنت طفل");
}

// الشرط المختصر (Ternary)
const status = age >= 18 ? "بالغ" : "قاصر";

// التبديل (Switch)
const day = "السبت";

switch (day) {
  case "الجمعة":
    console.log("إجازة!");
    break;
  case "السبت":
    console.log("عمل");
    break;
  default:
    console.log("يوم عادي");
}
```

## 🔄 الحلقات

```javascript
// حلقة for التقليدية
for (let i = 0; i < 5; i++) {
  console.log(`العدد: ${i}`);
}

// حلقة for...of (للمصفوفات)
const fruits = ["تفاح", "برتقال", "موز"];
for (const fruit of fruits) {
  console.log(fruit);
}

// حلقة for...in (للكائنات)
const user = { name: "أحمد", age: 25 };
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// حلقة while
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
```

## 🔨 الدوال (Functions)

```javascript
// الدالة العادية
function greet(name) {
  return `مرحباً يا ${name}!`;
}

// الدالة السهمية (Arrow Function)
const greet = (name) => `مرحباً يا ${name}!`;

// دالة بقيمة افتراضية
const greet = (name = "زائر") => `مرحباً يا ${name}!`;

// استدعاء الدالة
console.log(greet("أحمد")); // مرحباً يا أحمد!
console.log(greet()); // مرحباً يا زائر!
```

## 📚 التعامل مع المصفوفات

```javascript
const numbers = [1, 2, 3, 4, 5];

// map - تحويل كل عنصر
const doubled = numbers.map((n) => n * 2);
// [2, 4, 6, 8, 10]

// filter - تصفية العناصر
const even = numbers.filter((n) => n % 2 === 0);
// [2, 4]

// find - إيجاد عنصر
const found = numbers.find((n) => n > 3);
// 4

// reduce - تجميع القيم
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// forEach - التكرار
numbers.forEach((n) => console.log(n));

// إضافة وحذف
numbers.push(6); // إضافة للنهاية
numbers.pop(); // حذف من النهاية
numbers.unshift(0); // إضافة للبداية
numbers.shift(); // حذف من البداية
```

## 🌐 التعامل مع DOM

```javascript
// اختيار العناصر
const title = document.querySelector("h1");
const buttons = document.querySelectorAll(".btn");
const header = document.getElementById("header");

// تغيير المحتوى
title.textContent = "عنوان جديد";
title.innerHTML = "<span>عنوان</span> جديد";

// تغيير الأنماط
title.style.color = "blue";
title.style.fontSize = "24px";

// إضافة وحذف الكلاسات
title.classList.add("active");
title.classList.remove("hidden");
title.classList.toggle("selected");

// الأحداث (Events)
const button = document.querySelector("button");

button.addEventListener("click", () => {
  alert("تم الضغط!");
});

button.addEventListener("mouseover", () => {
  button.style.background = "blue";
});
```

## ⏳ البرمجة غير المتزامنة (Async)

```javascript
// Promises
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("تم جلب البيانات!");
    }, 1000);
  });
};

fetchData()
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// Async/Await (الأسهل)
const getData = async () => {
  try {
    const response = await fetch("/api/users");
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error("حدث خطأ:", error);
  }
};
```

## 🌍 Fetch API

```javascript
// جلب البيانات (GET)
const getUsers = async () => {
  const response = await fetch("/api/users");
  const users = await response.json();
  return users;
};

// إرسال بيانات (POST)
const createUser = async (userData) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// استخدام
const newUser = await createUser({
  name: "أحمد",
  email: "ahmed@example.com",
});
```

## 🎨 مثال عملي: قائمة مهام

```javascript
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

const todos = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const todo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(todo);
  renderTodos();
  input.value = "";
});

const renderTodos = () => {
  list.innerHTML = todos
    .map(
      (todo) => `
    <li class="${todo.completed ? "completed" : ""}">
      <span>${todo.text}</span>
      <button onclick="toggleTodo(${todo.id})">✓</button>
      <button onclick="deleteTodo(${todo.id})">✕</button>
    </li>
  `,
    )
    .join("");
};

const toggleTodo = (id) => {
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
  renderTodos();
};

const deleteTodo = (id) => {
  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) todos.splice(index, 1);
  renderTodos();
};
```

## ✅ أفضل الممارسات

1. **استخدم `const` دائماً**: إلا إذا كنت ستغير القيمة
2. **تجنب `var`**: استخدم `let` أو `const`
3. **استخدم `===`**: بدل `==` للمقارنة الصارمة
4. **الأسماء الواضحة**: `getUserData` أفضل من `gud`
5. **التعامل مع الأخطاء**: استخدم `try/catch`

## 🚀 الخطوة التالية

بعد إتقان الأساسيات:

- **TypeScript**: JavaScript بأنواع صارمة
- **React/Vue**: أُطر الواجهات الأمامية
- **Node.js**: JavaScript في الخادم
