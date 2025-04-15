# Admin Dashboard - Medicine Store Management System

## Overview
A comprehensive admin dashboard for managing a medicine store, built with React and Redux. This application provides a complete solution for managing customers, orders, products, and suppliers in a medical store environment.

## Features
- **Authentication System**
  - Secure login/logout functionality
  - Protected routes
  - Token-based authentication

- **Dashboard Overview**
  - Statistics visualization
  - Recent customers overview
  - Income/expenses tracking
  - Customer spending analytics

- **Customer Management**
  - Add/Edit/Delete customers
  - Customer information tracking
  - Search and filter functionality
  - Pagination

- **Order Management**
  - Create and manage orders
  - Order status tracking
  - Order history
  - Filter by customer name

- **Product Management**
  - Inventory tracking
  - Add/Edit/Delete products
  - Product categorization
  - Stock management

- **Supplier Management**
  - Supplier information management
  - Delivery tracking
  - Active/Inactive status tracking
  - Order amount tracking

## Technology Stack
- React 18
- Redux Toolkit
- React Router DOM
- Axios
- Yup (form validation)
- React Hook Form
- SCSS Modules
- Vite

## Installation

1. Clone the repository:
```bash
git clone [repository-url]

2. Install dependencies:
```bash
npm install
 ```
 3. Start the development server:
```bash
npm run dev
 ```

 ## Responsive Design
- Mobile: 375px
- Tablet: 768px
- Laptop: 1024px
- Desktop: 1440px

## API Integration
The application integrates with a backend API with the following endpoints:

- Authentication: /api/auth
- Customers: /api/customers
- Orders: /api/orders
- Products: /api/products
- Suppliers: /api/suppliers
- Dashboard: /api/dashboard