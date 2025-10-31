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
    try {
      // Create AudioContext for Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (type === "win") {
        // Create uplifting victory sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else {
        // Create ominous loss sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Low ominous tone
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5); // Drop down
        oscillator.type = 'sawtooth'; // Harsh sound for loss
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      // Silently handle audio context errors
      console.log('Web Audio not supported - continuing without sound');
    }
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
      
      {!roundInProgress && !message && (
        <div className="instructions">
          <p className="spooky-instruction">
            💀 <strong>Choose your doom wisely...</strong> 💀
          </p>
          <p className="instruction-text">
            Click on one of your character's stats to battle the mysterious opponent! 
            Will your <span className="highlight">🎨 Creativity</span> triumph over their dark arts? 
            Can your <span className="highlight">💀 Scariness</span> send shivers down their spine?
          </p>
          <p className="warning-text">
            ⚠️ <em>Choose carefully - their stats remain hidden until you commit to battle!</em> ⚠️
          </p>
        </div>
      )}

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

      {/* Modal Dialog for Results and Progress */}
      {(message || roundInProgress) && (
        <div className="modal-overlay">
          <div className="modal-content">
            {message && (
              <>
                <h2 className="modal-result">{message}</h2>
                <div className="revealed-stats">
                  <div className="stat-comparison">
                    <h3>Final Stats:</h3>
                    {stats.map(s => (
                      <div key={s.key} className="stat-row">
                        <span className="stat-label">{s.label}</span>
                        <span className="stat-values">
                          <span className={left[s.key] > right[s.key] ? 'winning-stat' : 'losing-stat'}>
                            {left[s.key]}
                          </span>
                          <span className="vs">vs</span>
                          <span className={right[s.key] > left[s.key] ? 'winning-stat' : 'losing-stat'}>
                            {right[s.key]}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {roundInProgress && (
              <div className="modal-progress">
                <p className="progress-text">👻 Summoning next duel...</p>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${progress}%`,
                      height: '12px',
                      backgroundColor: '#ff6b35',
                      borderRadius: '6px',
                      transition: 'width 0.05s ease-out',
                      boxShadow: '0 0 15px #ff6b35, inset 0 0 8px rgba(255,255,255,0.3)'
                    }}
                  ></div>
                </div>
                <p className="countdown-text">{Math.ceil((5000 - (progress * 50)) / 1000)}s</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
