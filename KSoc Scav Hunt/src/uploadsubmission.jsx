import './App.css'
import { Link, useLocation} from 'react-router-dom'
import { useState } from 'react'

function UploadSubmission() {
    const location = useLocation();
    const { points } = location.state || { points: 0 };


    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please provide a file.');
            return;
        }
        // Handle file upload logic here
        console.log('File:', file);
        // Reset form
        setFile(null);
    };



    return (
        <div className="upload-submission">
            <h1>Upload Your Submission for {points} Points</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                {error && <p className="error">{error}</p>}
                <button type="submit">Submit</button>
            </form>
            <Link to="/home">Back to Home</Link>
        </div>
    );
}

export default UploadSubmission;