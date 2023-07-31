import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useState, createContext, useContext } from "react";

//severity: 'success' | 'info' | 'warning' | 'error';
const SnackbarContext = createContext({
    openSnackbar: (props) => { },
    closeSnackbar: () => { },
});

export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (!context)
        throw new Error("useSnackbar must be used within SnackbarProvider");

    return context;
}

export function SnackbarProvider({ children }) {
    const [state, setState] = useState({
        open: false,
        message: "",
        autoHideDuration: 3000,
        severity: "info",
    });

    const openSnackbar = ({
        message = "",
        severity = "info",
        autoHideDuration = 5000,
    }) => {
        setState({ open: true, message, severity, autoHideDuration });
    };

    const closeSnackbar = () => {
        setState((prev) => ({
            ...prev,
            open: false,
        }));
    };

    return (
        <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
            <Snackbar
                open={state.open}
                autoHideDuration={state?.autoHideDuration}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity={state?.severity} onClose={closeSnackbar}>
                    {state.message}
                </Alert>
            </Snackbar>
            {children}
        </SnackbarContext.Provider>
    );
}
