import { Link } from "react-router-dom";

const EntryCard = ({ timestamp, mood, id }) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        <div className="EntryCard">
            <h2><Link to={`/Entry/${id}`}>{mood}</Link></h2>
            <p>{formattedDate}</p>
            
        </div>
    )
}

export default EntryCard;