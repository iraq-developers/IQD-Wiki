# How to Edit IQD-Wiki Content

This guide explains how to update the wiki content directly from your browser without installing any software.

### 1. Editing an Existing Page

1. Navigate to the **[Content Folder](https://github.com/iraq-developers/IQD-Wiki/tree/main/content)**.
2. Click on the file you want to change (files end in `.md` or `.mdx`).
3. Click the **Pencil Icon** (✏️) in the top-right corner of the file view.
4. Make your text changes in the editor.
5. Scroll down to the **Commit changes** box.
   - **Commit message**: Write a short summary of what you changed (e.g., "Fixed typo in Intro").
   - Ensure "Commit directly to the `main` branch" is selected.
6. Click the green **Commit changes** button.

### 2. Creating a New Page

1. Go to the **[Content Folder](https://github.com/iraq-developers/IQD-Wiki/tree/main/content)**.
2. Click the **Add file** dropdown button in the top right.
3. Select **Create new file**.
4. In the name field, type your filename ending in `.md` (e.g., `my-new-guide.md`).
5. Write your content in the large text area.
6. Scroll down and click the green **Commit changes** button.

### 3. Organizing Content (Links & Folders)

**Adding Links**
To link to other pages, use `[Link Text](/page-name)`.

- Link to a top-level page: `[About Us](/about)`
- Link to a nested page: `[Frontend Guide](/web-development/frontend)`
- External link: `[Google](https://google.com)`

**Creating Sub-pages (Nested Pages)**
To create a structure like `/web-development/frontend`:

1. Create a **folder** named `web-development`.
2. Inside it, create an `index.md` file (this is the main page for that section).
3. For a sub-page, create another folder inside `web-development` named `frontend`.
4. Create an `index.md` inside `frontend`.

**Structure Example:**

- `content/index.md` -> Home Page
- `content/about.md` -> /about
- `content/web-development/index.md` -> /web-development
- `content/web-development/frontend/index.md` -> /web-development/frontend
- `content/web-development/backend.md` -> /web-development/backend

### 4. Markdown Cheatsheet

**Headings**
Use `#` for titles.
`# Main Title` (H1)
`## Section Title` (H2)
`### Subsection` (H3)

**Text Formatting**
`**Bold Text**` -> **Bold Text**
`*Italic Text*` -> _Italic Text_
`~~Strikethrough~~` -> ~~Strikethrough~~

**Lists**
Unordered:

- Item 1
- Item 2

Ordered:

1. First Step
2. Second Step

**Images**

1. Upload your image to the **`public`** folder.
2. Use this code: `![Alt Text](/image-name.png)`
   _(Note: Do not include "public" in the link, just `/filename.ext`)_

**Code Blocks**
Use three backticks (\`\`\`) to create a code block:

\`\`\`javascript
console.log("Hello World");
\`\`\`

**Quotes**
`> This is a quote` ->

> This is a quote

---

### ⚡ Automatic Updates

When you make a change, the website at **[https://iraq-developers.netlify.app/](https://iraq-developers.netlify.app/)** will be updated automatically in few seconds.

### 🤝 How to Contribute

To edit files, you must be added to the repository contributors list.

- **Request Access:** Contact the moderators at **[r/iraq_developers](https://www.reddit.com/r/iraq_developers/)** to get added.

**Why Contribute?**
We are the **Iraq Developers Community**, dedicated to building a comprehensive resource for developers in Iraq. By sharing knowledge and documenting local tech resources, we help each other grow and build a stronger tech ecosystem together.
.
