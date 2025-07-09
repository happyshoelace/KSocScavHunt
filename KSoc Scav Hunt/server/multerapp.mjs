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
            }
        });

    } catch (err) {
        console.error('Error saving upload:', err);
        res.status(500).json({ error: 'Database error while saving upload' });
    }
})

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