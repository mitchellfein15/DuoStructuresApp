# DuoStructuresApp

A gamified learning platform for mastering Data Structures and Algorithms, inspired by Duolingo. Working on this as a passion project and I'm sure it's terribly sloppy.

## Features

- Interactive lessons on Data Structures and Algorithms
- Practice exercises with immediate feedback
- User authentication and profile management
- Hopefully much more to come

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth.js
- SQLite (for development)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```
   
   Then edit the `.env` file and set the following variables:
   - `NEXTAUTH_URL`: The URL of your application (use `http://localhost:3000` for local development)
   - `NEXTAUTH_SECRET`: A secure random string for session encryption
     - You can generate one using: `openssl rand -base64 32`
   - `DATABASE_URL`: The path to your SQLite database file (default: `file:./dev.db`)

4. Initialize the database:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Create and apply database migrations
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The application requires the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | URL of your application | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key for session encryption | Generated string |
| `DATABASE_URL` | Database connection string | `file:./dev.db` |

### Generating NEXTAUTH_SECRET

You can generate a secure NEXTAUTH_SECRET using one of these methods:

```bash
# Using openssl
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Project Structure

- `src/app` - Next.js app router pages and API routes
- `src/components` - Reusable React components
- `src/lib` - Utility functions and configurations
- `prisma` - Database schema and migrations

## License

This project is licensed under the MIT License. 