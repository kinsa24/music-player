import { useRef, useState, useEffect, useCallback } from "react";
import "./temp.css";

// ─── PLAYLIST ──────────────────────────────────────────────
const playlist = [
  {
    title: "Glimpse Of Us",
    artist: "Joji",
    src: "/Joji.mp3",
    cover: "/cover_joji.png",
  },
  {
    title: "Badut Baru",
    artist: "dbatlayar",
    src: "/badut baru.mp3",
    cover: "/cover_505.png",
  },
  {
    title: "Creep",
    artist: "Radiohead",
    src: "/creep.mp3",
    cover: "/cover_creep.png",
  },
  // tambah lagu di sini...
];

// ─── HELPER: format detik → mm:ss ──────────────────────────
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── COMPONENT ─────────────────────────────────────────────
export default function Player() {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [progress, setProgress]         = useState(0);
  const [volume, setVolume]             = useState(0.7);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [isLooping, setIsLooping]       = useState(false);

  const track = playlist[currentTrack];

  // ── Navigasi ──────────────────────────────────────────────
  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, []);

  // ── Ganti lagu → reload & autoplay ───────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) audio.play().catch(() => {});
  }, [currentTrack]);

  // ── Volume ────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ── Listeners (timeupdate, ended, loadedmetadata) ─────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onLoaded = () => setDuration(audio.duration);
    const onEnded  = () => {
      if (isLooping) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended",          onEnded);

    return () => {
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended",          onEnded);
    };
  }, [currentTrack, nextTrack, isLooping]);

  // ── Play / Pause ──────────────────────────────────────────
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => alert("Autoplay diblok browser, klik Play dulu"));
      setIsPlaying(true);
    }
  };

  // ── Seek ──────────────────────────────────────────────────
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  };

  return (
    <div className="player-page">
      <div className="player-card">

        {/* ── Cover ──────────────────────────────────────── */}
        <div className="cover-wrapper">
          <img
            src={track.cover}
            alt={track.title}
            className={`player-cover ${isPlaying ? "playing" : ""}`}
          />
        </div>

        {/* ── Track Info ─────────────────────────────────── */}
        <div className="track-info">
          <div className="track-title">{track.title}</div>
          <div className="track-artist">{track.artist}</div>
        </div>

        {/* ── Audio (hidden) ─────────────────────────────── */}
        <audio ref={audioRef} src={track.src} />

        {/* ── Progress ───────────────────────────────────── */}
        <div className="progress-section">
          <div className="time-row">
            <span className="time-label">{formatTime(currentTime)}</span>
            <span className="time-label">{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            className="styled-range progress-track"
            style={{ "--progress": `${progress}%` }}
            value={progress}
            onChange={handleSeek}
          />
        </div>

        {/* ── Controls ───────────────────────────────────── */}
        <div className="controls">
          <button className="btn-nav" onClick={prevTrack}>⏮</button>
          <button className="btn-play" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="btn-nav" onClick={nextTrack}>⏭</button>
          <button
            className={`btn-loop ${isLooping ? "active" : ""}`}
            onClick={() => setIsLooping((v) => !v)}
            title={isLooping ? "Loop: On" : "Loop: Off"}
          >
            🔁
          </button>
        </div>

        {/* ── Volume ─────────────────────────────────────── */}
        <div className="volume-row">
          <span className="volume-icon">🔈</span>
          <input
            type="range"
            className="styled-range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <span className="volume-icon">🔊</span>
        </div>

        {/* ── Divider ────────────────────────────────────── */}
        <div className="divider" />

        {/* ── Playlist ───────────────────────────────────── */}
        <div className="playlist-header">Queue</div>
        <div className="playlist-list">
          {playlist.map((item, index) => (
            <div
              key={index}
              className={`playlist-item ${index === currentTrack ? "active" : ""}`}
              onClick={() => {
                setCurrentTrack(index);
                setIsPlaying(true);
              }}
            >
              <span className="playlist-num">
                {index === currentTrack ? "♪" : index + 1}
              </span>
              <span className="playlist-name">
                {item.artist} — {item.title}
              </span>
              {index === currentTrack && isPlaying && (
                <span className="playing-dot" />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}