import React from 'react';

import { TextField } from '@material-ui/core';

interface Props {
  label: string,
  menuState: any,
  changeHandler: (e: any) => void,
  stepSize: number,
}

const MenuTextInput: React.FC<Props> = ({ label, menuState, changeHandler, stepSize }) => (
  <>
    <TextField
      type='number'
      value={menuState}
      label={label}
      variant='outlined'
      inputProps={{
        maxLength: 10,
        step: stepSize,
      }}
      onChange={changeHandler}
      style={{ marginBottom: '15px' }}
    />
  </>
);

export default MenuTextInput;
