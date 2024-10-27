import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleEntry = () =>{
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [entry, setEntry] = useState();
    const [date, setDate] = useState();
    
   

    const fetchEntry = async() =>{
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/api/entry/single`,{
                headers: {Authorization: token},
                params: {entryId: id}
            });
            const { entry, success, message } = response.data;
            if(success){
                console.log(message);
                console.log(response.data);
                setEntry(entry);
                const date = new Date(entry.timestamp);
                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                setDate(formattedDate)
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
        console.log("work");
        fetchEntry();
    }, []);
    return(
        <div className="SingleEntry">
            <h1>{date}</h1>
            <p>{entry ? entry.entry : "Loading..."}</p>
        </div>
    )
}



export default SingleEntry;