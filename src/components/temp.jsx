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
    src: "/badut-baru.mp3",
    cover: "/cover_badut_baru.jpg",
  },
  // tambah lagu di sini...
];

// ─── HELPER ────────────────────────────────────────────────
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── SVG ICONS ─────────────────────────────────────────────
const IconPrev = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
  </svg>
);
const IconNext = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM16 6h2v12h-2z"/>
  </svg>
);
const IconPlay = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);
const IconPause = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);
const IconLoop = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
  </svg>
);
const IconShuffle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconVolLow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
  </svg>
);
const IconVolHigh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

// ─── COMPONENT ─────────────────────────────────────────────
export default function Player() {
  const audioRef     = useRef(null);
  const isPlayingRef = useRef(false);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [volume,       setVolume]       = useState(0.7);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [isLooping,    setIsLooping]    = useState(false);
  const [isShuffle,    setIsShuffle]    = useState(false);
  const [liked,        setLiked]        = useState({});

  // sync ref
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const track = playlist[currentTrack];

  // ── Navigasi ────────────────────────────────────────────
  const nextTrack = useCallback(() => {
    if (isShuffle) {
      let next;
      do { next = Math.floor(Math.random() * playlist.length); }
      while (next === currentTrack && playlist.length > 1);
      setCurrentTrack(next);
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  }, [isShuffle, currentTrack]);

  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, []);

  // ── Ganti lagu → reload & autoplay ──────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (isPlayingRef.current) audio.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // ── Volume ───────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ── Listeners ───────────────────────────────────────────
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
        audio.currentTime = 0;
        audio.play().catch(() => {});
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

  // ── Play / Pause ─────────────────────────────────────────
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => alert("Klik Play untuk memulai"));
      setIsPlaying(true);
    }
  };

  // ── Seek ─────────────────────────────────────────────────
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  };

  return (
    <div className="player-page">
      <div className="player-card">

        {/* ── Cover Hero ─────────────────────────────────── */}
        <div className="cover-hero">
          <div
            className="cover-blur-bg"
            style={{ backgroundImage: `url(${track.cover})` }}
          />
          <div className="cover-art-wrapper">
            <img
              src={track.cover}
              alt={track.title}
              className={`player-cover ${isPlaying ? "playing" : ""}`}
              onError={(e) => { e.currentTarget.src = "/cover_joji.png"; }}
            />
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="player-body">

          {/* Track Info */}
          <div className="track-info">
            <div className="track-meta">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist}</div>
            </div>
            <button
              className={`btn-like ${liked[currentTrack] ? "liked" : ""}`}
              onClick={() => setLiked((prev) => ({ ...prev, [currentTrack]: !prev[currentTrack] }))}
              title="Like"
            >
              <IconHeart filled={!!liked[currentTrack]} />
            </button>
          </div>

          {/* Audio */}
          <audio ref={audioRef} src={track.src} />

          {/* Progress */}
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

          {/* Controls */}
          <div className="controls">
            <button
              className={`btn-shuffle ${isShuffle ? "active" : ""}`}
              onClick={() => setIsShuffle((v) => !v)}
              title={isShuffle ? "Shuffle: On" : "Shuffle: Off"}
            >
              <IconShuffle />
            </button>
            <button className="btn-nav" onClick={prevTrack} title="Previous">
              <IconPrev />
            </button>
            <button className="btn-play" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button className="btn-nav" onClick={nextTrack} title="Next">
              <IconNext />
            </button>
            <button
              className={`btn-loop ${isLooping ? "active" : ""}`}
              onClick={() => setIsLooping((v) => !v)}
              title={isLooping ? "Loop: On" : "Loop: Off"}
            >
              <IconLoop />
            </button>
          </div>

          {/* Volume */}
          <div className="volume-row">
            <span className="volume-icon"><IconVolLow /></span>
            <input
              type="range"
              className="styled-range"
              min="0" max="1" step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
            <span className="volume-icon"><IconVolHigh /></span>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Playlist */}
          <div className="playlist-header">Up Next</div>
          <div className="playlist-list">
            {playlist.map((item, index) => (
              <div
                key={index}
                className={`playlist-item ${index === currentTrack ? "active" : ""}`}
                onClick={() => {
                  isPlayingRef.current = true;
                  setIsPlaying(true);
                  setCurrentTrack(index);
                }}
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="playlist-thumb"
                  onError={(e) => { e.currentTarget.src = "/cover_joji.png"; }}
                />
                <div className="playlist-text">
                  <div className="playlist-name">{item.title}</div>
                  <div className="playlist-artist">{item.artist}</div>
                </div>
                <div className="playlist-right">
                  {index === currentTrack && isPlaying ? (
                    <div className="playing-bars">
                      <span /><span /><span />
                    </div>
                  ) : (
                    <span className="playlist-num">{index + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
