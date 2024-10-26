import axios from "axios";
import React, { useEffect, useState } from "react";
import Quote from "../components/Quote";
import { useNavigate } from "react-router-dom";


const Home = () =>{
    // Random Generated Quote
    const [RGQ, setRGQ] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const generateQuote = async () =>{
        try{
            const response = await axios.get(`${apiUrl}/api/quote`);
            const { success, randomQuote } = response.data;
            if (success){
                setRGQ(randomQuote);
            } 
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() =>{
        generateQuote();
    }, [])
    return (
        <div className="Home">
            <Quote 
            author={RGQ.author}
            quote={RGQ.quote}
            />
            <button onClick={() => navigate('/Tracker')}>+ Journal</button>
            <button onClick={() => navigate('/Journal')}>Journal</button>
        </div>
    )
}

export default Home;