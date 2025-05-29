import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import SongItem from "./SongItem";
import AlbumItem from "./AlbumItem";
import { PlayerContext } from "../context/PlayContext"; // giả sử có context này

const DisplayHome = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);

  // Lấy hàm setTrack từ context để set bài hát khi click
  const { setTrack } = useContext(PlayerContext);

  useEffect(() => {
    fetch("http://localhost:4000/api/album/list")
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data);
        setLoadingAlbums(false);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch albums:", err);
        setLoadingAlbums(false);
      });

    fetch("http://localhost:4000/api/song/list")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setLoadingSongs(false);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch songs:", err);
        setLoadingSongs(false);
      });
  }, []);

  const handleSongClick = (song) => {
    setTrack(song);  // set bài hát đang phát lên context
  };

  return (
    <>
      <Navbar />

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        {loadingAlbums ? (
          <p>Loading albums...</p>
        ) : (
          <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
            {albums.map((item) => (
              <AlbumItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                desc={item.desc}
              />
            ))}
          </div>
        )}
      </div>

      <div className="my-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        {loadingSongs ? (
          <p>Loading songs...</p>
        ) : (
          <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
            {songs.map((item) => (
              <SongItem
                key={item._id}
                id={item._id}
                name={item.name}
                desc={item.desc}
                image={item.image}
                onClick={() => handleSongClick(item)} // truyền cả object bài hát
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DisplayHome;
