import './App.css'
import { Link } from 'react-router-dom'
function Index() {
    return (
      <>
      <html>
        <head>
          <title>Karaoke Society Scavenger Hunt!</title>
        </head>
        <body>
          <h1>UTS KSOC Scavenger Hunt!</h1>
          <p>
            Bianca is so embarassed that they forgot the lyrics to the song they were singing.
            Help them out by finding the lyrics to the song they were singing.
          </p>
        <p>
          You should get a login before you start. This is for your entire team! On this website you can submit your photos/videos for the bonus tasks!
        </p>
        <Link to="/login"><button>Let's Go!</button></Link>
        </body>
        <img className="detective-Cataoki-img" src="src/assets/detective-Cataoki.png" alt="Detective Cataoki" />
      </html>

      </>
    )
  }

  export default Index