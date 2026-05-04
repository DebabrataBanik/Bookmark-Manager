# Bookmark Manager

A full-stack bookmark manager where you can save, organize, and revisit links. It scrapes metadata from URLs automatically so you don't have to fill everything in yourself.

---

# Overview

This system allows users to store bookmarks with minimal effort while maintaining a structured and queryable dataset.

## What it does

- Save any URL with a title, description, and category tags
- Metadata (publisher, author, date) is scraped automatically on save
- Filter bookmarks by category tags or search by title
- Sort by recently added, recently visited, or most visited
- Pin important bookmarks and archive ones to keep feed clean
- Visit tracking - every time you open a link, the view count and last visited date update

---

## Tech Stack

**Frontend**

- React 19
- TanStack Query - for server state, caching, revalidation
- Tailwind CSS

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- Zod

---

## Project Structure

```
├── frontend/
│   ├── src/
│       ├── components/
│       │   ├── Feed.jsx
│       │   ├── Archive.jsx
│       │   ├── BookmarkForm.jsx
│       │   ├── Header.jsx
│       │   └── Sidebar.jsx
│       │
│       ├── context/
│       │   └── ThemeContext.jsx
│       │
│       ├── hooks/
│       │   └── useDebounce.js
│       │
│       ├── services/
│       │   ├── bookmarkService.js
│       │   └── categoryService.js
│       │
│       ├── utils/
│       │   └── getData.js
│       │
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       └── tokens.css
|
└── backend/
    ├── controllers/
    │   ├── bookmarkController.js
    │   └── categoryController.js
    ├── models/
    │   └── Bookmark.js
    ├── routes/
    │   ├── bookmark.js
    │   └── category.js
    ├── schema/
    │   └── BookmarkSchema.js     # Zod validation schema
    └── server.js
```

---

## Getting Started

### Prerequisites

- Node.js(LTS recommended)
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo

```bash
git clone https://github.com/DebabrataBanik/bookmark-manager.git
cd bookmark-manager
```

### 2. Set up environment variables

Create a `.env` file in the `backend/` directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_BASE_URL=http://localhost:8000
VITE_CLIENT_ID=your_brandfetch_logo_api_key
```

### 3. Run the app

```bash
# start the backend
cd backend && npm install && npm start

# start the frontend
cd frontend && npm install && npm run dev
```

The app will be at `http://localhost:5173` or similar and the server at `http://localhost:8000`.

---

## API Reference

| Method   | Endpoint                    | Description                                                    |
| -------- | --------------------------- | -------------------------------------------------------------- |
| `GET`    | `/api`                      | Get all bookmarks (supports `?category`, `?search`, `?sortBy`) |
| `POST`   | `/api/bookmark/add`         | Add a new bookmark                                             |
| `PUT`    | `/api/bookmark/:id`         | Update a bookmark                                              |
| `DELETE` | `/api/bookmark/:id`         | Delete a bookmark                                              |
| `PATCH`  | `/api/bookmark/:id`         | Toggle pin                                                     |
| `PATCH`  | `/api/bookmark/archive/:id` | Toggle archive                                                 |
| `GET`    | `/api/bookmarks/archive`    | Get archived bookmarks                                         |
| `PATCH`  | `/api/bookmark/:id/visit`   | Increment visit count                                          |
| `GET`    | `/api/categories`           | Get all category tags with counts                              |

### Query parameters for `GET /api`

| Param      | Type   | Example                    | Description                       |
| ---------- | ------ | -------------------------- | --------------------------------- |
| `category` | string | `Design,React`             | Comma-separated tags to filter by |
| `search`   | string | `tailwind`                 | Searches bookmark titles          |
| `sortBy`   | string | `add` \| `visit` \| `most` | Sort order                        |

---

## How it works

When you add a bookmark, the backend scrapes the URL to pull metadata - title, description, publisher, author, and publish date - so most fields fill themselves in. You only need to provide the URL and some category tags.

Category tags are stored as an array on each bookmark and aggregated on the fly, so the sidebar tag counts always reflect the current state of your feed without any separate tag management.

TanStack Query handles all server state on the frontend. Mutations automatically invalidate the relevant queries so the feed, archive, and sidebar stay in sync after every action without manual state juggling.

---

## Known limitations

- No authentication or multi-user support
- The scraper depends on the target site having proper meta tags. Sites that are JavaScript-rendered or paywalled will return incomplete metadata.
- No user accounts yet — this is currently a single-user local app.

---

## Further Developments

- **Authentication** — right now there's no user system, anyone with the URL can hit the API
- **Bulk actions** — select multiple bookmarks to archive or delete at once
- **Rate limiting** — protect the scrape endpoint from being hammered
- **Browser extension** — one-click saving from the browser without opening the app

---

## Author

Built by [Debabrata K Banik](https://github.com/DebabrataBanik)
