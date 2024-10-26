import axios from "axios";
import React, { useEffect, useState } from "react";
import Quote from "../components/Quote";


const Home = () =>{
    // Random Generated Quote
    const [RGQ, setRGQ] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
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
        </div>
    )
}

export default Home;