import axios from 'axios';
import { useState } from 'react';

const Tracker = () =>{
    const apiUrl = import.meta.env.VITE_API_URL;
    const [entry, setEntry] = useState("");
    const handleEntry = async (e) =>{
        e.preventDefault();
        try{
            const token = localStorage.getItem("token");
            const response = await axios.post(`${apiUrl}/api/auth/entry/add`,{
                entry: entry,
            },{
                headers: { Authorization: token}
            });
            
            const { success, message } = response.data;
            if (success){
                console.log(message);
            }
            else{
                console.log("Failed to add journal entry");
            }

        }
        catch(error){
            console.log(error);
        }
        
    }
    return (
        <div className="Tracker">
            <form onSubmit={handleEntry}>
                    <h2>Journal</h2>
                    <div className="form-group">
                        <div className="form-control"><textarea placeholder="" onChange={(e) => setEntry(e.target.value)} type="text" /></div>
                    </div>
                    <button type='submit'>Submit</button>
                    
                </form>

        </div>
    )
}

export default Tracker;