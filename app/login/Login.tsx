"use client";

import { Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { login } from "./actions";

export default function Login() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Button
        onClick={() => login()}
        variant="contained"
        startIcon={<FontAwesomeIcon icon={faGoogle} />}
        sx={{
          backgroundColor: "#4285F4",
          color: "#fff",
          fontWeight: "bold",
          textTransform: "none",
          padding: "12px 24px",
          borderRadius: "4px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          fontSize: "1.1rem",
          "&:hover": {
            backgroundColor: "#357ae8",
          },
          "&:active": {
            backgroundColor: "#3367D6",
          },
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}
