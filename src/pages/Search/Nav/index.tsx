import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Button, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import musicActions from 'store/music/actions';
import { RootState } from 'store/types';

const useStyle = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    marginBottom: '8px',
  },
});

const selector = ({ music: { name, artist } }: RootState) => ({ name, artist });

const Nav: React.FC = () => {
  const classes = useStyle();

  const { name = '', artist = '' } = useSelector(selector);
  const [payload, setPayload] = useState({ name, artist });
  const dispatch = useDispatch();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setPayload((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleOnSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    dispatch(musicActions.searchMusic.request(payload));
  }, [dispatch, payload]);

  useEffect(() => {
    setPayload({ name, artist });
  }, [name, artist]);

  return (
    <form onSubmit={handleOnSubmit}>
      <Grid
        container
        spacing={2}
        className={classes.root}
      >
        <Grid item xs={5}>
          <TextField
            name='name'
            label='Name'
            variant='outlined'
            type='text'
            value={payload.name}
            onChange={handleChange}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            name='artist'
            label='Artist'
            variant='outlined'
            type='text'
            value={payload.artist}
            onChange={handleChange}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid item xs='auto'>
          <Button
            style={{ maxWidth: '80px', maxHeight: '40px', minWidth: '80px', minHeight: '40px' }}
            variant='contained'
            type='submit'
          >
            검색
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Nav;
