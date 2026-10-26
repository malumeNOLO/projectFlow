# ProFlow — Project Management App

ProjectFlow is a web-based project management application designed to help teams organize work, manage projects, track tasks, and collaborate more effectively. It provides a centralized workspace where users can manage projects, assign tasks, monitor progress, and keep track of deadlines.

## Features

- **Workspace Management** — Create and manage workspaces for organizing team projects.
- **Project Management** — Create projects, manage project details, set statuses, and define start and due dates.
- **Task Management** — Create tasks within projects, assign team members, and track task progress.
- **Task Priorities** — Organize tasks by priority: Low, Medium, and High.
- **Task Status Tracking** — Track tasks through To Do, In Progress, and Done.
- **Team Collaboration** — Manage workspace and project members with role-based access.
- **Progress Tracking** — Monitor project progress based on task completion.
- **Authentication** — Secure API routes using authentication middleware.
- **Data Validation** — Validate incoming API requests before processing them.

## Tech Stack

### Frontend
- React
- TypeScript
- React Router
- TanStack React Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn-style UI components

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Zod request validation
- Nodemon for development

## Project Structure

```text
projectFlow/
├── backend/
│   ├── controllers/
│   ├── libs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── package.json
│
└── README.md
```

*Note: The structure above represents the main folders used by the project. Your actual folder structure may vary.*

## Getting Started

Follow these instructions to run ProjectFlow locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) or access to a MongoDB database

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd projectFlow
```

Replace `<your-repository-url>` with your actual repository URL.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory and configure the environment variables required by your backend.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use the actual environment variable names expected by your application. Other services or variables may also be required.

**Security:** Never commit your `.env` file or expose database credentials, JWT secrets, or API keys in a public repository.

### 4. Start the Backend

From the `backend` directory, run:

```bash
npm run dev
```

If your `package.json` does not define a `dev` script, use the script configured in that file. For example, if Nodemon is installed:

```bash
npx nodemon index.js
```

The backend API is configured to use:

```text
http://localhost:5000/api-v1
```

### 5. Install Frontend Dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

Run the development command configured in the frontend's `package.json`. For a Vite-based frontend, this is commonly:

```bash
npm run dev
```

Open the local URL printed in your terminal to access the application.

## Task Workflow

Tasks can be organized using the following statuses:

| Status | Description |
|---|---|
| To Do | The task has not been started. |
| In Progress | Work on the task is underway. |
| Done | The task has been completed. |

Tasks can also be categorized by priority:

| Priority | Description |
|---|---|
| Low | Work with lower urgency. |
| Medium | Work with normal urgency. |
| High | Work requiring greater attention. |

## API Overview

The backend exposes REST API endpoints under the `/api-v1` prefix.

The following are examples of route patterns used by the application; confirm the exact paths in your route files.

| Method | Example endpoint | Purpose |
|---|---|---|
| GET | `/api-v1/workspaces` | Retrieve workspaces |
| POST | `/api-v1/workspaces` | Create a workspace |
| GET | `/api-v1/workspaces/:workspaceId/projects` | Retrieve workspace projects |
| POST | `/api-v1/workspaces/:workspaceId/create-project` | Create a project |
| POST | `/api-v1/projects/:projectId/create-task` | Create a task |

Protected endpoints require valid authentication where configured.

## Development Notes

- Keep frontend API requests consistent with the backend route definitions.
- Ensure the backend environment variables are configured before starting the server.
- Use the correct MongoDB model references when populating related documents.
- Invalidate or refetch relevant React Query queries after creating or updating workspaces, projects, or tasks.
- Validate request data on the backend rather than relying exclusively on frontend validation.
- Never commit secrets or production credentials.

## Future Improvements

Potential improvements for ProjectFlow include:

- Dashboard analytics and task statistics
- Task comments and activity history
- Notifications and reminders
- Advanced task filtering and searching
- File attachments
- Calendar and deadline views
- Improved mobile responsiveness
- Automated tests and continuous integration

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application.
5. Submit a pull request describing your changes.

## License

No license has been specified yet. Add a license before distributing the project publicly.
