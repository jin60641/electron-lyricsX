import React, { useCallback } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/layout/actions';
import { Palette } from 'store/layout/types';
import { RootState } from 'store/types';

const paletteSelector = ({ layout: { palette } }: RootState) => palette;

const Theme: React.FC = () => {
  const palette = useSelector(paletteSelector);
  const dispatch = useDispatch();

  const handleChange = useCallback((e) => {
    dispatch(actions.setPalette(e.target.value));
  }, [dispatch]);

  return (
    <Select
      value={palette}
      onChange={handleChange}
    >
      {Object.entries(Palette).map(([key, value]) => (
        <MenuItem key={`Preference-Theme-Palette-${key}`} value={value}>{key}</MenuItem>
      ))}
    </Select>
  );
};

export default Theme;
