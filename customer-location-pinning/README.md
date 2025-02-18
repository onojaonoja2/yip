# Customer Location Pinning System - Frontend

This is the frontend application for the Customer Location Pinning System, built with React, Vite, and Tailwind CSS.

## Prerequisites

  [Node.js](https://nodejs.org/) and npm installed

## Setup Instructions

1.  Navigate to the frontend directory:

    ```bash
    cd customer-location-pinning
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure environment variables:

    *   Create a `.env` file in the root of the `customer-location-pinning` directory.
    *   Add your Google Maps API key:

    ```
    VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
    ```

## Running the Project

1.  Start the development server:

    ```bash
    npm run dev
    ```

    This will start the Vite development server, and the application will be accessible at `http://localhost:5173` (or the port specified by Vite).

## Build Instructions

1.  Build the application for production:

    ```bash
    npm run build
    ```

    This will create a `dist` directory containing the production-ready build of the application.

## Platform Specific Instructions:

These instructions assume you have [Node.js](https://nodejs.org/) and npm installed for all platforms. If not, please download and install them.

*   Windows:
    *   Open Command Prompt or PowerShell.
    *   Run the commands as described above.

*   **Linux:**
    *   Open a terminal.
    *   Run the commands as described above.

*   **MacOS:**
    *   Open a terminal.
    *   Run the commands as described above.

Replace `YOUR_API_KEY` with your actual Google Maps API key.