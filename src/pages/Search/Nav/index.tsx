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
  const handleOnKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        window.bridge.ipc.send(getType(musicActions.searchMusic), { name: title, artist });
        break;
      default: break;
    }
  }, [title, artist]);
  return (
    <nav className={className}>
      <TextField
        id='title-text-field'
        label='Title'
        variant='outlined'
        type='text'
        value={title}
        onChange={handleOnTitleChange}
        onKeyDown={handleOnKeyDown}
        fullWidth
      />
      <TextField
        id='artist-text-field'
        label='Artist'
        variant='outlined'
        type='text'
        value={artist}
        onChange={handleOnArtistChange}
        onKeyDown={handleOnKeyDown}
        fullWidth
      />
      <Button variant='contained' onClick={handleOnClick}>검색</Button>
    </nav>
  );
};

export default Nav;
