import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";
import { EmployeeView } from "../components/EmployeeView";
import { ManagerView } from "../components/ManagerView";

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isEmployee = user?.role === "EMPLOYEE";
  const isManager = user?.role === "MANAGER";

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Top AppBar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#fff", color: "#000", boxShadow: 2 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "block", md: "none" }, color: "#4b5563" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937" }}>
              Hệ thống Đăng ký Chấm công
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              {user?.email?.[0].toUpperCase()}
            </Avatar>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ color: "#374151", "&:hover": { color: "#dc2626" } }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Menu
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Bảng điều khiển" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Yêu cầu" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* User Info Card */}
        <Card
          sx={{
            mb: 3,
            backgroundImage: "linear-gradient(90deg, #f0f7ff 0%, #f0f4ff 100%)",
            borderLeft: "4px solid #2563eb",
          }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" sx={{ color: "#4b5563" }}>
                  Đăng nhập
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#111827" }}
                >
                  {user?.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563" }}>
                  Vai trò: <span style={{ fontWeight: 600 }}>{user?.role}</span>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "#1976d2",
                    fontSize: "1.5rem",
                  }}
                >
                  {user?.email?.[0].toUpperCase()}
                </Avatar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Role-based Views */}
        {isEmployee && <EmployeeView />}
        {isManager && <ManagerView />}
      </Container>
    </Box>
  );
}
