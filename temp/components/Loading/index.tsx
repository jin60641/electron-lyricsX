import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from 'store/types';

const selector = ({
  music: {
    lastCount,
    list,
    count,
  },
}: RootState) => ({
  count: count - lastCount,
  list: list.length - lastCount,
});

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    alignItems: 'center',
    display: 'flex',
    top: 0,
  },
});

const Loading: React.FC = () => {
  const classes = useStyles();
  const { count, list } = useSelector(selector, shallowEqual);

  if (list === count) {
    return null;
  }

  const max = Math.max(list, count);
  const min = Math.min(list, count);

  // TODO: 로직 간단하게 개선 필요 (중복 open시 count가 list보다 커지는 상황 발생)

  return (
    <LinearProgress
      className={classes.root}
      variant='determinate'
      value={(min / max) * 100}
    />
  );
};

export default Loading;
