import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()

    function signup(email, password) {
        // creates usser in firebase
        auth.createUserWithEmailAndPassword(email, password)
    }

    useEffect(() => {
        // listen for change in user
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        // stops listening to listener
        return unsubscribe
    }, [])
    
    const value = {
        currentUser
    }
    
    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}
