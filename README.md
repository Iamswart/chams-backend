# Airtime and Data API 

## Overview

The Airtime and Data API provides a comprehensive solution for managing the purchase and distribution of airtime and data plans. This backend service, built with Node.js and Express, facilitates user authentication, profile management, cart operations, and payment processing. The API is designed to integrate seamlessly with front-end applications, enabling users to buy airtime and data, manage their carts, and complete transactions efficiently. It utilizes MongoDB for data storage, ensuring scalable and reliable management of user and transaction data.

## Features

- RESTful API endpoints for airtime and data purchase
- JWT-based and session based authentication

## Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for authentication
- Other dependencies as listed in `package.json`

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version 14 or newer)
- MongoDB (local or cloud-based with MongoDB Atlas)
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Iamswart/chams-backend.git
   cd chams-backend

   ```

2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Set up environment variables**

   Create a .env file in the root directory of the project and add the following variables:

   ```bash
    NODE_ENV - Specifies the environment in which an application is running
    PORT - The port number on which the server listens.
    MONGO_URI - Connection string for MongoDB database.
    JWT_SECRET - Secret key used to sign JWT tokens for authentication.
    JWT_EXPIRATION - Expiration time for the JWT tokens.
    API_KEY - A general API key for accessing third-party services.
    SEERBIT_BASE_URL - SEERBIT API BASE URL.
    SEERBIT_USERNAME - SEERBIT API Username
    SEERBIT_PASSWORD - SEERBIT API Password
    MTN_TEST_NUMBER - MTN Test Number
    AIRTEL_TEST_NUMBER - Airtel Test Number
    GLO_TEST_NUMBER - Glo Test Number
    NINEMOBILE_TEST_NUMBER - 9Mobile Test Number
    AIRTIME_ENDPOINT - Endpoint for airtime topup information
    DATA_ENDPOINT - Endpoint for data topup information
    FRONTEND_URL - Frontend URL
    

  Replace the placeholders with your actual data.

4. **Running the Application**

   ```bash
   npm run local

   The API will be available at http://localhost:3000 .
   ```
