import { Link } from 'react-router-dom';
import './app.css'
import { useState, useEffect } from 'react'

function ApproveSubmission() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);


    const fetchSubmissions = async () => {
    try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/fetchSubs?fetchType=false', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.message === "No new Images") {
            setSubmissions([]);
        } else {
            console.log("Fetched submissions:", data);
            for (const row of data.rows) {
                console.log("Row:", row);
                if (!row.filepath) {
                    console.warn("Row without filepath:", row);
                    continue;
                }
        }
        setSubmissions(data.rows);
    }
    } catch (err) {
        console.error("Error while fetching:", err)
        setError("Failed to load submissions");
    } finally{
        setLoading(false)
    }
    };

    const approveSubmission = async (filepath, teamID, challenge) => {
        try {
            setSubmissions(prev => prev.filter(path => path !== filepath));
            const imageResponse = await fetch(`http://localhost:3000/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: filepath })
            });

            if (!imageResponse.ok) {
                throw new Error(`Failed to approve submission ${imageResponse.status}`);
            }

            const challengeResponse = await fetch(`http://localhost:3000/getChallengePoints?challenge=${challenge}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!challengeResponse.ok) {
                throw new Error(`Failed to get challenge points ${challengeResponse.status}`);
            }

            console.log("Challenge response:", challengeResponse);
            const challengeData = await challengeResponse.json();
            const points = challengeData.points;

            console.log(`Approving submission for team ${teamID} with points: ${points}`);

            const updatePointsResponse = await fetch(`http://localhost:3000/updateTeamPoints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamID: teamID, points: points })
            });

            if (!updatePointsResponse.ok) {
                throw new Error(`Failed to update team points ${updatePointsResponse.status}`);
            }
        } catch (err) {
            setSubmissions(prev => [...prev, filepath]);
            console.error("Error approving submission:", err);
        } finally{
            fetchSubmissions();
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Approve Submissions</h1>
                <p>Loading Submissions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Approve Submissions</h1>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <button onClick={fetchSubmissions}>Retry</button>
            </div>
        )
    }

    if (submissions.length === 0) {
        return (
            <div>
                <h1>Approve Submissions</h1>
                <p>There's nothing here...</p>
                <button onClick={fetchSubmissions}>Refresh</button>
            </div>
        );
    }

    return (
        <>
            <h1>Approve Submissions</h1>
            <p>You have {submissions.length} submissions to review!</p>
            <Link to="/home" className="back-link"><button>Back to Home</button></Link>

            <div className='submissions-grid'>
                {submissions.map((row, index) => (
                    <div key={index} className="submission-item">
                        <h3>Submission {index + 1}</h3>
                        <p><strong>File:</strong> {row.filepath}</p>
                        <p><strong>Challenge:</strong> {row.challenge}</p>
                        <p><strong>Points:</strong> {row.points}</p>

                        {row.filepath.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                <img 
                                    src={`http://localhost:3000/${row.filepath}`} 
                                    alt="Submission" 
                                    style={{ maxWidth: '300px', maxHeight: '200px' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                                <div className="submission-actions">
                                <button onClick={() => approveSubmission(row.filepath, row.teamid, row.challenge)} className="approve-btn">Approve</button>
                                </div>
                        </div>
                    ))}
            </div>
            <button onClick={fetchSubmissions} className="refresh-btn">Refresh List</button>
        </>
    )
}
export default ApproveSubmission;