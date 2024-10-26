import { useNavigate } from "react-router-dom";

const Feeling = () => {
    const navigate = useNavigate();
    const receiveFeelings = (mood) => {
        localStorage.setItem("mood", mood);
        console.log("Feeling saved:", mood);
        navigate('/Home');
    };

    return (
        <div className="Feeling">
            <h1>How are you feeling today?</h1>
            <div>
                <button type="button" onClick={() => receiveFeelings("Happy")}>Happy</button>
                <button type="button" onClick={() => receiveFeelings("Sad")}>Sad</button>
                <button type="button" onClick={() => receiveFeelings("Angry")}>Angry</button>
                <button type="button" onClick={() => receiveFeelings("Tired")}>Tired</button>
                <button type="button" onClick={() => receiveFeelings("Anxious")}>Anxious</button>
            </div>
        </div>
    );
};

export default Feeling;
