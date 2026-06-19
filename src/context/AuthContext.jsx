import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("currentUserEmail") 
    ? { email: localStorage.getItem("currentUserEmail") } 
    : null
  );

  function signup(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      return { success: false, message: "Email already exists" };
    }
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    setUser({ email });

    return { success: true, message: "User created successfully" };
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("currentUserEmail", email);
      setUser({ email });
      return { success: true, message: "Login successful" };
    }
    return { success: false, message: "Invalid email or password" };
  }

  function logout() {
    localStorage.removeItem("currentUserEmail");
    setUser(null);
  }


  return (
    <AuthContext.Provider value={{ signup, login, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}