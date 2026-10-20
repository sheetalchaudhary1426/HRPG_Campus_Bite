
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, authAPI } from "../services/api.js";

const AuthContext = createContext(null);

function getPayload(response) {
  return response?.data ?? response;
}

function getToken(response) {
  const payload = getPayload(response);

  return (
    payload?.token ||
    payload?.accessToken ||
    payload?.access_token ||
    response?.token ||
    response?.accessToken ||
    null
  );
}

function getUser(response) {
  const payload = getPayload(response);

  return (
    payload?.user ||
    payload?.currentUser ||
    response?.user ||
    (payload?._id || payload?.id || payload?.email ? payload : null)
  );
}

function saveSession(token, user) {
  if (token) {
    localStorage.setItem("campusbite_token", token);
  }

  if (user) {
    localStorage.setItem("canteen_user", JSON.stringify(user));
  }
}

function clearSession() {
  localStorage.removeItem("campusbite_token");
  localStorage.removeItem("canteen_user");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("canteen_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = localStorage.getItem("campusbite_token");

      if (!token) {
        if (active) {
          setUser(null);
          localStorage.removeItem("canteen_user");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authAPI.getMe();
        const currentUser = getUser(response);

        if (!currentUser) {
          throw new Error("Could not retrieve your account.");
        }

        if (active) {
          setUser(currentUser);
          saveSession(token, currentUser);
        }
      } catch (error) {
        if (active && error instanceof ApiError && error.status === 401) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authAPI.login(credentials);
    const token = getToken(response);
    let currentUser = getUser(response);

    if (token) {
      localStorage.setItem("campusbite_token", token);
    }

    if (!currentUser && token) {
      const profileResponse = await authAPI.getMe();
      currentUser = getUser(profileResponse);
    }

    if (!token) {
      throw new Error(
        "The login response did not include a JWT token. Check your backend login controller."
      );
    }

    if (!currentUser) {
      localStorage.removeItem("campusbite_token");
      throw new Error(
        "Login succeeded, but the user profile was missing from the API response."
      );
    }

    saveSession(token, currentUser);
    setUser(currentUser);

    return currentUser;
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authAPI.register(userData);
    const token = getToken(response);
    let currentUser = getUser(response);

    // Some APIs register the user without automatically logging them in.
    if (token && !currentUser) {
      try {
        const profileResponse = await authAPI.getMe();
        currentUser = getUser(profileResponse);
      } catch {
        // Registration may succeed without issuing a login session.
      }
    }

    if (token && currentUser) {
      saveSession(token, currentUser);
      setUser(currentUser);

      return { user: currentUser, authenticated: true };
    }

    return {
      user: currentUser,
      authenticated: false,
    };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);

    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
