import './App.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function UploadSubmission() {
    const location = useLocation();
    const navigate = useNavigate();
    const { challenge, points } = location.state || { challenge:'unknown', points: 0 };

    // State variables to track what's happening
    const [file, setFile] = useState(null);           // The selected file
    const [preview, setPreview] = useState(null);     // Preview of the image
    const [error, setError] = useState('');           // Error messages
    const [uploading, setUploading] = useState(false); // Is upload in progress?
    const [team, setTeam] = useState({ name: '', points: 0, id: null });

    // Get team info when component loads
    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const user = JSON.parse(userData)
            setTeam({ 
                name: user.teamName, 
                points: user.points, 
                id: user.id 
            })
        }
    }, []);

    // When user selects a file
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]; // Get the first file they selected
        
        if (selectedFile) {
            setFile(selectedFile);
            setError(''); // Clear any previous errors
            
            // If it's an image, create a preview
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader(); // This reads the file
                reader.onload = (e) => setPreview(e.target.result); // When done reading, set preview
                reader.readAsDataURL(selectedFile); // Start reading the file
            } else {
                setPreview(null); // Not an image, no preview
            }
        }
    };

    // When user clicks submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop the form from refreshing the page
        
        // Check if we have everything we need
        if (!file) {
            setError('Please select a file.');
            return;
        }
        if (!team.id) {
            setError('Team information not found. Please log in again.');
            return;
        }

        setUploading(true); // Show loading state
        setError(''); // Clear errors

        try {
            // Create form data to send to server
            const formData = new FormData();
            formData.append('file', file);              // The actual file
            formData.append('team_id', team.id);        // Who's uploading it
            formData.append('challenge', challenge);     // Which challenge
            formData.append('points', points);          // How many points

            // Send to server
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            console.log('Upload success:', data);
            
            // Go back to home page with success message
            navigate('/home', { 
                state: { 
                    message: `Successfully submitted ${challenge} challenge!` 
                } 
            });
            
        } catch (error) {
            console.error('Upload error:', error);
            // setError('Upload failed. Please try again.');
        } finally {
            setUploading(false); // Hide loading state
        }
    };

    // Remove selected file
    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError('');
    };

    return (
        <div className="upload-submission">
            <h1>Upload Your Submission</h1>
            <h2>Challenge: {challenge}</h2>
            <h3>Points: {points}</h3>
            
            <form onSubmit={handleSubmit}>
                {/* Custom file input that looks like a button */}
                <div className="file-input-container">
                    <label htmlFor="file-input" className="file-input-label">
                        {!file ? (
                            <>
                                <span className="camera-icon">📸</span>
                                <span>Take Photo or Select File</span>
                            </>
                        ) : (
                            <span>Change File</span>
                        )}
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*,video/*"    // Only allow images and videos
                        capture="environment"        // Use back camera on mobile
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // Hide the ugly default input
                    />
                </div>

                {/* Show preview if file is selected */}
                {file && (
                    <div className="file-preview">
                        <p>Selected: {file.name}</p>
                        {preview && (
                            <img 
                                src={preview} 
                                alt="Preview" 
                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                            />
                        )}
                        <button type="button" onClick={clearFile} className="clear-btn">
                            Remove File
                        </button>
                    </div>
                )}

                {error && <p className="error">{error}</p>}
                
                <button 
                    type="submit" 
                    disabled={!file || uploading}  // Disable if no file or uploading
                    className="submit-btn"
                >
                    {uploading ? 'Uploading...' : 'Submit'}
                </button>
            </form>
            
            <Link to="/home" className="back-link">Back to Home</Link>
        </div>
    );
}

export default UploadSubmission;