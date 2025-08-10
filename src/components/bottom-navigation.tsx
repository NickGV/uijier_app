import React from 'react';
import { useRouter } from 'next/router';

const BottomNavigation = () => {
    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
            <ul className="flex justify-around p-4">
                <li>
                    <button onClick={() => navigateTo('/dashboard/ujieres')} className="text-gray-700">Ujieres</button>
                </li>
                <li>
                    <button onClick={() => navigateTo('/dashboard/simpatizantes')} className="text-gray-700">Simpatizantes</button>
                </li>
                <li>
                    <button onClick={() => navigateTo('/dashboard/miembros')} className="text-gray-700">Miembros</button>
                </li>
                <li>
                    <button onClick={() => navigateTo('/dashboard/conteo')} className="text-gray-700">Conteo</button>
                </li>
            </ul>
        </nav>
    );
};

export default BottomNavigation;