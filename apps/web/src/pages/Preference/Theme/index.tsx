import React from 'react';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';

import Selector, { Props as SelectorProps } from '@renderer/components/Selector';
import actions from '@renderer/store/layout/actions';
import { Palette } from '@renderer/store/layout/types';
import { RootState } from '@renderer/store/types';

const Theme: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector((state: RootState) => state.layout);
  const {
    fontSize,
    fontColor,
    fontOpacity,
    textShadowSize,
    textShadowColor,
    textShadowOpacity,
    backgroundColor,
    backgroundOpacity,
    progressColor,
    progressOpacity,
    lineCount,
    palette,
  } = layout;

  const handleChangePalette: SelectorProps['onChange'] = (e) => {
    dispatch(actions.setLayout({ ...layout, palette: e.target.value as Palette }));
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    dispatch(actions.setLayout({ ...layout, [e.target.name]: value }));
  };

  return (
    <Grid container spacing={4}>
      <Grid container spacing={2} size={12}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Selector
            label="Palette"
            name="palette"
            onChange={handleChangePalette}
            value={palette}
            items={Palette}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="number"
            name="lineCount"
            label="Max line count"
            value={lineCount}
            onChange={handleChange}
            inputProps={{ step: 1, min: 1 }}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} size={12}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="number"
            label="Font size"
            name="fontSize"
            value={fontSize}
            onChange={handleChange}
            inputProps={{ step: 1, min: 0 }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Font color"
            type="color"
            name="fontColor"
            onChange={handleChange}
            value={fontColor}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="number"
            label="Font Opacity"
            name="fontOpacity"
            onChange={handleChange}
            value={fontOpacity}
            fullWidth
            inputProps={{ step: 0.1, min: 0, max: 1 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} size={12}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="number"
            label="Text Shadow size"
            name="textShadowSize"
            value={textShadowSize}
            onChange={handleChange}
            inputProps={{ step: 1, min: 0 }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Text Shadow color"
            type="color"
            name="textShadowColor"
            onChange={handleChange}
            value={textShadowColor}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Text Shadow Opacity"
            type="number"
            name="textShadowOpacity"
            onChange={handleChange}
            value={textShadowOpacity}
            fullWidth
            inputProps={{ step: 0.1, min: 0, max: 1 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} size={12}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="color"
            name="backgroundColor"
            label="Background color"
            onChange={handleChange}
            value={backgroundColor}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="number"
            name="backgroundOpacity"
            label="Background opacity"
            value={backgroundOpacity}
            onChange={handleChange}
            inputProps={{ step: 0.1, min: 0, max: 1 }}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} size={12}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="color"
            name="progressColor"
            label="Progress color"
            onChange={handleChange}
            value={progressColor}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            type="number"
            name="progressOpacity"
            label="Progress opacity"
            value={progressOpacity}
            onChange={handleChange}
            inputProps={{ step: 0.1, min: 0, max: 1 }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Theme;
