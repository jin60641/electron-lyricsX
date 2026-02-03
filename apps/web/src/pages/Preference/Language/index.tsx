import React, { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';

import actions from '@renderer/store/preference/actions';
import { Locale } from '@renderer/store/preference/types';
import { RootState } from '@renderer/store/types';

const preferenceSelector = ({
  preference: {
    locale: { code },
  },
}: RootState) => code;

const LocaleLabel: {
  [key in Locale]: string;
} = {
  [Locale.EN]: 'English',
  [Locale.KO]: '한국어',
};

const Language: React.FC = () => {
  const preference = useSelector(preferenceSelector);
  const dispatch = useDispatch();

  const handleChange = useCallback(
    async (e: SelectChangeEvent) => {
      dispatch(actions.setLocale({ code: e.target.value }));
    },
    [dispatch],
  );

  return (
    <Select value={preference} onChange={handleChange}>
      {Object.entries(Locale).map(([key, value]) => (
        <MenuItem key={`Preference-Language-code-${key}`} value={value}>
          {LocaleLabel[value]}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Language;
