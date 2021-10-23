import React, { useCallback, useState } from 'react';

import {
  Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/music/actions';
import preferenceAction from 'store/preference/actions';

import { Player } from '../../../store/preference/types';
import { RootState } from '../../../store/types';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(-0.5);
  const selector = ({ preference: { draggable, player } }: RootState) => ({ draggable, player });
  const { draggable, player } = useSelector(selector);
  const handleOnChange = useCallback((e) => {
    dispatch(actions.setGlobalOffset(e.target.value));
    setOffset(() => Number(e.target.value));
  }, [dispatch]);

  const handleOnChangePlayer = useCallback((e) => {
    dispatch(preferenceAction.setPlayer(e.target.value));
  }, [dispatch]);

  const handleOnChangeDraggable = useCallback((value) => {
    dispatch(preferenceAction.setDraggable(value));
  }, [dispatch]);

  return (
    <>
      <TextField
        type='number'
        value={offset}
        label='Offset'
        variant='outlined'
        inputProps={{
          maxLength: 13,
          step: '0.1',
        }}
        onChange={handleOnChange}
      />
      <FormControl
        component='fieldset'
        style={{ border: '0.2px solid rgba(0, 0, 0, .3)', borderRadius: '5px', marginTop: '7px' }}
      >
        <FormLabel
          component='legend'
          style={{ fontSize: '12px', marginLeft: '9px', padding: '0 3px' }}
        >
          Music Player
        </FormLabel>
        <RadioGroup
          aria-label='musicPlayer'
          name='radio-buttons-group'
          value={player}
          style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px', padding: '3px 10px', justifyContent: 'space-between' }}
          onChange={handleOnChangePlayer}
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
          onChange={() => handleOnChangeDraggable(!draggable)}
          checked={draggable}
        />
      </FormControl>
    </>
  );
};

export default Settings;
