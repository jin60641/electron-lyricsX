import React from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { BackgroundColor, FontColor, Palette } from 'store/layout/types'; // FontColor

import MenuSelector from '../../../components/MenuSelector';
import MenuTextInput from '../../../components/MenuTextInput';
import { useThemeCustom } from '../../../hooks/useCustom';

const useStyles = makeStyles(() => createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
}));

const Theme: React.FC = () => {
  const classes = useStyles();
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
    <div className={classes.container}>
      <MenuSelector
        label='palette'
        changeHandler={handleChangePalette}
        menuState={palette}
        obj={Palette}
      />
      <MenuSelector
        label='font color'
        changeHandler={handleChangeFontColor}
        menuState={fontColor}
        obj={FontColor}
      />
      <MenuSelector
        label='background color'
        changeHandler={handleChangeBackgroundColor}
        menuState={backgroundColor}
        obj={BackgroundColor}
      />
      <MenuTextInput
        label='line count'
        menuState={lineCount}
        changeHandler={handleChangeLineCount}
        stepSize={1}
      />
      <MenuTextInput
        label='font size'
        menuState={lyricSize}
        changeHandler={handleChangeFontSize}
        stepSize={1}
      />
      <MenuTextInput
        label='background opacity'
        menuState={backgroundOpacity}
        changeHandler={handleChangeBackgroundOpacity}
        stepSize={0.1}
      />
    </div>
  );
};

export default Theme;
