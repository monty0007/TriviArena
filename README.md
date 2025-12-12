
# 🎮 TriviArena - Multiplayer Quiz Platform

TriviArena is a real-time multiplayer quiz platform where users can create, host, and play quizzes. It features a modern, responsive UI, real-time socket communication for game synchronization, and a robust backend.

## ✨ Features

-   **Create Quizzes**: Intuitive interface to create quizzes with custom questions, images, and time limits.
-   **Multiplayer Action**: Real-time gameplay with friends using Socket.io.
-   **Live Host Control**: Hosts can manage the game flow, seeing live responses and leaderboards.
-   **Diverse Game Modes**:
    -   **Classic**: Standard trivia flow.
    -   **Rapid Fire**: Faster timers for higher intensity.
    -   **True/False**: Quick boolean questions.
-   **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
-   **Themes**: Beautiful, polished UI with "Kahoot-Blue" and "Hyper-Glitch" inspirations.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Tailwind CSS, Vite
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **Real-time Communication**: Socket.io
-   **Authentication**: Firebase Auth

## 🚀 Getting Started

### Prerequisites

-   Node.js installed
-   MongoDB instance (local or Atlas)
-   Firebase project for Authentication

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd TriviArena
    ```

2.  **Setup Backend**
    ```bash
    cd Backend
    npm install
    # Create .env file based on .env.example
    npm start
    ```

3.  **Setup Socket Server**
    ```bash
    cd socket
    npm install
    npm start
    ```

4.  **Setup Frontend (Client)**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 📂 Project Structure

-   `client/`: React frontend application.
-   `Backend/`: Express API server for user and quiz management.
-   `socket/`: Socket.io server for handling real-time game events.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License

This project is licensed under the MIT License.
