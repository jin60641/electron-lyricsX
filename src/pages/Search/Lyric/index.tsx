import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'store/types';

const selector = ({
  music: {
    list,
    searchList,
    searchIndex,
  },
}: RootState) => ({
  list,
  searchList,
  searchIndex,
});

const uesStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    height: '60vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  lyric: {
    padding: '0',
    margin: '0',
  },
});

const Lyric: React.FC = () => {
  const { list, searchList, searchIndex } = useSelector(selector, shallowEqual);
  const classes = uesStyles();
  const targetList = searchList || list;
  return (
    <div className={classes.root}>
      {targetList[searchIndex]?.lyric?.map((lyric) => (
        <p className={classes.lyric}>
          {lyric.timestamp}
          {' '}
          {lyric.text}
        </p>
      ))}
    </div>
  );
};

export default Lyric;
