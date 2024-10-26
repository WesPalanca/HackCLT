import express from 'express';
import fetch from 'node-fetch'; 
import querystring from 'querystring'; 

const app = express();
const port = 8888; // Port 

const clientId = '740450aeff2b42fb898dd5546a9a61fc'; 
const clientSecret = 'd0b41e7315184feab6a221d83939f54b'; 
const redirectUri = 'http://localhost:8888/callback'; 
const scopes = 'user-top-read playlist-modify-public'; 

app.use(express.urlencoded({ extended: true })); 

app.get('/login', (req, res) => {
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scopes
    })}`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
        })
    });

    const data = await response.json();
    const accessToken = data.access_token; // Get token
    const topTracks = await fetchTopTracks(accessToken);
    
    // Prompt user for mood
    res.send(`
        <form action="/create-playlist" method="POST">
            <label for="mood">Select your mood:</label>
            <select id="mood" name="mood" required>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="tired">Tired</option>
                <option value="anxious">Anxious</option>
            </select>
            <input type="hidden" name="access_token" value="${accessToken}">
            <input type="hidden" name="top_tracks" value="${topTracks.join(',')}">
            <button type="submit">Create Playlist</button>
        </form>
    `);
});

// Fetch top tracks
const fetchTopTracks = async (token) => {
    const apiUrl = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5'; // Endpoint 
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching top tracks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items.map(track => track.id); 
};

// Create playlist
app.post('/create-playlist', async (req, res) => {
    const { access_token, mood, top_tracks } = req.body;
    const trackIds = top_tracks.split(','); 

    // Generate recommendations 
    const recommendedTracks = await getRecommendations(access_token, mood, trackIds);
    // check if they match mood / taste
    const finalTrackIds = await ensureMoodAlignment(access_token, mood, recommendedTracks);
    
    const playlistLink = await createPlaylist(access_token, finalTrackIds);

    res.send(`Playlist created! You can find it here: <a href="${playlistLink}" target="_blank">${playlistLink}</a>`);
});

// Fetch recommended 
const getRecommendations = async (token, mood, baseTracks) => {
    const recommendationUrl = `https://api.spotify.com/v1/recommendations?seed_tracks=${baseTracks.join(',')}&target_valence=${moodValence(mood)}`;

    const response = await fetch(recommendationUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching recommendations: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks.map(track => track.id); 
};

// Valence Values for API Request
const moodValence = (mood) => {
    const moodMap = {
        happy: 0.8,
        sad: 0.2,
        angry: 0.9,
        tired: 0.4,
        anxious: 0.6
        // ill add more later I guess
    };
    return moodMap[mood.toLowerCase()] || 0.5; // Default to neutral if their mood isnt real
};

// check if they match mood
const ensureMoodAlignment = async (token, mood, recommendedTracks) => {
    if (recommendedTracks.length < 5) {
        // get more if necessary
        const additionalTracks = await fetchMoodSpecificTracks(token, mood);
        return [...recommendedTracks, ...additionalTracks].slice(0, 20); // Return 20 tracks
    }
    return recommendedTracks; // Return recommendations if they are good
};

// Fetch tracks
const fetchMoodSpecificTracks = async (token, mood) => {
    const moodSpecificUrl = `https://api.spotify.com/v1/search?q=genre:${mood}&type=track&limit=10`;

    const response = await fetch(moodSpecificUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching mood-specific tracks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks.items.map(track => track.id); 
};

// Create playlist
const createPlaylist = async (token, trackIds) => {
    const createPlaylistUrl = 'https://api.spotify.com/v1/me/playlists';
    const createResponse = await fetch(createPlaylistUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Mood-Based Playlist',
            description: 'A playlist based on your mood!',
            public: true
        })
    });

    const playlistData = await createResponse.json();
    const playlistId = playlistData.id; // Get playlist id

    // add to playlist
    const addTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    await fetch(addTracksUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: trackIds.map(id => `spotify:track:${id}`) 
        })
    });

    return playlistData.external_urls.spotify; // playlist link
};

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
