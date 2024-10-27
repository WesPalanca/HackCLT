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

        // Redirect to create a playlist
        res.send(`
            <form action="/create-playlist" method="POST">
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

// Fetch Top Tracks
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

        // Save the playlist link to localStorage in the frontend
        res.send(`
            <script>
                localStorage.setItem("playlistLink", "${playlistLink}");
                window.location.href = '/home'; // Redirect to Home after saving the link
            </script>
        `);
    } catch (error) {
        console.error(`Create playlist error: ${error.message}`);
        res.status(500).send("Error creating playlist. Please try again.");
    }
});

// Fetch Recommendations with Mood Mapping
const getRecommendations = async (token, mood, topTracks) => {
    const moodToSeedMap = {
        happy: topTracks, // Using top tracks as seeds for happy mood
        sad: topTracks, // Use top tracks for sad mood
        angry: topTracks, // Use top tracks for angry mood
        tired: topTracks, // Use top tracks for tired mood
        anxious: topTracks // Use top tracks for anxious mood
    };

    const seedTracks = moodToSeedMap[mood] || [];

    // Set valence values based on the mood
    let minValence, maxValence;
    switch (mood) {
        case 'happy':
            minValence = 0.6; // Higher valence for happy mood
            maxValence = 1.0;
            break;
        case 'sad':
            minValence = 0.0; // Lower valence for sad mood
            maxValence = 0.4;
            break;
        case 'angry':
            minValence = 0.0; // Low valence for angry mood
            maxValence = 0.3; // Potentially use higher energy tracks with lower valence
            break;
        case 'tired':
            minValence = 0.4; // Medium valence for tired mood
            maxValence = 0.7;
            break;
        case 'anxious':
            minValence = 0.4; // Medium valence for anxious mood
            maxValence = 0.7; // Similar to tired, but can be more calming
            break;
        default:
            minValence = 0.0;
            maxValence = 1.0;
            break;
    }

    try {
        // Fetch recommendations with valence filtering
        const apiUrl = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks.join(',')}&min_valence=${minValence}&max_valence=${maxValence}&limit=20`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Recommendations fetch error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.tracks.map(track => track.id);
    } catch (error) {
        console.error(`Recommendations error: ${error.message}`);
        throw error;
    }
};

// Create Playlist on Spotify
const createPlaylist = async (token, trackIds) => {
    try {
        const userIdResponse = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userIdData = await userIdResponse.json();
        const userId = userIdData.id;

        const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `Mood Playlist - ${new Date().toLocaleDateString()}`,
                description: `A playlist generated based on your mood.`,
                public: true
            })
        });

        const playlistData = await playlistResponse.json();
        const playlistId = playlistData.id;

        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: trackIds.map(id => `spotify:track:${id}`)
            })
        });

        return playlistData.external_urls.spotify; // Return the Spotify playlist URL
    } catch (error) {
        console.error(`Create playlist error: ${error.message}`);
        throw error;
    }
};

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
