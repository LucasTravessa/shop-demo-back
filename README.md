<h1>My Shop Demo Back End</h1>

## Table of Contents

- [Features and Benefits](#features-and-benefits)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Docker Setup](#docker-setup)

---

## Features and Benefits

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Authentication and Authorization**: Complete user authentication solution and Role-based Access Control (RBAC) 🎉.
- **Prisma**: An open-source database toolkit that simplifies database access and management.
- **PostgreSQL**: A powerful, open-source relational database system.
- **TypeScript Support**: Strongly typed code for better maintainability and scalability.
- **Zod Validation**: Validation across all requests and responses lifecycle using zod schemas.
- **Docker**: Containerization abstract the setup tools on any local machine and help in deployment.
- **Modular Architecture**: Organized code structure for better separation of concerns.

---

## Getting Started

This guide will walk you through how to set up, configure, and run the NestJS app on your local machine OR skip this and go to Docker Setup to avoid installing tools.

### Prerequisites

Make sure you have the following installed:

- Node.js (version 20.11.0 or higher)
- npm & pnpm
- PostgreSQL (installed and running)

---

## Installation

To get started, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/LucasTravessa/shop-demo-back.git
   ```
2. Navigate to the project directory:

   ```bash
   cd shop-demo-back
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up Environment Variables:

   - Create a `.env` file in the root directory.
   - Copy the contents of `.env.example` into `.env` and configure any necessary environment variables and make sure to read notes written inside the `.env` file. For Local, make sure `DATABASE_URL` is set to use the `HOST` as `localhost`.

5. Make a database migration using the script defined in the `package.json` file by running:
   ```bash
   pnpm db:migrate
   ```
6. Run the seed command to seed the database by some data defined in `prisma/seed/data`:

   ```bash
   pnpm db:seed
   ```

7. Run the application:
   ```bash
   pnpm start:dev
   ```

---

## Usage

After running the application, you can access the Swagger API documentation at `http://localhost:3000/doc`. You can modify the code to fit your project requirements.

---

### Docker Setup

To run the project using Docker, make sure Docker is installed and running on your machine. Follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/LucasTravessa/shop-demo-back.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd shop-demo-back
   ```

3. **Set up Environment Variables**:

   - Create a `.env` file in the root directory.
   - Copy the contents of `.env.example` into `.env` and configure any necessary environment variables. For Docker, make sure `DATABASE_URL` is set to use the `HOST` as `postgres` (the name of the database service in the `docker-compose.yml` file).

4. **Run the Project with Docker Compose**:

   ```bash
   docker-compose up -d
   ```

   This command will build and run the application and a PostgreSQL container, as defined in the `docker-compose.yml` file.

5. **Apply Database Migrations**:
   Once the containers are running, apply database migrations using the following command:

   ```bash
   docker-compose exec app pnpm prisma migrate deploy
   ```

   Replace `app` with the name of the service in your `docker-compose.yml` file if it’s different.

6. **Access the Application**:
   The application should be available at `http://localhost:3000/doc` on your local machine.

---

> This Project is based on [nestjs starter kit](https://github.com/mr-meselmani/nestjs-starter-kit.git)
