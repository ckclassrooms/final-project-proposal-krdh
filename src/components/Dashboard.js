import React, {useState} from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout(){
        setError('')
        try {
            await logout()
            navigate("/login");
        } catch {
            setError('Failed to log out')
        }
    }

  return (
    <>
      <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Welcome to DylFyt Buddy</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Account: </strong> {currentUser.email}
            <Link to="/benchpress" className="border border-success bg-success btn btn-primary w-100 mt-4">
                Join Bench Press Queue
            </Link>
            <Link to="/deadlift" className="border border-success bg-success btn btn-primary w-100 mt-4">
                Join Deadlift Queue
            </Link>
            <Link to="/squat" className="border border-success bg-success btn btn-primary w-100 mt-4">
                Join Squat Queue
            </Link>
        </Card.Body>
      </Card>
      <div className="w-150 text-center mt-4">
        <Button variant="link" onClick={handleLogout} className="text-success">Log Out</Button>
      </div>
    </>
  )
}