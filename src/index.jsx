import './App.css'
import { Link } from 'react-router-dom'
function Index() {
    return (
      <>
        <h1>Karaoke Society Scavenger Hunt!</h1>
        <p>
          Bianca is so embarassed that they forgot the lyrics to the song they were singing.
          Help them out by finding the lyrics to the song they were singing.
        </p>
        <p>
          You should get a login before you start. This is for your entire team! On this website you can submit your photos/videos for the bonus tasks!
        </p>
        <Link to="/login">Let's Go!</Link>
      </>
    )
  }

  export default Index