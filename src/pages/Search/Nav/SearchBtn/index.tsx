import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { RootState } from 'store/types';

const useStyle = makeStyles({ button: { flex: '0.3' } });

const selector = ({
  layout: {
    title,
    artist,
  },
}: RootState) => ({
  title,
  artist,
});
const SearchBtn = () => {
  const classes = useStyle();
  const { title, artist } = useSelector(selector);
  const handleOnClick = () => {
    console.log({ title, artist });
  };
  return (
    <>
      <button className={classes.button} aria-label='search lyrics' type='button' onClick={handleOnClick}>검색</button>
    </>
  );
};

export default SearchBtn;
