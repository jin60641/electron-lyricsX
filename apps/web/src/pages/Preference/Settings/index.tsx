import React, { useCallback } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import preferenceAction from '@renderer/store/preference/actions';
import actions from '@renderer/store/music/actions';
import { Player } from '../../../store/preference/types';
import { RootState } from '../../../store/types';

const StyledFormControl = styled(FormControl)({
  border: '0.2px solid rgba(0, 0, 0, 0.3)',
  borderRadius: 5,
  marginTop: 7,
});

const StyledFormLabel = styled(FormLabel)({
  fontSize: '12px',
  marginLeft: '9px',
  padding: '0 3px',
});

const StyledRadioGroup = styled(RadioGroup)({
  display: 'flex',
  flexDirection: 'row',
  marginLeft: '10px',
  padding: '3px 10px',
  justifyContent: 'space-between',
});

const selector = ({
  preference: { draggable, player, showFurigana, showTlit },
  music: { globalOffset },
}: RootState) => ({
  draggable,
  player,
  globalOffset,
  showTlit,
  showFurigana,
});

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { showFurigana, showTlit, draggable, player, globalOffset } = useSelector(selector);

  const handleChangeGlobalOffset = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(actions.setGlobalOffset(parseFloat(e.target.value)));
    },
    [dispatch],
  );

  const handleChangePlayer = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(preferenceAction.setPlayer.request(e.target.value as typeof player));
    },
    [dispatch],
  );

  const handleToggleDraggable = useCallback(() => {
    dispatch(preferenceAction.setDraggable(!draggable));
  }, [dispatch, draggable]);

  const handleToggleShowFurigana = useCallback(() => {
    dispatch(preferenceAction.setPreference({ showFurigana: !showFurigana }));
  }, [dispatch, showFurigana]);

  const handleToggleShowTlit = useCallback(() => {
    dispatch(preferenceAction.setPreference({ showTlit: !showTlit }));
  }, [dispatch, showTlit]);

  return (
    <>
      <TextField
        type="number"
        value={globalOffset}
        label="Offset"
        variant="outlined"
        inputProps={{
          maxLength: 13,
          step: '0.1',
        }}
        onChange={handleChangeGlobalOffset}
      />

      <StyledFormControl>
        <StyledFormLabel>Music Player</StyledFormLabel>
        <StyledRadioGroup
          aria-label="musicPlayer"
          name="radio-buttons-group"
          value={player}
          onChange={handleChangePlayer}
        >
          {window.bridge.platform === 'darwin' ? (
            <FormControlLabel
              value={Player.CHROME}
              control={<Radio color="primary" />}
              label="Chrome"
            />
          ) : (
            <FormControlLabel
              value={Player.CHROME_EXTENSION}
              control={<Radio color="primary" />}
              label="Chrome Extension"
            />
          )}
          <FormControlLabel
            value={Player.ITUNES}
            control={<Radio color="primary" />}
            label="iTunes"
          />
          <FormControlLabel
            value={Player.SPOTIFY}
            control={<Radio color="primary" />}
            label="Spotify"
          />
        </StyledRadioGroup>
      </StyledFormControl>

      <Grid container spacing={2}>
        <Grid size={12}>
          <FormControl>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Draggable"
              value={draggable}
              onChange={handleToggleDraggable}
              checked={draggable}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Show Furigana"
              value={showFurigana}
              onChange={handleToggleShowFurigana}
              checked={showFurigana}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Show Pronunciation"
              value={showTlit}
              onChange={handleToggleShowTlit}
              checked={showTlit}
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default Settings;
