from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__, static_folder='.')
CORS(app)

# TMDB API Configuration
TMDB_API_KEY = os.getenv('TMDB_API_KEY', 'af1f811828f795b49c1fdfa3e3da32c6')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'
TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

def get_tmdb_poster(movie_title):
    """Fetch movie poster from TMDB API"""
    try:
        # Search for movie
        search_url = f'{TMDB_BASE_URL}/search/movie'
        params = {
            'api_key': TMDB_API_KEY,
            'query': movie_title,
            'language': 'en-US'
        }
        
        response = requests.get(search_url, params=params, timeout=5)
        data = response.json()
        
        if data.get('results') and len(data['results']) > 0:
            poster_path = data['results'][0].get('poster_path')
            if poster_path:
                return f'{TMDB_IMAGE_BASE}{poster_path}'
        
        return None
    except Exception as e:
        print(f'Error fetching poster for {movie_title}: {str(e)}')
        return None

@app.route('/')
def home():
    """Serve the homepage"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/recommend', methods=['POST'])
def recommend_movies():
    """Get movie recommendations based on mood and feeling"""
    try:
        data = request.json
        mood = data.get('mood', '').lower()
        feeling = data.get('feeling', '').lower()
        
        # Load movies from JSON
        with open('movies.json', 'r') as f:
            all_movies = json.load(f)
        
        # Filter movies by mood and feeling
        filtered_movies = [
            m for m in all_movies
            if mood in m.get('mood', '').lower() or 
               feeling in m.get('feel', '').lower()
        ]
        
        if not filtered_movies:
            return jsonify({'error': 'No movies found for this mood'}), 404
        
        # Limit to 6 movies
        selected_movies = filtered_movies[:6]
        
        # Fetch posters from TMDB
        for movie in selected_movies:
            poster_url = get_tmdb_poster(movie['title'])
            movie['poster'] = poster_url if poster_url else '/public/abstract-movie-poster.png'
        
        return jsonify({
            'status': 'success',
            'movies': selected_movies,
            'count': len(selected_movies)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Movie Recommendation API is running',
        'tmdb_configured': TMDB_API_KEY != 'YOUR_TMDB_API_KEY_HERE'
    })

if __name__ == '__main__':
    print('==============================================')
    print('Movie Recommendation API Server')
    print('==============================================')
    print(f'TMDB API Key Configured: {TMDB_API_KEY != "YOUR_TMDB_API_KEY_HERE"}')
    print('Get your TMDB API key from: https://www.themoviedb.org/settings/api')
    print('Set it with: export TMDB_API_KEY="your_key_here"')
    print('==============================================')
    print('Server running on http://127.0.0.1:5000')
    print('==============================================')
    app.run(debug=True, host='0.0.0.0', port=5000)
