import { useNavigate } from "react-router-dom";

const Exercises = () => {
    const breathingExercise = 'https://www.youtube.com/watch?v=YqNeA6fYWLM'
    const meditationExercise = 'https://www.youtube.com/watch?v=1W7oUZ8EVbI&list=PLYxtGyYUCbEFLejo3Hv1LLL1GX0fNpmcM'
    const navigate = useNavigate();
    return (
        <div>
            <h1>Mental Health Exercises</h1>
            <button className="e-btn" onClick={() => window.open(breathingExercise, "_blank")}>Breathing Exercises</button>
            <button className="e-btn" onClick={() => window.open(meditationExercise, "_blank")}>Meditation</button>
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
    )
}

export default Exercises;