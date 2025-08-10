import React from 'react';
import { ThemeProvider } from '../providers/theme-provider';
import BottomNavigation from '../bottom-navigation';
import ErrorBoundary from '../error-boundary';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <div className="min-h-screen flex flex-col">
                    <main className="flex-grow">{children}</main>
                    <BottomNavigation />
                </div>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default Shell;