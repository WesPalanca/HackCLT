import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import trashcan from '../assets/trashcan.svg';

const EntryCard = ({ timestamp, mood, id, onDelete }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isDeleting, setIsDeleting] = useState(false); // Local state for animation

    const handleDelete = async () => {
        setIsDeleting(true); // Trigger the fade-out animation

        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${apiUrl}/api/entry/delete`, {
                headers: { Authorization: token },
                params: { entryId: id }
            });
            const { success, message } = response.data;
            if (success) {
                console.log(`deleted ${id}`);
                console.log(message);
                
                // Wait for the animation to complete before notifying the parent to remove this entry
                setTimeout(() => {
                    onDelete(id); // Notify the parent to remove this entry
                }, 500); // Match this with the CSS transition duration
            } else {
                console.log(`failed to delete ${id}`);
                console.log(message);
                setIsDeleting(false); // Reset animation state on failure
            }
        } catch (error) {
            console.log(error);
            setIsDeleting(false); // Reset animation state on error
        }
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className={`EntryCard ${isDeleting ? "fade-out" : ""}`}>
            <h2><Link to={`/Entry/${id}`}>{mood}</Link></h2>
            <p>{formattedDate}</p>
            <button className="delete-button" onClick={handleDelete}><img className="entry-img" src={trashcan} alt="" /></button>
        </div>
    );
};

export default EntryCard;