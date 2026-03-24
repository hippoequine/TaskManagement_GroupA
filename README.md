# Jiro

![Jiro](https://github.com/mbokros1/TaskManagement_GroupA/blob/main/Screenshots/SiteMap.png)

### CSB430 - Software Design & Implementation

#### Riipen Project - UnVRap

#### Stakeholder - Navun Razdan

#### North Seattle College (Winter 2026)

## Table of Contents

1. [Project Overview](#project-overview)
2. [How to Use](#how-to-use)
3. [Testing Instructions](#testing-instructions)
4. [CI/CD Instructions](#cicd-instructions)
5. [Contributing](#contributing)

## Project Overview

Developed a collaborative Task Management prototype for UnVRap, a B2B VR SaaS company specializing in phobia treatment.

The system will streamline coordination between UnVRap’s VR, Clinician, and Admin teams by allowing users to create projects, assign issues, set deadlines, leave comments, track progress, and share resources in a user-friendly interface.

The prototype will include both frontend and backend components, authentication and authorization, and role-based views for different user types, aiming to improve team efficiency and communication through a centralized, accessible tool.

### Identity and Access Management

We use **Keycloak** to manage our authentication, authorization, and role-based access for a secure user management.

- **Admin Role** - Dedicated Admin dashboard with full access with user and system management.
- **VR Developer Role** - Access to Developer dashboard, issue, project, board, and comments.
- **Clinician Role** - Access to Clinician dashboard, create project, and comments.

### API Architecture

We implemented OpenAPI (Swagger) specification for seamless coordination between the frontend and backend.

![Project Routes](https://github.com/mbokros1/TaskManagement_GroupA/blob/main/Screenshots/Routes.png)

## How to Use

### 1. Prerequisites

Make sure you have the following installed:

- **Node.js**: Version **20.20.0** or higher.
  - This project use Node.js to run the local development server and manage dependencies. You can download from [Node.js](https://nodejs.org/en).
  - Verify: `node -v`

- **Node Package Manager (npm)**: Version **11.6.2** or higher (comes bundled with Node.js).
  - This project use npm to manage the libraries for the project, this comes pre-bundled with Node.js.
  - Verify: `npm -v`

- **Docker Desktop**
  - This project uses docker to containerize the database and backend services. You can download from [Docker](https://www.docker.com/products/docker-desktop/).
  - Verify: `docker --version`

- **Visual Studio Code**
  - You can use any editor, VS Code is recommended for this project. You can download from [VSC](https://code.visualstudio.com/).

### 2. Clone the Repository

In the folder you want to save your project in, run:

```
git clone https://github.com/mbokros1/TaskManagement_GroupA.git
```

### 3. Install Dependencies

In the root folder, run:

```
npm run install:all
```

### 4. Run Docker Desktop

In the root folder, run:

```
npm run docker:up
```

**Note:** You might need to rebuild Docker if you add or remove dependencies, environment variables, items in Dockerfile, and items in the docker-compose.yml

```
docker-compose up --build
```

### 5. Access the Project

Access the front end at `http://localhost:3000`

Access backend at `http://localhost:5050`

Access keycloak at `http://localhost:8080`

## Testing Instructions

This project use Vitest for unit test. To test all, in the root folder, run:

```
npm test
```

OR

```
npx vitest
```

_To test backend and frontend seperately, navigate to the folder (backend/frontend) then run the same commands above._

## CI/CD Instructions

This project uses GitHub Actions for CI/CD to automate testing and checks code quality. The workflow configuration is located at `.github/workflows/ci.yml`.

You can view the status of the workflow by:

1. Login to GitHub
2. Navigate to the Project Repository
3. Click the **Actions** tab

### Lint & Format

This focuses on code style and quality.

- **Prettier** - Automatically checks if code is formatted correctly.
  - If this check fails, go to your terminal and run:
  ```
  npx prettier --write <file-name>
  ```
- **ESLint** - Automatically checks for bugs or bad coding pattern.

### Unit Test

This focuses on verifying the correctness of the app logic.

- **Vitest** - Automatically runs the full Vitest test suite on the project to check the app logic.

## Contributing

**Project Manager:** Mihaly Bokros

### Team Red

**Tech Lead:** Alice Li

**Developers:**

- Jovy Ann Nelson
- Yuria Loo
- Zane Schaffer
- Eric Norman

### Team Rainbow

**Developers:**

- Armando Valenzuela
- Psy Cisneros
