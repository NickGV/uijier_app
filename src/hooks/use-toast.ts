import { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (toasts.length > 0) {
                removeToast(toasts[0].id);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        {toast.message}
                        <button onClick={() => removeToast(toast.id)}>X</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};