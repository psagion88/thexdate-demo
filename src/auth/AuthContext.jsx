import React, { createContext, useContext, useEffect, useState } from 'react'
const AuthContext = createContext(null)
const KEY = 'thexdate.user'
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setUser(JSON.parse(s)) } catch {} }, [])
  const signIn = (u) => { setUser(u); localStorage.setItem(KEY, JSON.stringify(u)) }
  const signOut = () => { setUser(null); localStorage.removeItem(KEY) }
  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}
export function useAuth() { return useContext(AuthContext) }