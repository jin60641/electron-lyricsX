import React, { useCallback, useState } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';

import actions from 'store/music/actions';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0.5);
  const [disabled, setDisabled] = useState(false);

  const handleOnClick = useCallback((e) => {
    dispatch(actions.setGlobalOffset(e.target.value));
    setDisabled(() => true);
  }, [dispatch]);

  const handleOnChange = useCallback((e) => {
    setOffset(() => Number(e.target.value));
    setDisabled(() => false);
  }, []);
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
      <Button onClick={handleOnClick} variant='contained' disabled={disabled}>CONFIRM</Button>
    </>
  );
};

export default Settings;
