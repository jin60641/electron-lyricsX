import React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Selector from 'components/Selector';
import { useThemeCustom } from 'hooks/useCustom';
import { Palette } from 'store/layout/types'; // FontColor

const Theme: React.FC = () => {
  const {
    palette,
    lineCount,
    lyricSize,
    fontColor,
    backgroundOpacity,
    backgroundColor,
    handleChangePalette,
    handleChangeLineCount,
    handleChangeFontSize,
    handleChangeFontColor,
    handleChangeBackgroundColor,
    handleChangeBackgroundOpacity,
  } = useThemeCustom();

  return (
    <Grid container spacing={4}>
      <Grid
        container
        item
        spacing={2}
        xs={12}
      >
        <Grid item xs={4}>
          <Selector
            label='Palette'
            onChange={handleChangePalette}
            value={palette}
            items={Palette}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label='Font color'
            type='color'
            onChange={handleChangeFontColor}
            value={fontColor}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type='color'
            label='Background color'
            onChange={handleChangeBackgroundColor}
            value={backgroundColor}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={4}>
          <TextField
            type='number'
            label='Max line count'
            value={lineCount}
            onChange={handleChangeLineCount}
            inputProps={{ step: 1 }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type='number'
            label='Font size'
            value={lyricSize}
            onChange={handleChangeFontSize}
            inputProps={{ step: 1 }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type='number'
            label='Background opacity'
            value={backgroundOpacity}
            onChange={handleChangeBackgroundOpacity}
            inputProps={{ step: 0.1 }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Theme;
