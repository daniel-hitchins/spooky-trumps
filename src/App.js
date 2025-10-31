import React, { useState, useEffect } from "react";
import "./App.css";

// 👻 Garbage Pail Kids-style UX team with PNG images
const spookyTeam = [
  { firstName: "alanna", displayName: "🍌 Alanna Banana-Boo the UI Wizard", role: "User Experience Designer", image: "./images/alanna.png" },
  { firstName: "alex", displayName: "🪓 Axed Alex the Pixel Pirate", role: "Principal Product Designer", image: "./images/alex.png" },
  { firstName: "beth", displayName: "🧪 Buggy Beth the Prototype Poltergeist", role: "Senior UX Designer", image: "./images/beth.png" },
  { firstName: "chris", displayName: "⚙️ Creepy Chris the Button Bandit", role: "Senior Product Designer", image: "./images/chris.png" },
  { firstName: "christian", displayName: "👻 Christian Cranky the Flow Ghost", role: "Director of Experience & Service Design", image: "./images/christian.png" },
  { firstName: "daniel", displayName: "👻 Debuggin' Dan the ARIA Apparition", role: "Senior Accessibility Engineer", image: "./images/dan.png" },
  { firstName: "holly", displayName: "🔮 Holly Hocus-Pocus the Insight Witch", role: "Senior User Researcher", image: "./images/holly.png" },
  { firstName: "james", displayName: "💻 Jumpy James the Code Gremlin", role: "Principal UX Engineer", image: "./images/james.png" },
  { firstName: "julie", displayName: "🧠 Jelly Julie the Grid Goblin", role: "Principal UX Designer", image: "./images/julie.png" },
  { firstName: "liam", displayName: "🐺 Laggy Liam the Wireframe Werewolf", role: "Senior User Experience Designer", image: "./images/liam.png" },
  { firstName: "lisa", displayName: "🦙 Lisa Llama-Lumps the Survey Sorcerer", role: "Research & Service Design Lead", image: "./images/lisa.png" },
  { firstName: "louise", displayName: "😈 Loopy Louise the Strategy Sprite", role: "Head of Experience Design", image: "./images/louise.png" },
  { firstName: "morven", displayName: "🪄 Morbid Morven the Journey Mummy", role: "Principal Experience Designer", image: "./images/morven.png" },
  { firstName: "rachel", displayName: "💉 Remedy Rachel the Healthcare Haunt", role: "Senior UX Designer - Health and Care", image: "./images/rachel.png" },
  { firstName: "reeya", displayName: "🧪 Reeya Rumble the Prototype Pixie", role: "Senior UX Designer", image: "./images/reeya.png" },
  { firstName: "sam", displayName: "📊 Spooky Sam the Data Dragon", role: "Product Analytics Executive", image: "./images/sam.png" },
  { firstName: "samuel", displayName: "📜 Skeletal Samuel the Copy Catastrophe", role: "Senior Product Designer - Content", image: "./images/samuel.png" },
  { firstName: "steve", displayName: "📈 Spreadsheet Steve the Number Ninja", role: "Group Product Owner", image: "./images/steve.png" },
  { firstName: "zoe", displayName: "🖌️ Zany Zoe the Figma Fiend", role: "Senior UX Designer", image: "./images/zoe.png" },
  { firstName: "jonathan", displayName: "🎨 Jonathan Juggle the Interface Imp", role: "Principal UI Designer", image: "./images/jonathan.png" }
];

const getRandomCard = () => spookyTeam[Math.floor(Math.random() * spookyTeam.length)];
const randomStat = () => Math.floor(Math.random() * 10) + 1;

function App() {
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);
  const [statsRevealed, setStatsRevealed] = useState(false);
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const stats = [
    { key: "creativity", label: "🎨 Creativity" },
    { key: "scariness", label: "💀 Scariness" },
    { key: "snackPower", label: "🍫 Snack Power" },
    { key: "empathy", label: "❤️ Empathy" }
  ];

  const randomCards = () => {
    const createCard = (card) => ({
      ...card,
      creativity: randomStat(),
      scariness: randomStat(),
      snackPower: randomStat(),
      empathy: randomStat()
    });
    
    // Ensure we get two different characters
    const leftCard = getRandomCard();
    let rightCard = getRandomCard();
    while (rightCard.firstName === leftCard.firstName) {
      rightCard = getRandomCard();
    }
    
    setLeft(createCard(leftCard));
    setRight(createCard(rightCard));
    setMessage("");
    setStatsRevealed(false);
    setRoundInProgress(false);
    setProgress(0);
  };

  const playSound = (type) => {
    const audio = new Audio(
      type === "win"
        ? "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
        : "https://actions.google.com/sounds/v1/foley/punch_3.ogg"
    );
    audio.volume = 0.3;
    
    // Handle audio loading errors gracefully
    audio.addEventListener('error', () => {
      console.log('Audio failed to load - continuing without sound');
    });
    
    audio.play().catch(() => {
      // Silently handle play errors (e.g., user hasn't interacted with page yet)
      console.log('Audio play failed - continuing without sound');
    });
  };

  const compareStat = (stat) => {
    if (!left || !right || roundInProgress) return;
    setRoundInProgress(true);
    setStatsRevealed(true);
    const win = left[stat] > right[stat];
    setMessage(win ? `🎃 You Win! (${stat.toUpperCase()})` : `💀 You Lose! (${stat.toUpperCase()})`);
    playSound(win ? "win" : "lose");
    setScore(prev => ({
      wins: prev.wins + (win ? 1 : 0),
      losses: prev.losses + (win ? 0 : 1)
    }));
    
    // Auto-advance to next round after showing result (longer delay)
    const totalTime = 5000;
    const interval = 50; // Update every 50ms for smooth animation
    let elapsed = 0;
    
    const progressInterval = setInterval(() => {
      elapsed += interval;
      const progressPercent = (elapsed / totalTime) * 100;
      setProgress(progressPercent);
      
      if (elapsed >= totalTime) {
        clearInterval(progressInterval);
        randomCards();
      }
    }, interval);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      randomCards();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="fog"></div>
        <h1 className="loading-text">🪄 Summoning your UX spirits...</h1>
      </div>
    );
  }

  return (
    <div className="App fade-in">
      <h1>UX Team Creepy-Cards: Garbage Pail Chaos 🎃</h1>
      <p>Wins: {score.wins} | Losses: {score.losses}</p>

      <div className="cards">
        {left && (
          <div className="card">
            <img src={left.image} alt={left.firstName} className="card-image" />
            <h2>{left.displayName}</h2>
            <p>{left.role}</p>
            {stats.map(s => <button key={s.key} onClick={() => compareStat(s.key)} disabled={roundInProgress}>{s.label}: {left[s.key]}</button>)}
          </div>
        )}

        {right && (
          <div className="card">
            <img src={right.image} alt={right.firstName} className="card-image" />
            <h2>{right.displayName}</h2>
            <p>{right.role}</p>
            {stats.map(s => (
              <p key={s.key}>
                {s.label}: {statsRevealed ? right[s.key] : '???'}
              </p>
            ))}
          </div>
        )}
      </div>

      {message && <h2 className="result">{message}</h2>}
      
      {roundInProgress && (
        <div className="progress-container">
          <p style={{ opacity: 0.8, fontStyle: 'italic', margin: '10px 0 5px 0' }}>👻 Summoning next duel...</p>
          <div style={{
            width: '300px',
            height: '8px',
            backgroundColor: '#333',
            borderRadius: '4px',
            border: '1px solid #666',
            overflow: 'hidden',
            margin: '0 auto'
          }}>
            <div 
              className="progress-bar"
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#ff6b35',
                borderRadius: '3px',
                transition: 'width 0.05s ease-out',
                boxShadow: '0 0 10px #ff6b35, inset 0 0 5px rgba(255,255,255,0.3)'
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
