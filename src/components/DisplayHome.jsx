import React from 'react';
import Navbar from './Navbar';
import { albumsData, songsData } from '../assets/assets';

import SongItem from './SongItem';
import AlbumItem from './AlbumItem';

const DisplayHome = () => {
  return (
    <>
      <Navbar />

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
          {albumsData.map((item, index) => (
            <AlbumItem 
              key={item.id}
              id={item.id}
              image={item.image}
              name={item.name}
              desc={item.desc}
            />
          ))}
        </div>
      </div>

      <div className="my-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
          {songsData.map((item, index) => (
            <SongItem
              key={item.id}
              id={item.id}
              name={item.name}
              desc={item.desc}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;
