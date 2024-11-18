# Fitness App

A comprehensive fitness application with both frontend and backend components.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Postman (for API testing)

### Installation

#### Backend Setup

1. Navigate to the backend directory
```bash
cd fitness-app/backend
```
2. Install dependencies


```shellscript
 npm install

```

3. Create a .env file in the backend directory and add your MongoDB connection string:


```shellscript
 MONGODB_URI=your_mongodb_connection_string
```

4. Start the backend server


```shellscript
 npm start

```

The backend server will start on port 3001.

Note: Two files have already been created in the backend folder. Please follow the instructions in those files for any additional setup or configuration.

#### Frontend Setup

1. Navigate to the frontend directory


```shellscript
 cd ../frontend

```

2. Install dependencies


```shellscript
 npm install

```

3. Start the frontend development server


```shellscript
 npm start

```

The frontend application will start on port 3000.

Note: Two files have already been created in the frontend folder. Please follow the instructions in those files for any additional setup or configuration.

## Creating Admin User

To create an admin user through Postman, follow these steps:

1. Open Postman
2. Create a new POST request
3. Enter the URL: `http://localhost:3001/api/user/create-user`
4. Set the request headers:

1. Content-Type: application/json



5. Set the request body to raw JSON with the following payload:


```json
 {
    "email": "softwareproject476@gmail.com", //Enter your email, when you login you will need otp that send to your email
    "password": "Test@123",
    "userType": "admin"
}

```

## Built With

- Node.js - Backend runtime
- Express - Web framework
- MongoDB - Database
- React - Frontend framework

6. Send the request