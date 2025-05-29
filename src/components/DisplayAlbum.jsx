import React, { useContext, useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayContext';

const DisplayAlbum = () => {
  const { id } = useParams();
  const { setTrack } = useContext(PlayerContext);
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    // Fetch album info by id
    fetch(`http://localhost:4000/api/album`) // backend cần có route lấy album theo id
      .then(res => res.json())
      .then(data => setAlbum(data))
      .catch(err => console.error(err));

    // Fetch songs in album
    fetch(`http://localhost:4000/api/song/list`) // backend cần hỗ trợ filter song theo albumId
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!album) return <p>Loading album...</p>;

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={album.image} alt={album.name} />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{album.name}</h2>
          <h4>{album.desc}</h4>
          <p className="mt-1">
            <b>{album.likes || 'N/A'} likes</b> · <b>{songs.length} songs</b>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 px-2 text-[#a7a7a7]">
        <p><b className="mr-4">#</b>Title</p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <p className="text-center">Duration</p>
      </div>

      <hr />
      {songs.map((item, index) => (
        <div
          key={item._id}
          onClick={() => setTrack(item)}
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
        >
          <p className="text-white">
            <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
            <img className="inline w-10 mr-5" src={item.image} alt={item.name} />
            {item.name}
          </p>
          <p className="text-[15px]">{album.name}</p>
          <p className="text-[15px] hidden sm:block">{new Date(item.dateAdded).toLocaleDateString()}</p>
          <p className="text-[15px] text-center">{item.duration}</p>
        </div>
      ))}
    </>
  );
};

export default DisplayAlbum;
