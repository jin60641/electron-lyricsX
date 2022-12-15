import React from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@material-ui/core';

interface Props extends SelectProps {
  items: Record<string, string>
}

const Selector: React.FC<Props> = ({ label, items, ...props }) => (
  <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <Select {...props}>
      {Object.entries(items).map(([key, value]) => (
        <MenuItem key={`Preference-Theme-Palette-${key}`} value={`${value}`}>{key}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default Selector;
