# Contacts API

A RESTful API for managing contact records, built with [NestJS](https://nestjs.com) and [PostgreSQL](https://www.postgresql.org/). This project demonstrates best practices in API design, including the use of Swagger for documentation, TypeORM for database management, and adherence to SOLID principles.

## Features

- Create, retrieve, update, and delete contact records.
- Search contacts by email or phone number.
- Retrieve all contacts from a specific state or city.
- Swagger documentation available for all endpoints.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (TypeORM integration)
- **Documentation**: Swagger
- **Testing**: Jest (planned)
- **Deployment**: Render (free tier)

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- PostgreSQL (local or cloud)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/santitesta/contacts-api.git
   cd contacts-api
   ```

2. Install dependencies: `npm install`

3. Configure environment variables: Create a .env file in the root directory based on .env.template. Set the database connection parameters.

4. Running the application for development: `npm run start:dev`. Access the API at http://localhost:3000. Swagger documentation is available at http://localhost:3000/api.

## Linting and Formatting

This project uses a basic linting configuration to ensure code quality and consistency.

- Run Linting: Use npm run lint to check the entire repository for linting issues.
- Pre-commit Automation: Husky may be added to manage pre-commit rules, such as automatically running linting or enforcing ticket format standards.

## Validation

This project uses Data Transfer Objects (DTOs) to handle input validation and entities to define the database structure. DTOs ensure the API validates incoming data (e.g., format, required fields) and remain decoupled from the database layer. This separation of concerns improves flexibility, allowing the API and database schema to evolve independently.

Why Separate DTOs and Entities?
Entities: Define how data is stored in the database.
DTOs: Handle input validation and data flow between the client and the application.
This approach ensures maintainable and scalable code, even at the cost of slight duplication between DTOs and entities.
