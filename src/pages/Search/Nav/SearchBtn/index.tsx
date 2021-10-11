import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';
import { RootState } from 'store/types';

const useStyle = makeStyles({ button: { flex: '0.3' } });

const selector = ({
  search: {
    title,
    artist,
  },
}: RootState) => ({
  title,
  artist,
});

const SearchBtn = () => {
  const classes = useStyle();
  const { title, artist } = useSelector(selector);
  const dispatch = useDispatch();
  const handleOnClick = () => {
    window.bridge.ipc.send(getType(musicActions.searchMusic), { name: title, artist });
  };

  window.bridge.ipc.receive(getType(musicActions.searchMusic), (data: Music[]) => {
    dispatch(musicActions.searchMusic(data));
  });
  return (
    <>
      <button className={classes.button} aria-label='search lyrics' type='button' onClick={handleOnClick}>검색</button>
    </>
  );
};

export default SearchBtn;
