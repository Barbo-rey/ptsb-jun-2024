const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")
const { release } = require("os")

// global constant
const SONGS_PATH = path.join(__dirname, "../static/songs.json")

const getJSON = () => {
  // read file
  const data = fs.readFileSync(SONGS_PATH)
  // parse JSON
  const parsedData = JSON.parse(data)
  return parsedData
}

// get all
router.get("/", (req, res) => {
  res.sendFile(SONGS_PATH)
})

// get song by id
router.get("/catalog/:songId", (req, res) => {
  const songId = req.params.songId
  const song = getJSON().find((s) => s.id == songId)
  res.send(song)
  // TODO: what to send when no result?
})

const getNewId = () => {
  const songs = getJSON()
  const lastSong = songs[songs.length - 1]
  return lastSong.id + 1
}

// post
router.post("/add", (req, res) => {
  const songs = getJSON()
  const newSong = {
    id: getNewId(),
    title: req.body.title || "untitled",
    artist: req.body.artist || "unknown artist",
    releaseYear: req.body.releaseYear || "unknown",
    album: req.body.album || "single",
    genre: req.body.genre || [],
  }
  songs.push(newSong)
  fs.writeFileSync(SONGS_PATH, JSON.stringify(songs))
  res.send("song added")
})

// TODO: put
// TODO: delete

module.exports = router
