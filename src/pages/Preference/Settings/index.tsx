import React, { useCallback } from 'react';

import {
  Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/music/actions';

import { preferenceActions } from '../../../store/preference/preferenceSlice';
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

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const selector = ({
    preference: { draggable, player },
    music: { globalOffset },
  }: RootState) => ({ draggable, player, globalOffset });
  const { draggable, player, globalOffset } = useSelector(selector);
  const classes = useStyles();
  const handleChange = useCallback((e) => {
    dispatch(actions.setGlobalOffset(e.target.value));
  }, [dispatch]);

  const handleChangePlayer = useCallback((e) => {
    dispatch(preferenceActions.setPlayer.success(e.target.value));
  }, [dispatch]);

  const handleToggleDraggable = useCallback(() => {
    dispatch(preferenceActions.setDraggable(!draggable));
  }, [dispatch, draggable]);

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
        onChange={handleChange}
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
          <FormControlLabel value={Player.CHROME} control={<Radio color='primary' />} label='chrome(only Mac)' />
          <FormControlLabel value={Player.ITUNES} control={<Radio color='primary' />} label='itunes' />
          <FormControlLabel value={Player.CHROME_EXTENSION} control={<Radio color='primary' />} label='chrome Extension' />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormControlLabel
          control={<Checkbox defaultChecked color='primary' />}
          label='Draggable ON'
          value={draggable}
          onChange={handleToggleDraggable}
          checked={draggable}
        />
      </FormControl>
    </>
  );
};

export default Settings;
