import React from "react";
import "./App.css";
import { MusicEvent } from "./types";

const musicEvents: MusicEvent[] = [
  {
    name: "Jazz Night",
    startDateTime: "2023-11-10T20:00:00Z",
    endDateTime: "2023-11-10T23:00:00Z",
    price: 30,
    externalLink: "http://jazznight.com",
    artists: ["Artist1", "Artist2"],
    genre: "Jazz",
  },
  {
    name: "Rock Festival",
    startDateTime: "2023-12-01T12:00:00Z",
    endDateTime: "2023-12-01T23:00:00Z",
    price: 50,
    externalLink: "http://rockfestival.com",
    artists: ["RockBand1", "RockBand2", "RockBand3"],
    genre: "Rock",
  },
  {
    name: "Hip Hop Bash",
    startDateTime: "2023-12-20T19:00:00Z",
    price: 40,
    externalLink: "http://hiphopbash.com",
    artists: ["HipHopArtist1", "HipHopArtist2"],
    genre: "Hip Hop",
  },
];

function App() {
  return (
    <div className="App">
      <h1>BoonWeGig</h1>
      <div>
        <span>Music</span>
        {/* <span>Esports</span> */}
      </div>
    </div>
  );
}

export default App;
