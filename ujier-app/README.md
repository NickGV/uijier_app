# Ujier App

Ujier App is a web application built with Next.js that provides a platform for managing ujieres, simpatizantes, and miembros. The application is designed to be functional, scalable, and maintainable, following best practices in modern web development.

## Features

- **User Authentication**: Secure login functionality for users.
- **Dashboard**: A central hub for users to access various features and data.
- **Data Management**: View and manage lists of ujieres, simpatizantes, and miembros.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Error Handling**: Robust error boundary to catch and display errors gracefully.
- **Progressive Web App (PWA)**: Offline capabilities and installation support.

## Project Structure

```
src/
├── app/                     # Application pages and API routes
│   ├── (auth)/              # Authentication-related pages
│   ├── (dashboard)/         # Dashboard-related pages
│   ├── api/                 # API routes
├── components/              # Reusable components
├── hooks/                   # Custom hooks
├── lib/                     # Utility functions and libraries
├── styles/                  # Global styles
└── types/                   # TypeScript types
public/
├── manifest.json            # Web app manifest for PWA
├── robots.txt               # Instructions for web crawlers
└── sw.js                    # Service worker for PWA
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ujier-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in the required values.

4. **Run the development server**:
   ```
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.