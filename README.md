# EcoShop API 🌿

**EcoShop API** is an open-source e-commerce solution focused on promoting sustainability and eco-friendly products. This API serves as the backend of the EcoShop platform, providing functionalities for user management, product listings, and order processing.

## Features

-   **User Management**:
    -   User registration and authentication.
    -   User roles (admin, customer).
-   **Product Management**:

    -   CRUD operations for products.
    -   Category and tag management.

-   **Order Processing**:
    -   Shopping cart functionality.
    -   Order creation and tracking.
    -   Payment gateway integration.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **Authentication**: JWT (JSON Web Tokens)
-   **Payment Gateway**: Stripe

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js (version 14 or above)
-   MongoDB installed and running
-   A Stripe account for payment processing

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ecoshop-api.git
cd ecoshop-api
```

### 2. Install Dependencies

Install the required Node.js packages:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run the Server

Start the development server:

```bash
npm run dev
```

The API will be running on `http://localhost:5000`.

## API Endpoints

### Authentication

-   **POST** `/api/auth/register` - Register a new user
-   **POST** `/api/auth/login` - Login a user

### Products

-   **GET** `/api/products` - Get all products
-   **POST** `/api/products` - Create a new product (Admin only)
-   **PUT** `/api/products/:id` - Update a product (Admin only)
-   **DELETE** `/api/products/:id` - Delete a product (Admin only)

### Orders

-   **GET** `/api/orders` - Get all orders (Admin only)
-   **POST** `/api/orders` - Create a new order
-   **GET** `/api/orders/:id` - Get order by ID

## Contributing

Contributions are welcome! Please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to reach out:

-   **Email**: chaudharypradip678@gmail.com
-   **LinkedIn**: [Pradip Chaudhary](https://linkedin.com/in/pradipchaudhary)
-   **GitHub**: [pradipchaudhary](https://github.com/pradipchaudhary)

---

_EcoShop API - Empowering sustainable e-commerce_ 🌍
