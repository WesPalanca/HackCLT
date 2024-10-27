import React, { useState } from 'react';

const ChatBot = () => {
    const [stage, setStage] = useState('main'); // Main menu stage
    const [emotion, setEmotion] = useState('');
    const [journalEntry, setJournalEntry] = useState('');
    const [moodEntries, setMoodEntries] = useState([]);
    const [response, setResponse] = useState('');

    const exitCommands = ['exit', 'bye', 'done'];

    const handleMainMenu = (choice) => {
        if (exitCommands.includes(choice)) {
            setResponse("Goodbye! Take care of yourself.");
            setStage('main');
            return;
        }

        switch (choice) {
            case '1':
                setStage('moodAndJournal');
                break;
            case '2':
                setStage('breathingExercise');
                break;
            case '3':
                setStage('meditation');
                break;
            default:
                setResponse("Invalid option. Please try again.");
        }
    };

    const handleMoodSelection = (emotionChoice) => {
        const emotions = {
            '1': 'Angry',
            '2': 'Sad',
            '3': 'Stressed',
            '4': 'Happy',
            '5': 'Anxious',
        };
        const selectedEmotion = emotions[emotionChoice];

        if (selectedEmotion) {
            setEmotion(selectedEmotion);
            respondToEmotion(selectedEmotion);
            setStage('askWhy');
        } else {
            setResponse("Invalid option. Please try again.");
        }
    };

    const respondToEmotion = (emotion) => {
        const responses = {
            Angry: "I'm sorry you're feeling angry. It's important to acknowledge that emotion. What's making you feel this way?",
            Sad: "I'm sorry you're feeling sad. It's okay to let it out. Would you like to talk about what's on your mind?",
            Stressed: "Stress can be overwhelming. I'm here to help you reflect. What’s causing your stress today?",
            Happy: "That's wonderful! I'm glad you're feeling happy. What’s brought you joy today?",
            Anxious: "Anxiety can be tough to handle. Take a deep breath, and let's work through what’s making you feel anxious.",
        };
        setResponse(responses[emotion]);
    };

    const handleJournalEntry = () => {
        const entry = { date: new Date().toLocaleDateString(), emotion, journal: journalEntry };
        setMoodEntries([...moodEntries, entry]);
        setResponse(`Your mood and journal entry for today have been saved.`);
        setEmotion('');
        setJournalEntry('');
        setStage('main');
    };

    const renderStage = () => {
        switch (stage) {
            case 'main':
                return (
                    <div>
                        <h3>What would you like to do?</h3>
                        <button onClick={() => handleMainMenu('1')}>Mood & Journal</button>
                        <button onClick={() => handleMainMenu('2')}>Breathing Exercise</button>
                        <button onClick={() => handleMainMenu('3')}>Meditation</button>
                        <p>{response}</p>
                    </div>
                );
            case 'moodAndJournal':
                return (
                    <div>
                        <h3>How are you feeling today?</h3>
                        <button onClick={() => handleMoodSelection('1')}>Angry</button>
                        <button onClick={() => handleMoodSelection('2')}>Sad</button>
                        <button onClick={() => handleMoodSelection('3')}>Stressed</button>
                        <button onClick={() => handleMoodSelection('4')}>Happy</button>
                        <button onClick={() => handleMoodSelection('5')}>Anxious</button>
                        <p>{response}</p>
                    </div>
                );
            case 'askWhy':
                return (
                    <div>
                        <h3>Why do you feel {emotion} today?</h3>
                        <textarea
                            value={journalEntry}
                            onChange={(e) => setJournalEntry(e.target.value)}
                            placeholder="Write your thoughts here..."
                        />
                        <button onClick={handleJournalEntry}>Save Entry</button>
                        <p>{response}</p>
                    </div>
                );
            case 'breathingExercise':
                return (
                    <div>
                        <h3>Breathing Exercise</h3>
                        <p>Breathe in... 4... 3... 2... 1...</p>
                        <p>Hold... 3... 2... 1...</p>
                        <p>Exhale... 4... 3... 2... 1...</p>
                        <button onClick={() => setStage('main')}>Back to Main Menu</button>
                        <p>{response}</p>
                    </div>
                );
            case 'meditation':
                return (
                    <div>
                        <h3>Meditation</h3>
                        <p>Close your eyes and focus on your breath. Take deep breaths.</p>
                        <button onClick={() => setStage('main')}>Back to Main Menu</button>
                        <p>{response}</p>
                    </div>
                );
            default:
                return <div>Invalid stage</div>;
        }
    };

    return <div>{renderStage()}</div>;
};

export default ChatBot;
