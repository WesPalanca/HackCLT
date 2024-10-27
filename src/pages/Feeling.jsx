import { useNavigate } from "react-router-dom";
import AngryImage from "../assets/Angry.png";
import AnxiousImage from "../assets/Anxious.png";
import HappyImage from "../assets/Happy.png";
import SadImage from "../assets/Sad.png";
import TiredImage from "../assets/Tired.png";

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
                <button type="button" className="image-icon" onClick={() => receiveFeelings("Happy")}><img src={HappyImage} alt="Happy" /></button>
                <button type="button" className="image-icon" onClick={() => receiveFeelings("Sad")}><img src={SadImage} alt="Sad" /></button>
                <button type="button" className="image-icon" onClick={() => receiveFeelings("Angry")}><img src={AngryImage} alt="Angry" /></button>
                <button type="button" className="image-icon" onClick={() => receiveFeelings("Tired")}><img src={TiredImage} alt="Tired" /></button>
                <button type="button" className="image-icon" onClick={() => receiveFeelings("Anxious")}><img src={AnxiousImage} alt="Anxious" /></button>
            </div>
        </div>
    );
};

export default Feeling;
