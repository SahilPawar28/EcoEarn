import { createTheme } from "@mui/material/styles";

export const colors = {
  primary: "#1F7A3F",
  primaryDark: "#15572C",
  primaryLight: "#4CA868",
  tint: "#EAF7EE",
  tintStrong: "#D2EEDA",
  accent: "#E8A33D",
  bg: "#FAFBF8",
  paper: "#FFFFFF",
  text: "#17241C",
  textMuted: "#5B6B60",
  border: "#E1E9E3",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
      light: colors.primaryLight,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: colors.accent,
      contrastText: "#1A1200",
    },
    background: {
      default: colors.bg,
      paper: colors.paper,
    },
    text: {
      primary: colors.text,
      secondary: colors.textMuted,
    },
    divider: colors.border,
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    h4: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    button: { fontFamily: "'Poppins', sans-serif", fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.bg,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: "1.25rem",
          paddingBlock: "0.6rem",
        },
        containedPrimary: {
          boxShadow: "0 6px 16px rgba(31, 122, 63, 0.25)",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(31, 122, 63, 0.32)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          boxShadow: "0 2px 10px rgba(23, 36, 28, 0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 0 rgba(23, 36, 28, 0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

export default theme;
