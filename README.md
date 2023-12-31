# notes-api
README - Node.js Express Notes App
1) Node.js and Express Framework
I chose to use Node.js and Express for this project for several reasons:
JavaScript Ecosystem: Node.js allows us to use JavaScript for server-side development to have a unified codebase with JavaScript on both the front and back end.
Asynchronous and Non-Blocking: Node.js is built on a non-blocking, event-driven architecture, making it suitable for handling concurrent connections and high-traffic scenarios.
Express Framework: Express is a minimalist and flexible framework that simplifies the process of building APIs. It provides robust features to handle routing, middleware, and HTTP utilities.
2) MongoDB Database Setup
I chose MongoDB for this project's database for its flexibility and ease of use, especially with Node.js and Express.
The database connection is set up in db.js, where Mongoose is used as an Object Data Modeling (ODM) library to interact with MongoDB. We connect to the MongoDB instance using the provided MONGO_URI environment variable.

3) Authentication Mechanism
For the authentication mechanism, I implemented JSON Web Tokens (JWT). When a user signs up, or logs in, the server generates a JWT token containing the user's ID, which is signed with a secret key defined in the environment variable JWT_SECRET.
The authenticate middleware in middleware/authUser.js validates the JWT token for protected routes. If the token is valid, the user ID is extracted from it and attached to the request object for further processing in the route handlers.

4) Rate Limiting and Request Throttling
To handle high traffic and prevent abuse, I implemented rate limiting using the express-rate-limit middleware. The rateLimit middleware in middleware/rateLimit.js is applied to all routes, limiting the number of requests from a specific IP address to 100 requests every 15 minutes.

5) Text Indexing and Search Functionality
For keyword-based searching, I used MongoDB's text indexing feature. In the Note model (models/note.js), I defined a text index on the title and content fields using noteSchema.index({ title: 'text', content: 'text' }).
The search functionality is implemented in the GET /API/search endpoint in routes/search.js. It searches for notes based on keywords provided as a query parameter and returns the search results sorted by relevance.

6)How to Run the Code and Tests:

    a)clone this repo

    b)Install the required dependencies: npm install

    c)edit the .env file with your data

    d)Start the server: npm start

    e)To run the tests: npm test

    f)Setup Files and Scripts:
        .env: Contains environment variables such as MONGO_URI, JWT_SECRET, and NODE_ENV.

        app.js: The main application file where the Express app is set up, middleware is applied, and routes are defined.

        db.js: Handles the connection to MongoDB using Mongoose.

        middleware/authUser.js: Contains the authenticate middleware to validate JWT tokens.

        middleware/rateLimit.js: Defines the rate-limiting middleware to handle high traffic.

        models/user.js: Defines the user schema using Mongoose.

        models/note.js: Defines the note schema with text indexing for search functionality.

        routes/auth.js: Contains the authentication endpoints for signup and login.

        routes/notes.js: Contains the endpoints for CRUD operations on notes and sharing notes with other users.

        routes/search.js: Contains the endpoint for keyword-based searching.

        test/test_auth.js: Test suite for authentication endpoints.

        test/test_notes.js: Test suite for note-related endpoints and search functionality.
        

Make sure to update the relevant parts of the code (e.g., the JWT secret, MongoDB URI) to suit your specific environment. With these setup files and scripts, you should be able to run the Node.js Express Notes App and execute the test cases.