# Customer Location Pinning System - Backend

This is the backend API for the Customer Location Pinning System, built with NestJS and MongoDB.

## Prerequisites

*   [Node.js](https://nodejs.org/) and npm installed
*   MongoDB Atlas account and cluster set up

## Setup Instructions

1.  **Navigate to the backend directory:**

    ```bash
    cd customer-location-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    *   Create a `.env` file in the root of the `customer-location-backend` directory.
    *   Add your MongoDB Atlas connection string and the port number:

    ```
    MONGODB_URI=YOUR_MONGODB_ATLAS_URI
    PORT=3000
    ```

## Running the Project

1.  **Start the development server:**

    ```bash
    npm run start:dev
    ```

    This will start the NestJS development server, and the API will be accessible at `http://localhost:3000` (or the port specified in the `.env` file).

## Platform Specific Instructions:

These instructions assume you have [Node.js](https://nodejs.org/) and npm installed for all platforms. If not, please download and install them.

*   **Windows:**
    *   Open Command Prompt or PowerShell.
    *   Run the commands as described above.

*   **Linux:**
    *   Open a terminal.
    *   Run the commands as described above.

*   **MacOS:**
    *   Open a terminal.
    *   Run the commands as described above.

Replace `YOUR_MONGODB_ATLAS_URI` with your actual MongoDB Atlas connection string.