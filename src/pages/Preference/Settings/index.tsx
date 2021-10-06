import React, { useCallback, useState } from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';

import layoutAction from 'store/layout/actions';
import actions from 'store/music/actions';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(-0.5);
  const [draggable, setDraggable] = useState('ON');

  const handleOnChange = useCallback((e) => {
    dispatch(actions.setGlobalOffset(e.target.value));
    setOffset(() => Number(e.target.value));
  }, [dispatch]);

  const handleOnChangeDraggable = useCallback((e) => {
    dispatch(layoutAction.setDraggable(e.target.value));
    setDraggable(() => String(e.target.value));
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
      <InputLabel id='demo-simple-select-autowidth-label'>
        Draggable
      </InputLabel>
      <Select
        labelId='demo-simple-select-autowidth-label'
        id='demo-simple-select-autowidth'
        value={draggable}
        onChange={handleOnChangeDraggable}
        autoWidth
        label='Draggable'
        defaultValue={draggable}
      >
        <MenuItem value='ON'>ON</MenuItem>
        <MenuItem value='OFF'>OFF</MenuItem>
      </Select>
    </>
  );
};

export default Settings;
