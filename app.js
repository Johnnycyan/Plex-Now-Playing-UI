const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Watch for changes in rating_key.txt
fs.watch('rating_key.txt', (event, filename) => {
  if (event === 'change') {
    setTimeout(() => {
      updateSongInfo();
    }, 1000);
  }
});

function updateSongInfo() {
    const artist = fs.readFileSync('artist.txt', 'utf8').trim();
    const song = fs.readFileSync('song.txt', 'utf8').trim();
    const albumArtUrl = fs.readFileSync('album_art.txt', 'utf8').trim();
  
    io.emit('song_update', { artist, song, albumArtUrl });
  }
  

io.on('connection', (socket) => {
  updateSongInfo();
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
