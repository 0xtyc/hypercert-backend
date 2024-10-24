# hypercert-backend

## Overview
The `hypercert-backend` is a Node.js backend service designed to manage and process transactions on [Taiwan HyperAwesome Guidebook](https://hypercerts.guide/). It utilizes Express for routing, drizzle for database interactions, and Moralis for blockchain event handling. This backend provides a robust API for retrieving transactions, and user data.

## Features
- **RESTful API**: Endpoints for retrieving transactions, and user information.
- **Blockchain Integration**: Utilizes Moralis to fetch and handle blockchain events.
- **Database Management**: Uses SQLite with Drizzle ORM for efficient data handling.
- **Webhook Support**: Handles incoming webhook requests from Moralis for real-time transaction updates.
- **TypeScript Support**: Built with TypeScript for type safety and improved developer experience.

## Smart Contract Repository
For the smart contract related to this project, please refer to the [transaction-logger](https://github.com/0xtyc/transaction-logger) repository.

## Database Schema
The application uses a SQLite database with a `users` table defined as follows:
- `id`: Primary key, auto-incremented integer.
- `address`: Unique wallet address of the user.
- `name`: Name of the user.
