import { useEffect, useState } from "react";
import axios from "axios";
import EntryCard from "../components/EntryCard";
import { useNavigate } from "react-router-dom";

const Journal = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    const fetchEntries = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/api/entries/get`, {
                headers: { Authorization: token }
            });
            const { allEntries, success, message } = response.data;
            if (success) {
                console.log("got entries!");
                console.log(response.data);
                setEntries(allEntries);
            } else {
                console.log(message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleDelete = (id) => {
        // Remove the deleted entry from the state immediately
        setEntries((prevEntries) => prevEntries.filter(entry => entry._id !== id));
    };

    return (
        <div className="Journal">
            <h1>Entries</h1>
            <div className="entry-container">
                {entries.map(card => (
                    <div key={card._id}>
                        <EntryCard 
                            mood={card.mood}
                            timestamp={card.timestamp}
                            id={card._id}
                            onDelete={handleDelete} // Pass the delete handler to EntryCard
                        />
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/Tracker')} className="new-entry-button">New Journal Entry</button>
            <button onClick={() => navigate('/Home')} className="back-button">Back to Home</button> {/* Back button */}
        </div>
    );
};

export default Journal;
