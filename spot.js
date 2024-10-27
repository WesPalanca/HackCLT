import express from 'express';
import fetch from 'node-fetch';
import querystring from 'querystring';
import dotenv from 'dotenv';

const app = express();
const port = 8888;
dotenv.config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'http://localhost:8888/callback';
const scopes = 'user-top-read playlist-modify-public';

app.use(express.urlencoded({ extended: true }));

// Login and Authorization Route
app.get('/login', (req, res) => {
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scopes
    })}`;
    res.redirect(authUrl);
});

// Callback Route - Handle Authorization Code
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
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

        if (!response.ok) {
            throw new Error(`Token request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // Fetch top tracks 
        const topTracks = await fetchTopTracks(accessToken);

        // mood selection form with dropdown
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
    } catch (error) {
        console.error(`Callback error: ${error.message}`);
        res.status(500).send("Error during authorization callback. Please try logging in again.");
    }
});

//  Top Tracks
const fetchTopTracks = async (token) => {
    try {
        const apiUrl = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5';

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
    } catch (error) {
        console.error(`Top tracks fetch error: ${error.message}`);
        throw error; 
    }
};

app.post('/create-playlist', async (req, res) => {
    const { access_token, mood, top_tracks } = req.body;
    const trackIds = top_tracks.split(',');

    try {
        const recommendedTracks = await getRecommendations(access_token, mood, trackIds);

        // Generate link
        const playlistLink = await createPlaylist(access_token, recommendedTracks);

        res.send(`Playlist created! You can find it here: <a href="${playlistLink}" target="_blank">${playlistLink}</a>`);
    } catch (error) {
        console.error(`Create playlist error: ${error.message}`);
        res.status(500).send("Error creating playlist. Please try again.");
    }
});

// Fetch Recommendations with Mood Mapping
const getRecommendations = async (token, mood, baseTracks) => {
    try {
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
    } catch (error) {
        console.error(`Recommendations fetch error: ${error.message}`);
        throw error;
    }
};

// Map mood to Spotify valence
const moodValence = (mood) => {
    const moodMap = {
        happy: 0.8,
        sad: 0.2,
        angry: 0.4,
        tired: 0.3,
        anxious: 0.5
    };
    return moodMap[mood.toLowerCase()] || 0.5;
};

// Create Playlist in Spotify
const createPlaylist = async (token, trackIds) => {
    try {
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

        if (!createResponse.ok) {
            throw new Error(`Error creating playlist: ${createResponse.status} ${createResponse.statusText}`);
        }

        const playlistData = await createResponse.json();
        const playlistId = playlistData.id;

        // Add tracks
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

        return playlistData.external_urls.spotify;
    } catch (error) {
        console.error(`Playlist creation error: ${error.message}`);
        throw error;
    }
};

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
