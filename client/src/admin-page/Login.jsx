import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("jwt", token);

        console.log("Login successful, navigating to /dataList");
        navigate("/dataList", { replace: true }); // Redirect to private data list page
      } else {
        const { message } = await response.json();
        setError(message || "Login failed");
        console.error("Login failed", response.status, message);
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <CssBaseline />
      <Sheet
        sx={{
          width: 400,
          maxWidth: "100%",
          mx: "auto",
          my: 4,
          py: 4,
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "lg",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
        }}
        variant="outlined"
      >
        <div>
          <Typography
            level="h3"
            component="h1"
            fontWeight="bold"
            textAlign="center"
          >
            Welcome Back!
          </Typography>
          <Typography level="body1" textAlign="center" color="text.secondary">
            Please log in to your account
          </Typography>
        </div>
        <form onSubmit={handleLogin}>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              sx={{ fontSize: "16px" }}
            />
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={{ fontSize: "16px" }}
            />
          </FormControl>
          {error && (
            <Typography
              color="error"
              variant="body2"
              textAlign="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          <Button
            sx={{
              mt: 1,
              backgroundColor: "#007bff",
              color: "#ffffff",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
            type="submit"
            fullWidth
          >
            Log in
          </Button>
        </form>
      </Sheet>
    </main>
  );
}
