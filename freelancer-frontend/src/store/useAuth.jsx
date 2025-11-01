import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined" || stored === "null") {
      return null;
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error("Error parsing stored user:", err);
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);


  // const login = async ({ email, password }) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("http://localhost:5000/api/users/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.message || "Login failed");
  //     }

  //     const data = await res.json();

  //     // Backend sends user info directly (not wrapped in user)
  //     const userData = {
  //       id: data._id,
  //       name: data.name,
  //       email: data.email,
  //       role: data.role,    // ✅ role included
  //       token: data.token,
  //     };

  //     setUser(userData);
  //     localStorage.setItem("user", JSON.stringify(userData));

  //     return userData;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();

      
      const userData = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        bio: data.bio || "",
        skills: data.skills || [],
        experience: data.experience || "",
        token: data.token,
      };

      // Save to state + localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);

      return userData;
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
