import React, { useCallback } from 'react';

import {
  Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/music/actions';
import preferenceAction from 'store/preference/actions';

import { Player } from '../../../store/preference/types';
import { RootState } from '../../../store/types';

const useStyles = makeStyles<Theme>(() => createStyles({
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '10px',
    padding: '3px 10px',
    justifyContent: 'space-between',
  },
  formControl: {
    border: '0.2px solid rgba(0, 0, 0, .3)',
    borderRadius: '5px',
    marginTop: '7px',
  },
  formLabel:
    {
      fontSize: '12px',
      marginLeft: '9px',
      padding: '0 3px',
    },
}));

const selector = ({
  preference: { draggable, player, showFurigana, showTlit },
  music: { globalOffset },
}: RootState) => ({ draggable, player, globalOffset, showTlit, showFurigana });
const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const { showFurigana, showTlit, draggable, player, globalOffset } = useSelector(selector);
  const classes = useStyles();
  const handleChangeGlobalOffset = useCallback((e) => {
    dispatch(actions.setGlobalOffset(parseFloat(e.target.value)));
  }, [dispatch]);

  const handleChangePlayer = useCallback((e) => {
    dispatch(preferenceAction.setPlayer.request(e.target.value));
  }, [dispatch]);

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
        type='number'
        value={globalOffset}
        label='Offset'
        variant='outlined'
        inputProps={{
          maxLength: 13,
          step: '0.1',
        }}
        onChange={handleChangeGlobalOffset}
      />
      <FormControl
        className={classes.formControl}
        component='fieldset'
      >
        <FormLabel
          className={classes.formLabel}
          component='legend'
        >
          Music Player
        </FormLabel>
        <RadioGroup
          className={classes.radioGroup}
          aria-label='musicPlayer'
          name='radio-buttons-group'
          defaultValue={player}
          onChange={handleChangePlayer}
        >
          {window.bridge.platform === 'darwin' ? (
            <FormControlLabel value={Player.CHROME} control={<Radio color='primary' />} label='Chrome' />
          ) : (
            <FormControlLabel value={Player.CHROME_EXTENSION} control={<Radio color='primary' />} label='Chrome Extension' />
          )}
          <FormControlLabel value={Player.ITUNES} control={<Radio color='primary' />} label='itunes' />
          <FormControlLabel value={Player.SPOTIFY} control={<Radio color='primary' />} label='spotify' />
        </RadioGroup>
      </FormControl>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl>
            <FormControlLabel
              control={<Checkbox defaultChecked color='primary' />}
              label='Draggable'
              value={draggable}
              onChange={handleToggleDraggable}
              checked={draggable}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl>
            <FormControlLabel
              control={<Checkbox defaultChecked color='primary' />}
              label='Show Furigana'
              value={showFurigana}
              onChange={handleToggleShowFurigana}
              checked={showFurigana}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <FormControlLabel
              control={<Checkbox defaultChecked color='primary' />}
              label='Show Pronounciation'
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
