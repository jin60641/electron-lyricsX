import React, { useCallback, useEffect, useState } from 'react';

import { Button, Grid, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import musicActions from '@renderer/store/music/actions';
import { RootState } from '@renderer/store/types';

// 스타일 지정 (root container만 styled 사용)
const RootContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  width: '100%',
  height: 'auto',
  marginBottom: '8px',
});

// 리덕스 셀렉터
const selector = ({ music: { name, artist } }: RootState) => ({
  name,
  artist,
});

const Nav: React.FC = () => {
  const { name = '', artist = '' } = useSelector(selector);
  const [payload, setPayload] = useState({ name, artist });
  const dispatch = useDispatch();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleOnSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(musicActions.searchMusic.request(payload));
    },
    [dispatch, payload],
  );

  useEffect(() => {
    setPayload({ name, artist });
  }, [name, artist]);

  return (
    <form onSubmit={handleOnSubmit}>
      <RootContainer container spacing={2}>
        <Grid size={{ xs: 12, sm: 5 }}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            type="text"
            value={payload.name}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          <TextField
            name="artist"
            label="Artist"
            variant="outlined"
            type="text"
            value={payload.artist}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size="auto">
          <Button
            variant="contained"
            type="submit"
            sx={{
              maxWidth: 80,
              maxHeight: 40,
              minWidth: 80,
              minHeight: 40,
            }}
          >
            검색
          </Button>
        </Grid>
      </RootContainer>
    </form>
  );
};

export default Nav;
