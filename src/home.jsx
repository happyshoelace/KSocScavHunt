import './App.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { set } from 'react-hook-form'

function Home() {
    const [team, setTeam] = useState({ name: "Team Name", points: 0 })
    const [openDropdown, setOpenDropdown] = useState(false)
    const [loading, setLoading] = useState(true)
    const [imageFeed, setImageFeed] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
            const user = JSON.parse(userData)
            setTeam({ name: user.teamName, points: user.points })
        }
        
        // Fetch the image feed when component loads
        fetchImageFeed()
    }, [])

    const handleDropdown = (dropdown) => {
        setOpenDropdown(prev => prev === dropdown ? null : dropdown)
    }

    const fetchImageFeed = async () => {
        try {
          setLoading(true)
          const result = await fetch('http://localhost:3000/fetchSubs?fetchType=true', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })

          if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`)
          }
          const data = await result.json()
          if (data.message === "None") {
            console.log("No approved images found")
            setImageFeed([])
          } else {
            console.log("Fetched approved images:", data.rows)
            
            // Fetch team details for each submission
            const submissionsWithTeamData = await Promise.all(
              data.rows.map(async (submission) => {
                try {
                  const teamResult = await fetch(`http://localhost:3000/fetchTeamFromId?teamId=${submission.teamid}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  })
                  
                  if (teamResult.ok) {
                    const teamData = await teamResult.json()
                    console.log(`Fetched team data for team ID ${submission.teamid}:`, teamData)
                    return {
                      ...submission,
                      teamName: teamData.teamName,
                      teamPoints: teamData.teamPoints
                    }
                  } else {
                    throw new Error(`Failed to fetch team data for team ID ${submission.teamid}`)
                  }
                } catch (teamError) {
                  console.error(`Error fetching team data for team ID ${submission.teamid}:`, teamError)
                  return {
                    ...submission,
                    teamName: 'Unknown Team',
                    teamPoints: 0
                  }
                }
              })
            )
            const submissionsWithChallengeData = await Promise.all(
              submissionsWithTeamData.map(async (submission) => {
                try{
                  const challengeResult = await fetch(`http://localhost:3000/fetchChallengeDescription?challenge=${submission.challenge}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  })
                  if (challengeResult.ok) {
                    const challengeData = await challengeResult.json()
                    console.log(`Fetched challenge data for challenge ${submission.challenge}:`, challengeData.description)
                    return {
                      ...submission,
                      challengeDescription: challengeData.description
                    }
                  } else {
                    throw new Error(`Failed to fetch challenge data for challenge ${submission.challenge}`)
                  }
                } catch (challengeError) {
                  console.error(`Error fetching challenge data for challenge ${submission.challenge}:`, challengeError)
                  return {
                    ...submission,
                    challengeDescription: 'Unknown Challenge'
                  }
                }
              })
            )
            setImageFeed(submissionsWithChallengeData)
            return
          }
        } catch (error) {
          console.error("Error fetching image feed:", error)
          setError("Failed to load image feed")
        } finally {
          setLoading(false)
        }
    }



    if (team.name !== 'admin') {
      return (
        <>
          <h1>Hi {team.name}!</h1>
          <h2>You have {team.points} points!</h2>
          <Link to="/login"><button>Logout</button></Link>
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
              <li><Link to="/uploadSubmission" state={{challenge:'disguise', points:250}}>Create a disguise</Link></li>
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
          <div className="image-feed">
            <h2>Image Feed</h2>
            {loading ? (
              <p>Loading images...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>Uh oh! Something went wrong! It's nothing too important, but feel free to tell Bianca that: {error}</p>
            ) : imageFeed.length === 0 ? (
              <p>Hmm... nothing to see here yet...</p>
            ) : (
              imageFeed.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={`http://localhost:3000/${image.filepath}`} alt={`Submission ${index + 1}`} />
                  <p><strong>Team:</strong> {image.teamName}</p>
                  <p><strong>Challenge:</strong> {image.challengeDescription}</p>
                  <p><strong>Total Points:</strong> {image.teamPoints}</p>
                </div>
              ))
            )} 
          </div>
        </div>
        </>
      )
    }
      return (
        <>
          <h1>Welcome to Admin View :3</h1>
          <Link to="/approveSubmission"><button>Let's get approving!</button></Link>
          <Link to="/login"><button>Logout</button></Link>
          <div className="image-feed">
            <h2>Image Feed</h2>
            {loading ? (
              <p>Loading images...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>Uh oh! Something went wrong! It's nothing too important, but feel free to tell Bianca that: {error}</p>
            ) : imageFeed.length === 0 ? (
              <p>Hmm... nothing to see here yet...</p>
            ) : (
              imageFeed.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={`http://localhost:3000/${image.filepath}`} alt={`Submission ${index + 1}`} />
                  <p><strong>Team:</strong> {image.teamName}</p>
                  <p><strong>Challenge:</strong> {image.challengeDescription}</p>
                  <p><strong>Total Points:</strong> {image.teamPoints}</p>
                </div>
              ))
            )} 
          </div>
        </>
      )
    }

  export default Home