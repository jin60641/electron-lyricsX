import React, { useCallback, useEffect, useState } from 'react';

import { Button, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';

interface Props {
  className: string
}
const Nav: React.FC<Props> = ({ className }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    window.bridge.ipc.receive(getType(musicActions.searchMusic), (data: Music[]) => {
      dispatch(musicActions.searchMusic(data));
    });
  }, [dispatch]);
  const handleOnTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);
  const handleOnArtistChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setArtist(e.target.value);
  }, []);
  const handleOnClick = useCallback(() => {
    window.bridge.ipc.send(getType(musicActions.searchMusic), { name: title, artist });
  }, [title, artist]);
  const handleOnSubmit = useCallback(() => {
    window.bridge.ipc.send(getType(musicActions.searchMusic), { name: title, artist });
  }, [title, artist]);
  return (
    <nav>
      <form onSubmit={handleOnSubmit} className={className}>
        <TextField
          id='title-text-field'
          label='Title'
          variant='outlined'
          type='text'
          value={title}
          onChange={handleOnTitleChange}
          onKeyDown={handleOnSubmit}
          fullWidth
        />
        <TextField
          id='artist-text-field'
          label='Artist'
          variant='outlined'
          type='text'
          value={artist}
          onChange={handleOnArtistChange}
          onKeyDown={handleOnSubmit}
          fullWidth
        />
        <Button variant='contained' onClick={handleOnClick}>검색</Button>
      </form>
    </nav>
  );
};

export default Nav;
