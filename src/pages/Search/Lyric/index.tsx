import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { RootState } from 'store/types';

interface Props {
  className: string
}

const selector = ({
  music: {
    searchList,
    searchIndex,
  },
}: RootState) => ({
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
  const { searchList, searchIndex } = useSelector(selector);
  const classes = uesStyles();

  return (
    <div className={className}>
      {searchList[searchIndex]?.lyric?.map((e) => (
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
