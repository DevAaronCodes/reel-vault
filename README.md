# ReelVault

ReelVault is a clean Vue 3 and Express MVP for managing a personal movie collection. The browser searches movies through the application API, the Express server securely talks to TMDB, and the saved collection stays in browser `localStorage`.

Live app: [reelvaultserver-production.up.railway.app](reelvaultserver-production.up.railway.app)

## Screenshots

Screenshots can be added after the first Railway deployment.

## Features

- Search TMDB movies through `GET /api/movies/search?query=...`
- View poster, title, year, rating, and overview
- Add owned movies to My Collection
- Edit media format and personal rating
- Delete saved movies
- Filter saved movies by title
- Persist the collection in browser `localStorage`
- Pytest API test suite with mocked TMDB data in `NODE_ENV=test`
- Jenkins declarative CI pipeline
- Single-service Railway deployment

## Architecture

```text
Browser
↓
Vue 3
↓
Express REST API
↓
TMDB

Collection data:
Browser localStorage

Deployment:
GitHub → Railway

Continuous integration:
GitHub → Jenkins → build and pytest
```

The browser never calls TMDB directly. The Vue app only calls same-origin `/api/*` routes.

## Tech Stack

- Frontend: Vue 3, TypeScript, Vite, Composition API, native fetch
- Backend: Node.js, Express, TypeScript
- External API: TMDB REST API
- Storage: browser `localStorage`
- Tests: Python, pytest, requests
- CI: Jenkins Pipeline
- Deployment: Railway

## Project Structure

```text
reel-vault/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── tests/
│   ├── conftest.py
│   ├── test_health_api.py
│   ├── test_movie_search_api.py
│   └── requirements.txt
├── scripts/
│   └── run-api-tests.mjs
├── .env.example
├── Jenkinsfile
├── railway.json
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- Python 3.10 or newer
- A TMDB API read access token for real movie search

## Installation

```bash
npm install
python -m venv .venv
. .venv/Scripts/activate   # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r tests/requirements.txt
```

## Environment Variables

Copy `.env.example` to `.env` for local server development:

```text
TMDB_API_TOKEN=your_tmdb_read_access_token
PORT=3000
```

Required variables:

- `TMDB_API_TOKEN`: TMDB read access token used only by the Express server
- `PORT`: server port, defaults to `3000`

Do not create `VITE_TMDB_API_TOKEN`. The token must never be part of the client build.

## Run Locally

Run the Vue client and Express server together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:server
npm run dev:client
```

Local URLs:

- Client: `http://localhost:5173`
- API: `http://localhost:3000/api/health`

Vite proxies local `/api` requests to the Express server.

## Build and Start

```bash
npm run build
npm run start
```

In production, Express serves both `/api/*` routes and the compiled Vue app from `client/dist`.

## Pytest

The API tests use `NODE_ENV=test`, which returns fixture movie data instead of calling TMDB.

Convenient command:

```bash
npm run test:api
```

Manual flow:

```bash
set NODE_ENV=test
set PORT=3001
set TMDB_API_TOKEN=test-token
npm --workspace server run dev
pytest tests
```

On macOS/Linux:

```bash
NODE_ENV=test PORT=3001 TMDB_API_TOKEN=test-token npm --workspace server run dev
API_BASE_URL=http://localhost:3001 pytest tests
```

## Jenkins

`Jenkinsfile` defines a declarative pipeline that:

- Checks out the GitHub repository
- Prints Node, npm, and Python versions
- Installs Node dependencies
- Creates a Python virtual environment
- Installs `tests/requirements.txt`
- Type-checks the client and server
- Builds the client and server
- Starts the Express server in test mode
- Waits for `/api/health`
- Runs `pytest tests --junitxml=reports/pytest-results.xml`
- Publishes the JUnit report and archives the server log
- Stops the test server in `post`

GitHub can notify Jenkins after pushes with a repository webhook. Jenkins checks out the pushed source, builds it, and runs the mocked API tests. Railway can deploy independently from the same GitHub repository.

## Railway Deployment

Deploy as one Railway service connected to GitHub.

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

Environment variables:

```text
TMDB_API_TOKEN=your_tmdb_read_access_token
PORT=provided by Railway
NODE_ENV=production
```

Health-check endpoint:

```text
/api/health
```

Railway injects `PORT` and runtime variables. Do not commit real `.env` files or tokens.

## Security Notes

- The TMDB token exists only on the Express server.
- `.env`, `.env.local`, and `.env.*.local` are excluded from Git.
- Railway injects the token at runtime.
- The Vue client only calls the application REST API.
- API responses and logs do not include the TMDB token.
- `localStorage` contains movie collection data, not secrets.
- `localStorage` data is tied to the current browser, device, and domain.
- Clearing browser data removes the collection.
- Collections do not currently synchronize between devices.

## Known MVP Limitations

- No authentication
- No database
- No cross-device sync
- No server-side library routes yet
- No Vue component tests yet
- API tests use a simple fixture mode rather than a full mock server

## Future Roadmap

- Vue component tests
- Selenium UI testing through pytest
- Authentication
- FastAPI experimentation
- SQLite
- PostgreSQL
- Shared cloud collections
- Docker
- Jenkins-controlled deployment
- Movie details endpoint
- Trending and popular movie endpoints
- Multiple collections
- Recommendations
- Barcode scanning
- 3D bookshelf
- Virtual movie rooms
