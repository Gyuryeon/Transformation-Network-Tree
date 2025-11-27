
# Christmas Tree Design

This is a code bundle for Christmas Tree Design. The original project is available at https://www.figma.com/design/O74JU5fcXPsIV5ZVQGi2cD/Christmas-Tree-Design.

## Features

- Interactive Christmas tree with clickable ornaments
- Save messages/compliments on ornaments
- Persistent storage via backend API
- Beautiful animations and snow effects

## Running the code

### Prerequisites

- Node.js 20+ installed
- npm installed

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Start both backend and frontend (EASIEST):**
   ```bash
   npm start
   ```
   This automatically starts:
   - Backend on `http://localhost:3001`
   - Frontend on `http://localhost:3000`

3. **Open your browser:**
   Go to `http://localhost:3000`

**Alternative:** Run separately:
- Backend: `npm run dev:backend`
- Frontend: `npm run dev:frontend`

### Environment Variables

Create a `.env` file in the root directory for local development:

```
VITE_API_URL=http://localhost:3001/api
```


## Project Structure

```
├── src/              # Frontend React application
├── server/           # Backend Express API
├── .github/          # GitHub Actions workflows
└── README.md         # This file
```
