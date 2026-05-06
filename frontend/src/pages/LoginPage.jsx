import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { authAPI } from "../api/endpoints";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      setAuth(user, token);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(135deg, #f3f7ff 0%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "#1f2937" }}
            >
              Hệ thống Đăng ký Chấm công
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
              Nam Tiến JSC
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              placeholder="email@congty.com"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              placeholder="••••••••"
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              sx={{
                mt: 3,
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <Box
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: "#eff6ff",
              borderRadius: 1,
              border: "1px solid #bfdbfe",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#374151", mb: 1 }}
            >
              Tài khoản mẫu:
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", color: "#4b5563" }}
            >
              <strong>Nhân viên:</strong> employee@namtienjsc.com / 123456
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", color: "#4b5563" }}
            >
              <strong>Quản lý:</strong> boss@namtienjsc.com / 123456
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
