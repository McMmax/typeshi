# 🔴 typeshi — Max's Personal Blog

> **Personal engineering blog and dev notes by Max ([@McMmax](https://github.com/McMmax)).**  
> *Built with Nuxt 3 SSG, styled with an Umbrella-inspired red/white/dark aesthetic, and hosted exclusively on GitHub Pages.*

---

## 🌐 Live Blog

**[mcmmax.github.io/typeshi](https://mcmmax.github.io/typeshi/)**

---

## ⚡ Highlights

* **Clean Aesthetic**: Crisp Umbrella logo, sharp red accents, deep slate surfaces, and technical typography (*Chakra Petch*, *Rajdhani*, *JetBrains Mono*, *Inter*).
* **Dark & Light Modes**: Instant theme toggle between Dark and Light with zero flash on reload.
* **100% Static & Serverless**: Compiled using **Nuxt 3 SSG (Static Site Generation)**. Zero databases, zero server processes to manage.
* **Hosted on GitHub Pages**: Deployed globally via CDN with zero hosting bills ($0/month).
* **Topics & Search**: Filter articles by tag (`#nuxt`, `#vue`, `#architecture`, `#web-dev`) or search across titles and summaries.

---

## ✍️ How to Publish a New Post

1. Open `data/posts.ts`.
2. Add a new article object to the `posts` array:

```typescript
{
  slug: 'my-new-article',
  title: 'Thoughts on Software Design',
  date: '2026.10.20',
  author: {
    name: 'Max',
    handle: 'McMmax',
    role: 'Developer & Creator',
    avatar: 'https://avatars.githubusercontent.com/u/156390123?v=4',
  },
  tags: ['design', 'software', 'architecture'],
  readTime: '3 min read',
  featured: false,
  summary: 'Brief overview for preview cards and SEO metadata.',
  content: `
    <p class="lead">Summary lead paragraph...</p>
    <h3>Section Header</h3>
    <p>Body text with <code>code snippets</code>.</p>
  `,
}
```

3. Deploy with one command:

```bash
npm run deploy
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:3000)
npm run dev

# Generate static site into .output/public
npm run generate

# Deploy pre-rendered static build to gh-pages branch
npm run deploy
```

---

## 📜 License

Created by [Max (McMmax)](https://github.com/McMmax). Licensed under the MIT License.
