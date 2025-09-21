# Admin Panel Setup Guide

This guide explains how to set up and use the admin panel for the Nirvi e-commerce application.

## Features

The admin panel provides comprehensive management capabilities:

### 1. User Management
- View all registered users
- Change user roles (user ↔ admin)
- Monitor user registration dates
- User search and filtering

### 2. Order Management
- View all orders with customer details
- Update order status (pending, processing, shipped, delivered, cancelled)
- View order items and quantities
- Access shipping addresses
- Monitor order history and totals

### 3. Product Management
- View all products (active and inactive)
- Add new products with categories
- Edit existing products (name, description, price, stock, category)
- Activate/deactivate products
- Delete products (soft delete - sets is_active to 0)
- Category management

## Setup Instructions

### 1. Create an Admin User

First, you need to create an admin user. You can do this by making a POST request to the create-admin endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nirvi@gmail.com",
    "password": "nirvishine",
    "name": "nirvi"
  }'
```

Or use a tool like Postman/Insomnia to make the request.

### 2. Login as Admin

1. Go to your application homepage
2. Click the login button
3. Use the admin credentials you just created
4. After login, you'll see a settings icon (⚙️) in the header - this is the admin panel access

### 3. Access Admin Panel

- **URL**: `http://localhost:3000/admin`
- **Access**: Only users with `role = 'admin'` can access
- **Navigation**: Click the settings icon in the header when logged in as admin

## Admin Panel Structure

```
/admin
├── Users Tab
│   ├── User list with email, name, role, creation date
│   └── Role management (promote/demote users)
├── Orders Tab
│   ├── Order list with customer info and status
│   ├── Order details (items, shipping address)
│   └── Status updates
└── Products Tab
    ├── Product list with categories and stock
    ├── Add new products
    ├── Edit existing products
    └── Product activation/deactivation
```

## API Endpoints

### Admin Users API
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users` - Update user role

### Admin Orders API
- `GET /api/admin/orders` - Get all orders with user info
- `PATCH /api/admin/orders` - Update order status

### Admin Products API
- `GET /api/admin/products` - Get all products and categories
- `POST /api/admin/products` - Create new product
- `PATCH /api/admin/products` - Update product
- `DELETE /api/admin/products` - Delete product (soft delete)

### Admin Utilities
- `POST /api/admin/create-admin` - Create admin user
- `POST /api/admin/seed` - Seed sample data

## Security Features

1. **Route Protection**: Admin routes are protected by middleware
2. **Role Verification**: All admin endpoints verify user role
3. **Session Validation**: Requires valid session token
4. **Access Control**: Non-admin users are redirected to homepage

## Database Schema

The admin functionality uses these key tables:
- `users` - User accounts with role field
- `orders` - Order information
- `order_items` - Order line items
- `products` - Product catalog
- `product_categories` - Product categories
- `shipping_addresses` - Customer addresses

## Troubleshooting

### Can't Access Admin Panel
1. Ensure you're logged in as a user with `role = 'admin'`
2. Check that the user exists in the database
3. Verify the session is valid

### Admin Button Not Showing
- The admin button (⚙️) only appears for users with admin role
- Make sure you're logged in and the user role is set correctly

### API Errors
- Check browser console for detailed error messages
- Verify the user has admin privileges
- Ensure the session token is valid

## Development Notes

- Admin components are located in `src/components/admin/`
- Admin API routes are in `src/app/api/admin/`
- Admin utilities are in `src/lib/admin.ts`
- Middleware protection is in `src/middleware.ts`

## Sample Data

To populate your database with sample data for testing:

```bash
curl -X POST http://localhost:3000/api/admin/seed
```

This will create sample categories and products for testing the admin panel.
