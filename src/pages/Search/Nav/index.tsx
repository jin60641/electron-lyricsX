import React, { useCallback, useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';

interface Props {
  className: string
}

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: '1',
  },
  label: {
    fontSize: '15px',
    marginRight: '10px',
  },
  input: { fontSize: '15px' },
});
const Nav: React.FC<Props> = ({ className }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const dispatch = useDispatch();
  const classes = useStyles();

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
  return (
    <nav className={className}>
      <div className={classes.wrapper}>
        <label htmlFor='title' className={classes.label}>제목: </label>
        <input
          name='title'
          type='text'
          value={title}
          onChange={handleOnTitleChange}
          className={classes.input}
        />
      </div>
      <div className={classes.wrapper}>
        <label htmlFor='artist' className={classes.label}>아티스트: </label>
        <input
          name='artist'
          type='text'
          value={artist}
          onChange={handleOnArtistChange}
          className={classes.input}
        />
      </div>
      <button onClick={handleOnClick} type='button'>검색</button>
    </nav>
  );
};

export default Nav;
