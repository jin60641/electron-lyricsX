import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'store/types';

interface Props {
  className: string
}

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
  lyric: {
    padding: '0',
    margin: '0',
  },
});

const Lyric: React.FC<Props> = ({ className }) => {
  const { list, searchList, searchIndex } = useSelector(selector, shallowEqual);
  const classes = uesStyles();

  return (
    <div className={className}>
      { searchList?.length === 0
        ? list[searchIndex]?.lyric?.map((lyric) => (
          <p className={classes.lyric}>
            {lyric.timestamp}
            {' '}
            {lyric.text}
          </p>
        ))
        : searchList[searchIndex]?.lyric?.map((e) => (
          <p className={classes.lyric}>
            {e.timestamp}
            {' '}
            {e.text}
          </p>
        ))}
    </div>
  );
};

export default Lyric;
