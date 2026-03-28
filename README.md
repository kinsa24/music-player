🎵 Music Player — Joji Edition

by Kinsa

📌 Overview

Music Player ini adalah aplikasi web sederhana berbasis React yang dirancang untuk memutar satu lagu secara lokal dengan pengalaman pengguna yang clean, modern, dan elegan.

Aplikasi ini dibangun sebagai eksplorasi dasar dalam:

manipulasi audio di browser
state management React
serta peningkatan UI/UX pada komponen media player

Fokus utama proyek ini adalah kontrol penuh terhadap audio tanpa bergantung pada layanan pihak ketiga seperti YouTube atau Spotify.

🚀 Features
▶️ Play & Pause control
🔁 Auto loop (lagu berulang tanpa batas)
🎚️ Progress bar interaktif (bisa di-drag)
🔊 Volume control
🖼️ Custom album cover
🎨 UI modern dengan styling elegan
⚡ Lightweight & tanpa dependency tambahan
🧠 Tech Stack
🧩 Frontend
React
JSX (JavaScript XML)
⚙️ Runtime & Build Tool
Vite
🎨 Styling
CSS (custom styling + modern range input design)
🏗️ Project Structure
music-player/
├── public/
│   ├── Joji.mp3
│   └── cover_joji.png
│
├── src/
│   ├── components/
│   │   └── Player.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
⚙️ Core Logic Explanation
1. Audio Control

Aplikasi menggunakan elemen HTML native:

<audio />

yang diakses melalui React useRef:

const audioRef = useRef(null);

Ref ini memungkinkan kontrol langsung terhadap:

play()
pause()
currentTime
volume
2. State Management

Beberapa state utama:

isPlaying → status play/pause
progress  → posisi lagu (%)
volume    → volume audio

State ini dikontrol menggunakan:

useState()
3. Progress Tracking

Progress bar dihitung dengan:

(audio.currentTime / audio.duration) * 100

dan diperbarui secara realtime melalui event:

audio.addEventListener("timeupdate", ...)
4. Seek Function (Drag Progress)

Saat user menggeser slider:

audio.currentTime = (value / 100) * audio.duration;

Ini memungkinkan navigasi manual dalam lagu.

5. Volume Control

Volume diatur dengan:

audio.volume = value;

dengan range:

0 → 1
🎨 UI & UX Design

Beberapa prinsip yang digunakan:

Dark mode aesthetic
Gradient background
Rounded card layout
Custom progress bar (bukan default HTML)
Micro-interaction (hover & smooth transition)
⚠️ Important Notes
Autoplay tidak langsung berjalan karena kebijakan browser
User harus melakukan interaksi (klik Play) terlebih dahulu
Audio disimpan secara lokal di folder /public
📥 Installation & Run
npm install
npm run dev
🎯 Purpose of This Project

Proyek ini dibuat untuk:

memahami cara kerja audio di browser
melatih penggunaan React Hooks
meningkatkan kemampuan UI/UX frontend
membangun dasar sebelum masuk ke project yang lebih kompleks
🔥 Future Improvements

Beberapa pengembangan yang bisa dilakukan:

⏱️ Display waktu lagu (current / duration)
🎧 Playlist multi lagu
🌊 Audio visualizer (Web Audio API)
💾 Save last position (localStorage)
🎵 Animasi cover (rotate saat play)
👤 Author

Kinsa
Frontend Developer (Learning Phase → Scaling Up 🚀)

🧾 Closing

Project ini mungkin sederhana secara fitur, tetapi secara fundamental mencakup konsep penting dalam pengembangan frontend modern:

state management, event handling, DOM manipulation, dan UI refinement.