import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Home = () => {
  // State for the Random Generated Quote
  const [RGQ, setRGQ] = useState({}); // Initialize as an empty object
  const [userName, setUserName] = useState(''); // State to hold user name
  const apiUrl = import.meta.env.VITE_API_URL; // Ensure this is correctly set in your environment

  // Function to fetch the user's name
  const fetchUserName = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user`); // Adjust the endpoint as necessary
      console.log("User Response:", response.data); // Log the response

      if (response.data.success) {
        setUserName(response.data.userName); // Adjust this based on your API response structure
      } else {
        console.error("User fetch failed:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const generateQuote = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/quote`);
      console.log("API Response:", response.data); // Log API response

      const { success, randomQuote } = response.data;
      if (success) {
        setRGQ(randomQuote); // Assuming randomQuote has properties `quote` and `author`
      } else {
        console.error("Quote generation failed:", response.data);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  useEffect(() => {
    fetchUserName(); // Fetch user name on component mount
    generateQuote(); // Fetch a random quote on component mount
  }, []);

  return (
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
        <button className="nav-button">Journal</button>
        <button className="nav-button">Music</button>
        <button className="nav-button">Chat</button>
        <button className="nav-button">Resources</button>
      </div>
      
      {/* Logo Section */}
      <footer className="logo-footer">
        <img src="/path/to/logo.png" alt="App Logo" className="app-logo" />
      </footer>
    </div>
  );
};

export default Home;
