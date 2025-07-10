# Scavenger Hunt Bingo Board Online Portal
A very scuffed, makeshift portal which I made to facilitate the UTS Karaoke Society Scavenger Hunt!

## What you'll need to get this running
- [Node.js](https://nodejs.org/) (v14 or something later)
- [PostgreSQL](https://www.postgresql.org/)

## Getting it running

1.  **Yoink the code:**
    ```bash
    git clone https://github.com/happyshoelace/KSocScavHunt.git
    cd KSoc-Scav-Hunt
    ```

2.  **Install all the node_modules:**
    ```bash
    npm install
    ```

## The Database Shenanigans

1.  Get **PostgreSQL** running and make a new database. Call it `ScavHunt`.

2.  Connect to your shiny new `ScavHunt` database and paste this stuff in to make the tables:

    ```sql
    CREATE TABLE teams (
        teamid SERIAL PRIMARY KEY,
        teamname VARCHAR NOT NULL,
        teampass VARCHAR NOT NULL,
        teampoints INTEGER DEFAULT 0
    );

    CREATE TABLE uploads (
        uploadid SERIAL PRIMARY KEY,
        teamid INTEGER REFERENCES teams(teamid),
        filepath VARCHAR NOT NULL,
        filetype VARCHAR,
        challenge VARCHAR,
        approved BOOLEAN DEFAULT FALSE,
        submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

## Secret Stuff (.env)
You need to tell the app how to log into your database. Make a file called `.env` in the main project folder. Don't commit this file unless you want to have a bad time.

```
USER=your_postgres_username
PASSWORD=your_postgres_password
```

## Fire it up!
You've gotta run two things at once because we're fancy like that.

1.  **Get the backend going:**
    ```bash
    node server/multerapp.mjs
    ```
    This thing will hang out at `http://localhost:3000`.

2.  **Get the frontend going in another terminal:**
    ```bash
    npm run dev
    ```
    This will pop up at `http://localhost:5173`.

## Where's all the junk?
If you need to dig around in the code, here's a rough map of the mess:

-   `public/`: Static stuff for Vite.
-   `server/`: The Express backend lives here (`multerapp.mjs`).
    -   `uploads/`: Where all the uploaded pictures get dumped (I'd probably add everything inside this folder to the gitignore).
-   `src/`: All the React frontend code.
    -   `assets/`: SVGs and other bits.
    -   `App.jsx`: The main brain with all the routes.
    -   `home.jsx`: The home page.
    -   `login.jsx`: The login page.
    -   `uploadsubmission.jsx`: The page for uploading stuff.
    -   `approveSubmission.jsx`: The page for approving stuff.
-   `eslint.config.js`: Code style police.
-   `package.json`: List of all the node modules we installed.
-   `vite.config.js`: Vite's settings.
