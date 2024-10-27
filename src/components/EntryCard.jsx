import axios from "axios";
import { Link } from "react-router-dom";

const EntryCard = ({ timestamp, mood, id }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleDelete = async () =>{
        console.log('delete attempt')
        try{
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${apiUrl}/api/entry/delete`,{
                headers: {Authorization: token},
                params: {entryId: id}
            });
            const {success, message} = response.data;
            if (success){
                console.log(`deleted ${id}`);
                console.log(message);
            }
            else{
                console.log(`failed to delete ${id}`);
                console.log(message);
            }
        }
        catch(error){
            console.log(error);
        }
    }
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
            <button onClick={() => handleDelete()}>X</button>
            
        </div>
    )
}

export default EntryCard;