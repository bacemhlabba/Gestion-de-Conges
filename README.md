# Gestion de Congés

## Project Setup

To run the project locally, follow these steps:

1. **Install dependencies**: Run `npm install` to install all the necessary dependencies listed in the `package.json` file.
2. **Build the project**: Run `npm run build` to build the project.
3. **Start the development server**: Run `npm run dev` to start the development server. The project will be available at `http://localhost:3000`.

## Database Setup

Ensure that your database is set up and configured correctly. You may need to create a `.env` file with the necessary environment variables for your database connection. The `.gitignore` file indicates that `.env*` files are ignored, so you will need to create this file manually.

## Project Structure

- `package.json`: Contains dependencies and scripts for running the project.
- `next.config.mjs`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `postcss.config.mjs`: PostCSS configuration.
- `tsconfig.json`: TypeScript configuration.
- `.gitignore`: Specifies files and directories to be ignored by Git, including `.env*` files.
- `lib/leave-service.ts`: Contains mock data and functions to simulate a database.
