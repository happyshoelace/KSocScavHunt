import './App.css'
import { Link } from 'react-router-dom'

function Home() {
    const team = { name: "Team Name", points: 0 }

    const [showDropdown, setShowDropdown] = useState(false)

    const handleDropdown = () => {
      setShowDropdown((prev) => !prev)
  }
    return (
      <>
        <h1>Hi {team.name}!</h1>
        <h2>You have {team.points} points!</h2>
        <div className="dropdown">
        <button onClick={handleDropdown} className="dropbtn">Easy</button>
        <div
          id="myDropdown"
          className="dropdown-content"
          style={{ display: showDropdown ? 'block' : 'none' }}
        >
          <Link to="/uploadSubmission">Link 1</Link>
          <Link to="/uploadSubmission">Link 2</Link>
          <Link to="/uploadSubmission">Link 3</Link>
        </div>
</div> 
<script>

</script>
      </>
    )
  }

  export default Home