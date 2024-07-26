## TGT ToolDB Fullstack Application

**Development and Production Environment Setup**

This project has two configurations: **DEV** for development and **MAIN** for production. Here's a step-by-step guide for using the DEV environment:

**1. Feature Development Workflow**

   * **Clone the repository**: `git clone <repository_url>`
   * **Switch to the `dev` branch**: `git checkout dev`
   * **Obtain the `.env.dev` file**: Download the `.env.dev` file from @stepantishhen and place it in the project root.
   * **Start the project using Docker Compose**: `sudo docker compose -f docker-compose.dev.yml up` 
   * **Populate the database with test data**: 
      * Load unit system data: `sudo docker compose -f docker-compose.dev.yml exec web poetry run python manage.py add_unit_system_data` 
      * Load base data: `sudo docker compose -f docker-compose.dev.yml exec web poetry run python manage.py add_base_data` 
      * **Important:** Ensure the order of these commands is followed!

**2. Feature Branching**

   * **Create a separate feature branch**: Use the format `TGT-number-feature` (where `number` is the task ID from Yougile).
   * **Make changes and commit**: Perform your development tasks, commit your changes, and push to the feature branch.
   * **Open a merge request**: Once you've made your changes, open a merge request to the `dev` branch.
   * **Deployment**: After the pull request is accepted, it will be merged into the `main` branch, which then gets deployed to production.

**Backend Endpoint Changes**

The backend API now uses a `/api` prefix. This means:

* **Backend root**: `http://localhost/api/`
* **GraphQL endpoint**: `http://localhost:8000/api/graphql`

**Useful Commands**

**1. Project Management**

   * **Build and start the project (in the background)**: `sudo docker compose -f up -d --build`
   * **Start the project (in the background)**: `sudo docker compose -f docker-compose.dev.yml up -d`
   * **Start the project in the foreground**: `sudo docker compose -f docker-compose.dev.yml up`
   * **Stop the project**: `sudo docker compose -f docker-compose.dev.yml stop`

**2. Test Data Management**

   * **Load base test data (groups, users, module groups, types, modules, parameters, sensors)**: `sudo docker compose exec web poetry run python manage.py add_unit_system_data`
   * **Load test data for units of measurement (ResourceString, Unit, UnitSystem, Measure, ConversionFactor etc.)**: `sudo docker compose exec web poetry run python manage.py add_unit_base_data`
   * **Delete ALL test data**: `sudo docker compose exec web poetry run python manage.py flush`

**Before Committing**

* **Format code**: `black .`
* **Lint code**: `flake8 .`

**Troubleshooting**

* **If the PostgreSQL port (5432) is already in use:**
   * **Find the process using the port**: `sudo lsof -i :5432`
   * **Stop the process**: `sudo kill <PID>`
   * **If that doesn't work, restart the PostgreSQL service**: `sudo service postgresql restart`

**Adding Dependencies**

* **Use Poetry to add dependencies**: `poetry add <python_package>`