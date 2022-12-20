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

const uesStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    flex: '1 1 auto',
    padding: theme.spacing(2),
  },
  lyric: {
    padding: '0',
    margin: '0',
  },
  lyricTimestamp: { marginRight: theme.spacing(1) },
}));

const Lyric: React.FC = () => {
  const { list, searchList, searchIndex } = useSelector(selector, shallowEqual);
  const classes = uesStyles();
  const targetList = searchList || list;
  return (
    <div className={classes.root}>
      {targetList[searchIndex]?.lyric?.map((lyric) => (
        <p className={classes.lyric} key={`lyric-row-${lyric.id}`}>
          <span className={classes.lyricTimestamp}>
            {new Date(lyric.time).toISOString().replace(/.*T/, '[').replace('Z', ']')}
          </span>
          {lyric.format === 'krc' ? lyric.words.map((word) => (
            <span
              // eslint-disable-next-line
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: word.text }}
            />
          )) : (
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: lyric.text }}
            />
          )}
        </p>
      ))}
    </div>
  );
};

export default Lyric;
