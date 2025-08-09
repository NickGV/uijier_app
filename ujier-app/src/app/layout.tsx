import React from 'react';
import { ThemeProvider } from '../components/providers/theme-provider';
import '../styles/globals.css';

const Layout = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;