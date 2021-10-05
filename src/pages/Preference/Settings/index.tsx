import React, { useCallback, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';

import actions from 'store/music/actions';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(-0.5);

  const handleOnChange = useCallback((e) => {
    dispatch(actions.setGlobalOffset(e.target.value));
    setOffset(() => Number(e.target.value));
  }, [dispatch]);
  return (
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
  );
};

export default Settings;
