import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import actions from '../store/layout/actions';
import { RootState } from '../store/types';

const styleCustomSelector = ({
  layout: {
    palette,
    lineCount,
    lyricSize,
    fontColor,
    backgroundOpacity,
    backgroundColor,
  },
}: RootState) => ({
  palette,
  lineCount,
  lyricSize,
  fontColor,
  backgroundOpacity,
  backgroundColor,
});

export const useThemeCustom = () => {
  const {
    palette,
    lineCount,
    lyricSize,
    fontColor,
    backgroundOpacity,
    backgroundColor,
  } = useSelector(styleCustomSelector);

  const dispatch = useDispatch();

  const handleChangePalette = useCallback((e) => {
    dispatch(actions.setPalette(e.target.value));
  }, [dispatch]);

  const handleChangeLineCount = useCallback((e) => {
    if (Number(e.target.value) < 1) {
      return;
    }
    dispatch(actions.setLineCount(Number(e.target.value)));
  }, [dispatch]);

  const handleChangeFontSize = useCallback((e) => {
    dispatch(actions.setLyricSize(Number(e.target.value)));
  }, [dispatch]);

  const handleChangeFontColor = useCallback((e) => {
    dispatch(actions.setFontColor(e.target.value));
  }, [dispatch]);

  const handleChangeBackgroundColor = useCallback((e) => {
    dispatch(actions.setBackgroundColor(e.target.value));
  }, [dispatch]);

  const handleChangeBackgroundOpacity = useCallback((e) => {
    if (Number(e.target.value) < 0 || Number(e.target.value) > 1) {
      return;
    }
    dispatch(actions.setBackgroundOpacity(Number(e.target.value)));
  }, [dispatch]);

  return {
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
  };
};
