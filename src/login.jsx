import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

function Login() {
    const [teamname, setTeamname] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamname,
                    password
                })
            })

            const data = await response.json()

            if (response.ok) {
                // Login successful
                console.log('Login successful:', data)
                // Store user data in localStorage (optional)
                localStorage.setItem('user', JSON.stringify(data.user))
                // Navigate to home page
                navigate('/home')
            } else {
                // Login failed
                setError(data.error || 'Login failed')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Team Username</label>
                <input 
                    type="text" 
                    value={teamname}
                    onChange={(e) => setTeamname(e.target.value)}
                    required
                />
                <label>Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <div style={{color: 'red'}}>{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </>
    )
}

export default Login