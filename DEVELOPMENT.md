# TaskManagement_A

Task Management System for Team A - NSC

## Requirements

- Node / npm
- Docker

## Development Setup

1. Clone the repo
2. Run `npm run install:all` in the root to install dependencies
3. Run `npm run docker:up` to build and start frontend/backend/db containers
4. Access the frontend at `http://localhost:5173`

## Tips

- When reviewing PRs or checking out branches, ensure you run `npm run docker:down` first to clear any state you have and to force each container to reinstall all npm packages.
- Whenever you make changes to any keycloak realm/client/user configuration and want it to persist - run `npm run keycloak-save-config` to export out the changes into `keycloak-config` to be used on `npm run docker:up`.

## Test accounts

| Username      | Password |
| ------------- | -------- |
| testadmin     | admin    |
| testdeveloper | admin    |
| testclinician | admin    |

## Routing

The backend is accessible via a proxied route `/api`. All Express routes setup on the backend must be prefixed with `/api` as well.

### Backend API (Swagger UI):

`http://localhost:5050/docs/`

### Keycloak Admin Console：

`http://localhost:8080/`

Default admin credentials:

- Username: admin
- Password: admin

## Database

### PostgreSQL (Docker)

- Enter the database (psql inside container):`docker exec -it taskmanagement_groupa-postgres-1 psql -U user -d backend_db`
- Show all tables:`\dt`
- Describe a table: `\d "<table-name>"`
- Show structure for ALL tables: `\d public.*`
- Exit psql: `\q`
- Exit container shell: `exit`
