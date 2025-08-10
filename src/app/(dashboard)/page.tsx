import React from 'react';
import { BottomNavigation } from '@/components/bottom-navigation';
import { ErrorBoundary } from '@/components/error-boundary';

const DashboardPage = () => {
    return (
        <ErrorBoundary>
            <div className="dashboard-container">
                <h1>Dashboard</h1>
                <p>Welcome to the dashboard! Here you can manage your data.</p>
                {/* Additional dashboard content can be added here */}
            </div>
            <BottomNavigation />
        </ErrorBoundary>
    );
};

export default DashboardPage;