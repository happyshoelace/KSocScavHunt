import { Link } from 'react-router-dom'
import './App.css'
function Login() {
    return (
      <>
        <form>
            <label>Team Username</label>
            <input type="text" />
            <label>Password</label>
            <input type="password" />
            <Link to="/home">Login</Link>
            {/* <button type="submit">Login</button> */}
        </form>
      </>
    )
  }

  export default Login