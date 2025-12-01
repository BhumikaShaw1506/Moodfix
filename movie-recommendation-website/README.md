# Movie Recommendation Website

A mood-based movie recommendation system with Flask backend and TMDB API integration.

## Features

- User authentication (signup/login) using localStorage
- Mood and feeling-based movie recommendations
- Real movie posters from TMDB API
- 35 curated Bollywood and Hollywood movies
- Beautiful glassmorphic UI design

## Setup

### 1. Install Python Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 2. Get TMDB API Key

1. Go to https://www.themoviedb.org/settings/api
2. Sign up and request an API key
3. Copy your API key

### 3. Set Environment Variable

\`\`\`bash
# Linux/Mac
export TMDB_API_KEY="your_api_key_here"

# Windows
set TMDB_API_KEY="your_api_key_here"
\`\`\`

### 4. Run the Flask Server

\`\`\`bash
python app.py
\`\`\`

The server will start on `http://127.0.0.1:5000`

### 5. Open in Browser

Open `http://127.0.0.1:5000` in your web browser

## Project Structure

\`\`\`
.
├── app.py              # Flask backend with TMDB integration
├── requirements.txt    # Python dependencies
├── index.html          # Homepage
├── signup.html         # Signup page
├── login.html          # Login page
├── mood.html           # Mood selection and recommendations
├── script.js           # Frontend JavaScript
├── style.css           # Styles
├── movies.json         # Movie database (35 movies)
└── public/             # Static assets
\`\`\`

## API Endpoints

- `GET /` - Serve homepage
- `POST /api/recommend` - Get movie recommendations
  - Body: `{"mood": "happy", "feeling": "excited"}`
  - Returns: Movies with TMDB poster URLs
- `GET /api/health` - Health check

## How It Works

1. User signs up and logs in (stored in localStorage)
2. User selects current mood and desired feeling
3. Frontend sends request to Flask backend
4. Backend filters movies from movies.json
5. Backend fetches real posters from TMDB API
6. Frontend displays movies with posters

## Notes

- TMDB API key is required for poster images
- Without API key, fallback placeholder images are used
- All user data is stored in browser localStorage
