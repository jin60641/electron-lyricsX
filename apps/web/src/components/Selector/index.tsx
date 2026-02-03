import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectProps } from '@mui/material';

interface PropsBase {
  items: Record<string, string>;
  label?: string;
}
export type Props = PropsBase & SelectProps<string>;

const Selector: React.FC<Props> = ({ label, items, ...props }) => (
  <FormControl fullWidth>
    {label && <InputLabel>{label}</InputLabel>}
    <Select {...props} label={label}>
      {Object.entries(items).map(([key, value]) => (
        <MenuItem key={`Preference-Theme-Palette-${key}`} value={value}>
          {key}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default Selector;
