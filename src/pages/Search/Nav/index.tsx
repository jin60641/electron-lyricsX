import React, { useCallback, useEffect, useState } from 'react';

import { Button, Grid, TextField } from '@material-ui/core';
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
  const handleOnSubmit = useCallback(() => {
    console.log('동작', { title, artist });
    window.bridge.ipc.send(getType(musicActions.searchMusic), { name: title, artist });
  }, [title, artist]);
  return (
    <Grid
      container
      spacing={2}
      className={className}
    >
      <Grid item xs={5}>
        <form onSubmit={handleOnSubmit}>
          <TextField
            id='title-text-field'
            label='Title'
            variant='outlined'
            type='text'
            value={title}
            onChange={handleOnTitleChange}
            fullWidth
            size='small'
          />
        </form>
      </Grid>
      <Grid item xs={5}>
        <form onSubmit={handleOnSubmit}>
          <TextField
            id='artist-text-field'
            label='Artist'
            variant='outlined'
            type='text'
            value={artist}
            onChange={handleOnArtistChange}
            fullWidth
            size='small'
          />
        </form>
      </Grid>
      <Grid item xs='auto'>
        <form onSubmit={handleOnSubmit}>
          <Button
            style={{ maxWidth: '80px', maxHeight: '40px', minWidth: '80px', minHeight: '40px' }}
            variant='contained'
            type='submit'
          >
            검색
          </Button>
        </form>
      </Grid>
    </Grid>
    // </form>
  );
};

export default Nav;
