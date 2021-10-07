import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import layoutAction from 'store/layout/actions';
import { RootState } from 'store/types';

const useStyle = makeStyles({
  artist: {
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

const selector = ({ layout: { artist } }: RootState) => (artist);

const Artist = () => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const artist = useSelector(selector);

  const handleOnChange = useCallback((e) => {
    dispatch(layoutAction.setArtist(e.target.value));
  }, [dispatch]);
  return (
    <div className={classes.artist}>
      <label className={classes.label} htmlFor='artist'>아티스트: </label>
      <input className={classes.input} type='text' name='artist' onChange={handleOnChange} value={artist} />
    </div>
  );
};

export default Artist;
