import './App.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home() {
    const [team, setTeam] = useState({ name: "Team Name", points: 0 })
    const [openDropdown, setOpenDropdown] = useState(false)

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
            const user = JSON.parse(userData)
            setTeam({ name: user.teamName, points: user.points })
        }
    }, [])

    const handleDropdown = (dropdown) => {
        setOpenDropdown(prev => prev === dropdown ? null : dropdown)
    }
    return (
      <>
        <h1>Hi {team.name}!</h1>
        <h2>You have {team.points} points!</h2>
        <div className="dropdown">
        <button onClick={() => handleDropdown('easy')} className="dropbtn">Easy<span className='points'>250pts</span></button>
        <div
          id="easyDropdown"
          className="dropdown-content"
          style={{ display: openDropdown === 'easy' ? 'block' : 'none' }}
        >
          <ul>
            <li><Link to="/uploadSubmission" state={{challenge:'pigeon', points:250}}>Find a pigeon eating something</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'rubbish', points:250}}>Pick up some rubbish off the floor</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'dance', points:250}}>Make up a dance with your whole team</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'library', points:250}}>Learn the name of someone who works for UTS Security</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'art', points:250}}>Make an art piece out of things from nature</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'disguse', points:250}}>Create a disguse</Link></li>
          </ul>
        </div>  
</div>
<div className="dropdown">
        <button onClick={() => handleDropdown('medium')} className="dropbtn">Medium<span className='points'>400pts</span></button>
        <div
          id="mediumDropdown"
          className="dropdown-content"
          style={{ display: openDropdown === 'medium' ? 'block' : 'none' }}
        >
          <ul>
            <li><Link to="/uploadSubmission" state={{challenge:'highfive', points:400}}>High-five a stranger</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'favouriteSong', points:400}}>Ask a stranger what their favourite song is</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'titanic', points:400}}>Recreate Titanic on a balcony</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'campusAnimal', points:400}}>Take a photo of an animal on campus</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'swiftie', points:400}}>Loudly sing a Taylor Swift song in a public area</Link></li>
          </ul>
        </div>  
</div>
<div className="dropdown">
        <button onClick={() => handleDropdown('hard')} className="dropbtn">Hard<span className='points'>500pts</span></button>
        <div
          id="hardDropdown"
          className="dropdown-content"
          style={{ display: openDropdown === 'hard' ? 'block' : 'none' }}
        >
          <ul>
            <li><Link to="/uploadSubmission" state={{challenge:'freeItem', points:500}}>Get something for free... legally  (Best Item wins the points)</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'propose', points:500}}>Propose to a stranger</Link></li>
            <li><Link to="/uploadSubmission" state={{challenge:'exec', points:500}}>Take a picture of an exec without them noticing</Link></li>
          </ul>
        </div>  
</div>
<div className="dropdown">
        <button onClick={() => handleDropdown('legendary')} className="dropbtn">Legendary<span className='points'>1000pts</span></button>
        <div
          id="legendaryDropdown"
          className="dropdown-content"
          style={{ display: openDropdown === 'legendary' ? 'block' : 'none' }}
        >
          <ul>
            <li><Link to="/uploadSubmission" state={{challenge:'member', points:1000}}>Meet someone new and get them to join Karaoke Society</Link></li>
          </ul>
        </div>  
</div>
      </>
    )
  }

  export default Home