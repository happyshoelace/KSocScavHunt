import express from 'express';
import multer from 'multer';
import path from 'path';
import { Pool } from 'pg';
import cors from 'cors';
import 'dotenv/config';

const app = express()
const PORT = 3000;

// Multer Storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

// postgres
const pool = new Pool ({
    user: process.env.USER,
    host: 'localhost',
    database: 'ScavHunt',
    password: process.env.PASSWORD,
    port: 5432
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Raw body available:', !!req.body);
    next();
});

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the form data from the request
    const { team_id, challenge, points } = req.body;

    // Validate required fields
    if (!team_id || !challenge || !points) {
        return res.status(400).json({ error: 'team_id, challenge, and points are required' });
    }

    try {
        // Save file information to database using your existing table structure
        const result = await pool.query(
            'INSERT INTO uploads(teamid, filepath, filetype, challenge) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                team_id,                 // teamID from your table
                req.file.path,           // filePath - where file is saved
                req.file.mimetype,       // fileType - mime type like 'image/jpeg'
                challenge
            ]
        );

        console.log('Upload saved to database:', result.rows[0]);

        // Return success response
        res.status(200).json({ 
            message: 'File uploaded successfully',
            upload: result.rows[0],
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: req.file.path,
                size: req.file.size
            },
            challenge: challenge,
            team_id: team_id
        });

    } catch (err) {
        console.error('Error saving upload:', err);
        res.status(500).json({ error: 'Database error while saving upload' });
    }
})

app.post('/approve', async (req, res) => {
    if (!req.body || !req.body.path) {
        return res.status(400).json({error: "No body in request"})
    }

    const filepath = req.body.path;
    try{
        const result = await pool.query('UPDATE uploads SET approved = true WHERE filepath = $1', [filepath]);
        if (result.rowCount === 0) {
            return res.status(404).json({error: "No upload found with the given path"});
        }
        console.log("Approved Image at path:", filepath);

        res.status(200).json({message: "Upload Updated"});
    } catch (err) {
        console.error("Error updating challenge upload:", err);
        res.status(500).json({error: "Database error while updating upload"});
    }
    
})

app.post('/updateTeamPoints', async (req, res) => {
    if (!req.body || !req.body.teamID || !req.body.points) {
        return res.status(400).json({error: "teamID and points are required"});
    }

    const { teamID, points } = req.body;
    try {
        const result = await pool.query('UPDATE teams SET teampoints = teampoints + $1 WHERE teamid = $2', [points, teamID]);
        if (result.rowCount === 0) {
            return res.status(404).json({error: "Team not found"});
        }
        res.status(200).json({message: "Team points updated successfully"});
    } catch (err) {
        console.error("Error updating team points:", err);
        res.status(500).json({error: "Database error while updating team points"});
    }
});

app.get('/getChallengePoints', async (req, res) => {
    if (!req.query.challenge) {
        return res.status(400).json({error: "Challenge is required"});
    }

    const challenge = req.query.challenge;

    try {
        const result = await pool.query('SELECT pointValue FROM challenges WHERE challenge = $1', [challenge]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Challenge not found"});
        }

        res.status(200).json({points: result.rows[0].pointvalue});
    } catch (err) {
        console.error("Error fetching challenge points:", err);
        res.status(500).json({error: "Database error while fetching challenge points"});
    }
});

app.get('/fetchSubs', async (req, res) => {

    if (!req.query.fetchType) {
        return res.status(400).json({error: "fetchType query parameter is required"});
    }

    const fetchType = req.query.fetchType;
    try {
        const result = await pool.query('SELECT * FROM uploads WHERE approved = $1', [fetchType] );

        if (result.rows.length === 0){
            return res.status(200).json({message: "No new images", rows: []});
        }

        return res.status(200).json({message: "New images", rows: result.rows});
    }
    catch (err) {
        console.error("Error during fetch:", err);
        res.status(500).json({error:"Internal Server Error"});
    }
})

app.get('/fetchChallengeDescription', async (req, res) => {
    const challenge = req.query.challenge;
    try {
        const result = await pool.query('SELECT fullDescription FROM challenges WHERE challenge = $1', [challenge]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        const description = result.rows[0].fulldescription;
        res.status(200).json({ description });
    }
    catch (err) {
        console.error("Error fetching challenge description:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/fetchTeamFromId', async (req, res) => {
    const teamId = req.query.teamId;

    if (!teamId) {
        return res.status(400).json({ error: 'teamId is required' });
    }

    try {
        const result = await pool.query('SELECT teamname, teampoints FROM teams WHERE teamid = $1', [teamId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }

        const teamName = result.rows[0].teamname;
        const teamPoints = result.rows[0].teampoints;
        res.status(200).json({ teamName, teamPoints });
    } catch (err) {
        console.error('Error fetching team:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Request body type:', typeof req.body);
    console.log('Request body keys:', Object.keys(req.body || {}));
    console.log('Request headers:', req.headers);
    
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is missing or empty' });
    }
    
    const { teamname, password } = req.body;
    
    if (!teamname || !password) {
        return res.status(400).json({ error: 'teamname and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM teams WHERE teamname = $1',[teamname]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username'});
        }
        

        const user = result.rows[0]
        console.log(user)

        if (password !== user.teampass){
            return res.status(401).json({ error: 'Invalid password'});
        }

        res.status(200).json({ message: 'Login Successful', user: {id: user.teamid, teamName:user.teamname, points: user.teampoints}});
    }
    catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error '});
    }
})



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});