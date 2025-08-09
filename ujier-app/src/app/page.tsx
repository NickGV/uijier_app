import React from 'react';
import { ThemeProvider } from '../components/providers/theme-provider';
import '../styles/globals.css';

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Ujier App</title>
        <meta name="description" content="A scalable and maintainable application for managing ujieres." />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;