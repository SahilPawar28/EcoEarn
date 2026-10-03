import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, message: "", severity: "info" });

  const notify = useCallback((message, severity = "info") => {
    setState({ open: true, message, severity });
  }, []);

  const close = () => setState((s) => ({ ...s, open: false }));

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4500}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={close} severity={state.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext).notify;
