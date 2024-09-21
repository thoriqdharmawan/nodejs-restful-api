# NodeJS Restful API

This is a RESTful API built with Node.js and Express that demonstrates user and contact management.

## Key Features

- User registration, login, and logout
- Contact creation, retrieval, update, deletion, and search
- Address association with contacts
- Authentication middleware for protected routes

## Technologies Used


- Node.js
- Express
- Prisma
- Jest (for testing)
- Winston (for logging)
- bcrypt (for password hashing)
- uuid (for generating unique identifiers)
- Joi (for data validation )

**Backend:**

* **Node.js:** JavaScript runtime environment for building server-side applications.
* **Express:** Web framework for Node.js that simplifies building APIs.
* **Prisma:** ORM (Object-Relational Mapper) that makes interacting with databases smoother ✨.
* **Bcrypt:** Securely hashes passwords for user authentication.
* **uuid:** Generates unique identifiers for users, contacts, and addresses 🪄.
* **Joi:** Validates user input to ensure data quality ⚖️.

**Testing:**

* **Jest:** Testing framework for Node.js applications.

**Logging:**

* **Winston:** Powerful logging library for capturing and recording application activity 🪵.

## Key Takeaways:

* Node.js and Express handle the API server and routing.
* Prisma simplifies database interactions.
* Bcrypt, uuid, and Joi ensure secure and accurate data handling.
* Jest helps maintain code quality through automated testing.
* Winston facilitates monitoring and debugging.



## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/thoriqdharmawan/belajar-nodejs-restful-api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set the following environment variable:

   ```
   DATABASE_URL="your_prisma_database_url"
   ```

4. Run the development server:

   ```bash
   node src/main.js
   ```

## API Endpoints

### Public Endpoints

- **POST /api/users** : Register a new user
- **POST /api/users/login** : Login a user

### Protected Endpoints (requires authentication)

- **GET /api/users/current** : Get the current user's information
- **PATCH /api/users/current** : Update the current user's information
- **DELETE /api/users/logout** : Logout the current user
- **POST /api/contacts** : Create a new contact
- **GET /api/contacts/:contactId** : Get a specific contact
- **PUT /api/contacts/:contactId** : Update a contact
- **DELETE /api/contacts/:contactId** : Delete a contact
- **GET /api/contacts** : Search for contacts
- **POST /api/contacts/:contactId/addresses** : Create an address for a contact
- **GET /api/contacts/:contactId/addresses/:addressId** : Get a specific address
- **PUT /api/contacts/:contactId/addresses/:addressId** : Update an address
- **DELETE /api/contacts/:contactId/addresses/:addressId** : Delete an address
- **GET /api/contacts/:contactId/addresses** : List all addresses for a contact

## Testing

To run tests:

```bash
npm test
```

## Contributing ✌️

Pull requests are welcome!
