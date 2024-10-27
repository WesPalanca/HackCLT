import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // State for the Random Generated Quote
  const [RGQ, setRGQ] = useState({}); // Initialize as an empty object
  const [userName, setUserName] = useState(''); // State to hold user name
  const [playlistLink, setPlaylistLink] = useState(''); // State for Spotify playlist link
  const apiUrl = import.meta.env.VITE_API_URL; // Ensure this is correctly set in your environment
  const navigate = useNavigate();

  const generateQuote = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/quote`);
      const { success, randomQuote } = response.data;
      if (success) {
        setRGQ(randomQuote); // Assuming randomQuote has properties `quote` and `author`
      } else {
        console.error("Quote generation failed:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to fetch the user's name
  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/auth/user`, {
        headers: { Authorization: token }
      }); // Adjust the endpoint as necessary
      console.log("User Response:", response.data); // Log the response

      if (response.data.success) {
        setUserName(response.data.firstName); // Adjust this based on your API response structure
      } else {
        console.error("User fetch failed:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  useEffect(() => {
    fetchUserName(); // Fetch user name on component mount
    generateQuote(); // Fetch a random quote on component mount
    setPlaylistLink(localStorage.getItem("playlistLink") || ""); // Get playlist link from localStorage
  }, []);

  const handleMusicButtonClick = () => {
    if (playlistLink) {
      window.open(playlistLink, '_blank'); // Open the playlist link in a new tab
    } else {
      alert("No playlist available. Please create a playlist first.");
    }
  };

  return (
    <div className="Home">
        <div className="home-container">
            {/* Welcome Section */}
            <header className="welcome-header">
                <h1>Welcome, {userName || 'User'}!</h1> {/* Display userName or a fallback */}
            </header>
            
            {/* Quote Section */}
            <section className="quote-section">
                {RGQ.quote ? ( // Check if RGQ.quote is available
                    <blockquote>
                        <p>"{RGQ.quote}"</p>
                        <footer>{RGQ.author}</footer> {/* Display author if available */}
                    </blockquote>
                ) : (
                    <p>Loading...</p> // Display a loading message while fetching quote
                )}
            </section>
            
            {/* Button Grid */}
            <div className="button-grid">
                <button className="nav-button" onClick={() => navigate('/Journal')}>Journal</button>
                <button className="nav-button" onClick={handleMusicButtonClick}>Music</button>
                <button className="nav-button" onClick={() => navigate('/ChatBot')}>Chat</button>
                <button className="nav-button" onClick={() => navigate('/Resources')}>Resources</button>
            </div>
            
            {/* Logo Section */}
            <footer className="logo-footer">
                <img src="../src/assets/logo.png" alt="App Logo" className="app-logo" />
            </footer>
        </div>
    </div>
  );
}

export default Home;
