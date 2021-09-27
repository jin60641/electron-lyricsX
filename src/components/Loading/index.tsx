import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { shallowEqual, useSelector } from 'react-redux';

import { drawerWidth } from 'store/layout/types';
import { RootState } from 'store/types';

const selector = ({
  music: {
    lastCount,
    list,
    count,
  },
  layout: { drawer: isDrawerOpen },
}: RootState) => ({
  count: count - lastCount,
  list: list.length - lastCount,
  isDrawerOpen,
});

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    alignItems: 'center',
    display: 'flex',
    top: 0,
  },
  drawerShift: {
    left: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
});

const Loading: React.FC = () => {
  const classes = useStyles();
  const { count, list, isDrawerOpen } = useSelector(selector, shallowEqual);

  if (list === count) {
    return null;
  }

  const max = Math.max(list, count);
  const min = Math.min(list, count);

  // TODO: 로직 간단하게 개선 필요 (중복 open시 count가 list보다 커지는 상황 발생)

  return (
    <LinearProgress
      className={clsx(
        classes.root,
        isDrawerOpen && classes.drawerShift,
      )}
      variant='determinate'
      value={(min / max) * 100}
    />
  );
};

export default Loading;
