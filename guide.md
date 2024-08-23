To create a fully functional REST API for the EcoShop project, I'll provide a detailed implementation that includes the necessary features such as user registration, login, product management, and order processing.

Here’s the complete implementation:

### 1. **Project Structure**

```plaintext
ecoshop-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── productController.js
│   ├── userController.js
│   └── orderController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Product.js
│   ├── User.js
│   └── Order.js
│
├── routes/
│   ├── productRoutes.js
│   ├── userRoutes.js
│   └── orderRoutes.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

### 2. **`config/db.js`**

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
```

### 3. **`controllers/productController.js`**

```javascript
import Product from "../models/Product.js";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new product
export const createProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        stock,
        sustainabilityScore,
        imageURL,
    } = req.body;

    const newProduct = new Product({
        name,
        description,
        price,
        category,
        stock,
        sustainabilityScore,
        imageURL,
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

### 4. **`controllers/userController.js`**

```javascript
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            userId: savedUser._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

### 5. **`controllers/orderController.js`**

```javascript
import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
    const { products, totalPrice } = req.body;

    try {
        const newOrder = new Order({
            userId: req.user.id,
            products,
            totalPrice,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "username email")
            .populate("products.productId", "name price");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "username email")
            .populate("products.productId", "name price");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin only)
export const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
```

### 6. **`middleware/authMiddleware.js`**

```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            return res
                .status(401)
                .json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};
```

### 7. **`models/Product.js`**

```javascript
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        sustainabilityScore: {
            type: Number,
            required: true,
        },
        imageURL: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
```

### 8. **`models/User.js`**

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
```

### 9. **`models/Order.js`**

```javascript
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
```

### 10. **`routes/productRoutes.js`**

```javascript
import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import {
    authMiddleware,
    adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
```

### 11. **`routes/userRoutes.js`**

```javascript
import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);

export default router;
```

### 12. **`routes/orderRoutes.js`**

```javascript
import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
} from "../controllers/orderController.js";
import {
    authMiddleware,
    adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id", authMiddleware, adminMiddleware, updateOrder);

export default router;
```

### 13. **`index.js`**

```javascript
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
connectDB();

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### 14. **`.env`**

```bash
MONGO_URI=mongodb://localhost:27017/ecoshop
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 15. **`.gitignore`**

```bash
node_modules/
.env
```

### 16. **`README.md`**

````markdown
# EcoShop API

An open-source e-commerce solution focused on sustainability and eco-friendly products.

## Features

-   User Registration and Login
-   Product Management
-   Order Processing

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/ecoshop-api.git
    cd ecoshop-api
    ```
````

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your MongoDB URI and JWT secret:

    ```plaintext
    MONGO_URI=mongodb://localhost:27017/ecoshop
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

-   **Products**

    -   `GET /api/products`
    -   `GET /api/products/:id`
    -   `POST /api/products` (Admin only)
    -   `PUT /api/products/:id` (Admin only)
    -   `DELETE /api/products/:id` (Admin only)

-   **Users**

    -   `POST /api/users/register`
    -   `POST /api/users/login`
    -   `GET /api/users/profile` (Authenticated only)

-   **Orders**
    -   `POST /api/orders` (Authenticated only)
    -   `GET /api/orders` (Admin only)
    -   `GET /api/orders/:id` (Authenticated only)
    -   `PUT /api/orders/:id` (Admin only)

````

### 17. **Run the Server**

Start your server:

```bash
npm start
````

This setup provides a functional REST API for your EcoShop project with user management, product management, and order processing. You can now test and deploy your API, and modify it as needed to fit your specific requirements.
