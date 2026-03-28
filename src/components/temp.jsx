import { useRef, useState, useEffect } from "react";

export default function Player() {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // SET VOLUME
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // UPDATE PROGRESS
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // PLAY / PAUSE
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        alert("Klik tombol Play dulu (autoplay diblok browser)");
      });
      setIsPlaying(true);
    }
  };

  // SEEK
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    audio.currentTime = (e.target.value / 100) * audio.duration;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/cover_joji.png" alt="cover" style={styles.cover} />

        <h2 style={styles.title}>🎵 Joji - Glimpse Of Us</h2>

        <audio ref={audioRef} src="/Joji.mp3" loop />

        <button onClick={togglePlay} style={styles.button}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* PROGRESS */}
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          style={styles.slider}
        />

        {/* VOLUME */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },
  card: {
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    width: "320px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  cover: {
    width: "100%",
    borderRadius: "15px",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    margin: "15px 0",
    borderRadius: "10px",
    border: "none",
    background: "#00c853",
    color: "#fff",
    cursor: "pointer",
  },
  slider: {
    width: "100%",
    marginTop: "10px",
  },
};