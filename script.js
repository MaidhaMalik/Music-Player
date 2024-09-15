document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audio');
    const currentSongTitle = document.querySelector('.current-song-title');
    const currentArtist = document.querySelector('.current-artist');
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.getElementById('progress-bar');
    const volumeControl = document.getElementById('volume');
    const playlistContainer = document.getElementById('playlist-container');
    const topPicksContainer = document.getElementById('top-picks-container');

    let currentSongIndex = 0;
    let currentPlaylist = [];

    function loadSong(index) {
        const song = currentPlaylist[index];
        audio.src = song.src;
        currentSongTitle.textContent = song.title;
        currentArtist.textContent = song.artist;
    }

    function playSong() {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function pauseSong() {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = currentPlaylist.length - 1;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > currentPlaylist.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    playPauseBtn.addEventListener('click', () => {
        const isPlaying = !audio.paused;
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    volumeControl.addEventListener('input', () => {
        audio.volume = volumeControl.value / 100;
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
    });

    audio.addEventListener('ended', nextSong);

    // Featured Artist
    const artistSongs = {
        "Artist 1": [
            { title: "Woh Mere Bin", src: "music/Woh Mere Bin - Atif Aslam 128 Kbps.mp3", artist: "Atif Aslam" },
            { title: "Baarishein", src: "music/Baarishein - Atif Aslam, Arko 128 Kbps.mp3", artist: "Atif Aslam" }
        ],
        "Artist 2": [
            { title: "Chori Chori", src: "music/Chori Chori - Ali Zafar 128 Kbps.mp3", artist: "Ali Zafar" },
            { title: "Husn", src: "music/HUSN - Ali Zafar 128 Kbps.mp3", artist: "Ali Zafar" }
        ],
        "Artist 3": [
            { title: "Teri Yaad", src: "music/Teri Yaad - Rahat Fateh Ali Khan 128 Kbps.mp3", artist: "Rahat Fateh Ali Khan" },
            { title: "Dekhte Dekhte", src: "music/Dekhte Dekhte (Rahat Fateh Ali Khan Version) - Batti Gul Meter Chalu 128 Kbps.mp3", artist: "Rahat Fateh Ali Khan" }
        ],
        "Artist 4": [
            { title: "Kabhi Mai Kabhi Tum", src: "music/Kabhi Mai Kabhi Tum - Asim Azhar 128 Kbps.mp3", artist: "Asim Azhar" },
            { title: "Chand Mahiya", src: "music/Chand Mahiya - Asim Azhar 128 Kbps.mp3", artist: "Asim Azhar" }
        ]
    };

    // Top Picks data
    const topPicks = [
        { title: "Train of Eternity", src: "music/Romeo - Train of Eternity.mp3", artist: "Romeo" },
        { title: "Groovy Panda", src: "music/IamDayLight - Groovy Panda.mp3", artist: "IamDayLight" },
        { title: "Chasing You", src: "music/Supermans Feinde - Chasin You.mp3", artist: "Supermans Feinde" }
    ];

    function createPlaylist(songs, container) {
        let playlistHTML = '<ul class="playlist">';
        songs.forEach((song, index) => {
            playlistHTML += `
                <li data-index="${index}" data-src="${song.src}">
                    <span class="song-info">
                        <span class="song-title">${song.title}</span>
                        <span class="artist">${song.artist}</span>
                    </span>
                    <button class="like-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </li>
            `;
        });
        playlistHTML += '</ul>';
        container.innerHTML = playlistHTML;
        setupLikeButtonListeners(container);
    }

    function setupLikeButtonListeners(container) {
        const likeButtons = container.querySelectorAll('.like-btn');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const icon = btn.querySelector('i');
                icon.classList.toggle('fas'); 
                icon.classList.toggle('far'); 
            });
        });
    }

    function setupPlaylistListeners(container) {
        container.querySelectorAll('.playlist li').forEach((item, index) => {
            item.addEventListener('click', () => {
                currentSongIndex = index;
                currentPlaylist = [...container.querySelectorAll('.playlist li')].map(li => ({
                    title: li.querySelector('.song-title').textContent,
                    src: li.getAttribute('data-src'),
                    artist: li.querySelector('.artist').textContent
                }));
                loadSong(currentSongIndex);
                playSong();
            });
        });
    }

    function updatePlaylist(playlist, container) {
        createPlaylist(playlist, container);
        setupPlaylistListeners(container);
    }

    function handleArtistClick(artistElement) {
        const artist = artistElement.getAttribute('data-artist');
        if (artistSongs[artist]) {
            updatePlaylist(artistSongs[artist], playlistContainer);
        }
    }

    function handleTopPickClick(item) {
        const src = item.getAttribute('data-src');
        const title = item.querySelector('.song-title').textContent;
        const artist = item.querySelector('.artist').textContent;
        currentPlaylist = [{ title, src, artist }];
        currentSongIndex = 0;
        loadSong(currentSongIndex);
        playSong();
    }

    document.querySelectorAll('.artist-circle').forEach(artistElement => {
        artistElement.addEventListener('click', () => handleArtistClick(artistElement));
    });

    updatePlaylist(topPicks, topPicksContainer);
    setupPlaylistListeners(topPicksContainer);

});