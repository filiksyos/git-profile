# Git Profile

An AI-powered app that analyzes your coding persona by examining your GitHub profile, repositories, and coding patterns.

## Features

- **List Repositories**: Fetch and display all repositories from any GitHub profile with metadata
- **Index Repositories**: Index selected repositories using Gemini File Search for AI analysis
- **Generate Profile**: Extract 20 personalized phrases describing coding style, preferences, and patterns

## Getting Started

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Enter:
   - GitHub username to analyze
   - Your Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

5. Click "List Repositories" to see all repos, then select repos to index, and finally generate the coding profile!

## Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Gemini AI** for profile generation
- **GitHub API** for repository data

## No Database Required

All analysis is done in real-time without storing any data. Just bring your Gemini API key!

## License

MIT