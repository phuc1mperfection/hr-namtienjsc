import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return children;
}
