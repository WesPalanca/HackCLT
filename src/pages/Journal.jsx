import { useEffect, useState } from "react";
import axios from "axios";
import EntryCard from "../components/EntryCard";
const Journal = () =>{
    const apiUrl = import.meta.env.VITE_API_URL;
    const [entries, setEntries] = useState([]);

    const fetchEntries = async () =>{
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/api/entries/get`, {
                headers: {Authorization: token}
            });
            const { allEntries, success, message} = response.data;
            if (success){
                console.log("got entries!");
                console.log(response.data);
                setEntries(allEntries);
            }
            else{
                console.log(message);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(() =>{
        fetchEntries();
    }, [])

    return (
        <div className="Journal">
            <h1>Entries</h1>
           <div className="entry-container">
            {entries.map(card =>
                    <div key={card._id}>
                        <EntryCard 
                            mood={card.mood}
                            timestamp={card.timestamp}
                            id={card._id}
                        />
                    </div>
                )}
           </div>
        </div>
    )
}


export default Journal;