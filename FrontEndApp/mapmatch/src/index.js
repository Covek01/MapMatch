import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'Context/SnackbarContext/SnackbarContext';
import { AuthStateProvider } from 'Context/AuthContext/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   // <React.StrictMode>
//     <App />
//   // </React.StrictMode>
// );

root.render(
    <AuthStateProvider >
        <GoogleOAuthProvider clientId="768783161051-u7gf7htjb6kki0a4udjdtj33d453jnlq.apps.googleusercontent.com">
            <SnackbarProvider>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </SnackbarProvider>
        </GoogleOAuthProvider>
    </AuthStateProvider >

    // document.getElementById('root');
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
