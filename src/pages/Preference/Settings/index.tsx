import React, { useCallback, useState } from 'react';

import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';

import layoutAction from 'store/layout/actions';
import actions from 'store/music/actions';

import { RootState } from '../../../store/types';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(-0.5);
  const selector = ({ layout: { draggable } }: RootState) => ({ draggable });
  const { draggable } = useSelector(selector);
  const handleOnChange = useCallback((e) => {
    dispatch(actions.setGlobalOffset(e.target.value));
    setOffset(() => Number(e.target.value));
  }, [dispatch]);

  const handleOnChangeDraggable = useCallback((value) => {
    dispatch(layoutAction.setDraggable(value));
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
      <FormControl>
        <InputLabel>Draggable</InputLabel>
        <Select value={`${draggable}`} label='Draggable' autoWidth>
          <MenuItem onClick={() => handleOnChangeDraggable(true)} value='true'>ON</MenuItem>
          <MenuItem onClick={() => handleOnChangeDraggable(false)} value='false'>OFF</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default Settings;
