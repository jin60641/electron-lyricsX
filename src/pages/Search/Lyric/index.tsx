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
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    flex: '1 1 auto',
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
          {lyric.format === 'krc' ? (
            <div
              key={`lyric-row-${lyric.id}`}
            >
              {lyric.words.map((word) => (
                <span
                  // eslint-disable-next-line
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: word.text }}
                />
              ))}
            </div>
          ) : (
            <div
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
