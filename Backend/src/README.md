# VSDox Blog Backend

Full blog publishing backend for VSDox — Node.js + Express + PostgreSQL + Cloudinary.

## Features
- JWT authentication with roles (admin, editor, author)
- Full CRUD for posts with markdown → HTML rendering
- Auto slug generation + duplicate handling
- Post revisions / version history
- Soft delete (posts are never hard-deleted)
- Categories & tags with junction tables
- Image uploads via Cloudinary
- SEO metadata fields per post
- View counting
- Scheduled post support

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Create PostgreSQL database
```sql
CREATE DATABASE vsdox_blog;
```

### 4. Initialize database schema
```bash
npm run db:init
```

### 5. Start development server
```bash
npm run dev
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |

### Posts (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | All published posts (paginated) |
| GET | /api/posts/:slug | Single post by slug |

Query params for GET /api/posts: `page`, `limit`, `search`

### Posts (Admin — requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts/admin/all | All posts incl. drafts |
| POST | /api/posts/admin | Create post |
| PUT | /api/posts/admin/:id | Update post |
| DELETE | /api/posts/admin/:id | Soft delete |
| GET | /api/posts/admin/:id/revisions | Version history |

### Post Body (create/update)
```json
{
  "title": "My Post Title",
  "body": "# Markdown content here",
  "excerpt": "Short summary",
  "status": "draft | published | scheduled",
  "featured_image": "https://...",
  "featured_image_alt": "Alt text",
  "meta_title": "SEO title",
  "meta_description": "SEO description",
  "category_ids": ["uuid1"],
  "tag_ids": ["uuid1", "uuid2"],
  "scheduled_at": "2025-01-15T09:00:00Z"
}
```

### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/media/upload | Upload image (multipart/form-data, field: `image`) |
| GET | /api/media | List all media |
| DELETE | /api/media/:id | Delete from Cloudinary + DB |

### Categories & Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | All categories |
| POST | /api/categories | Create category |
| DELETE | /api/categories/:id | Delete category |
| GET | /api/tags | All tags |
| POST | /api/tags | Create tag |
| DELETE | /api/tags/:id | Delete tag |

---

## Frontend Integration (your VSDox React site)

```js
// src/api/blog.js
const API = 'https://your-backend.railway.app/api';

export const fetchPosts = (page = 1, search = '') =>
  fetch(`${API}/posts?page=${page}&search=${search}`).then(r => r.json());

export const fetchPost = (slug) =>
  fetch(`${API}/posts/${slug}`).then(r => r.json());
```

### Render a blog listing in React
```jsx
import { useEffect, useState } from 'react';
import { fetchPosts } from './api/blog';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { fetchPosts().then(d => setPosts(d.posts)); }, []);
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <a href={`/blog/${post.slug}`}>Read more →</a>
        </article>
      ))}
    </div>
  );
}
```

### Render a single post
```jsx
export default function BlogPost({ slug }) {
  const [post, setPost] = useState(null);
  useEffect(() => { fetchPost(slug).then(setPost); }, [slug]);
  if (!post) return <div>Loading…</div>;
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body_html }} />
    </article>
  );
}
```

---

## Deployment

### Backend → Railway (recommended)
1. Push to GitHub
2. Create new Railway project → Deploy from GitHub
3. Add PostgreSQL plugin
4. Set environment variables (copy from .env.example)
5. Set `DATABASE_URL` to Railway's Postgres URL

### Database → Neon (free managed Postgres)
1. Create account at neon.tech
2. Create database → copy connection string
3. Set as `DATABASE_URL` in .env

### Images → Cloudinary (free tier)
1. Sign up at cloudinary.com
2. Copy Cloud Name, API Key, API Secret
3. Set in .env

---

## Admin Dashboard
Open `admin-dashboard.html` in your browser.
Point it to your deployed backend URL in Settings.

---

## File Structure
```
src/
├── app.js                    # Express entry point
├── db.js                     # PostgreSQL pool
├── db/
│   └── init.js               # Schema migration
├── controllers/
│   ├── auth.controller.js
│   ├── posts.controller.js
│   ├── media.controller.js
│   └── categories.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── posts.routes.js
│   ├── media.routes.js
│   └── categories.routes.js
└── middleware/
    └── auth.middleware.js
```
