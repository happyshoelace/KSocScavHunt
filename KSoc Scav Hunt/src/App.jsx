import './App.css'
import Home from './home.jsx'
import Index from './index.jsx'
import Login from './login.jsx'
import UploadSubmission from './uploadsubmission.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function app() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/uploadSubmission" element={<UploadSubmission />} />
      </Routes>
    </BrowserRouter>
  )
}

export default app
