import React from 'react';

import { InputLabel, MenuItem, Select } from '@material-ui/core';

interface Props {
  label: string,
  changeHandler: (e: any) => void,
  menuState: any,
  obj: any,
}

const MenuSelector: React.FC<Props> = ({ label, menuState, changeHandler, obj }) => (
  <>
    <InputLabel id='demo-simple-select-autowidth-label'>{label}</InputLabel>
    <Select
      labelId='demo-simple-select-autowidth-label'
      value={menuState}
      onChange={changeHandler}
      style={{ marginBottom: '15px' }}
    >
      {Object.entries(obj).map(([key, value]) => (
        <MenuItem key={`Preference-Theme-Palette-${key}`} value={`${value}`}>{key}</MenuItem>
      ))}
    </Select>
  </>
);

export default MenuSelector;
