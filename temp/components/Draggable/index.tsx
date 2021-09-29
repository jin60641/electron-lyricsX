import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  base: {
    '-webkit-user-select': 'none',
    'user-select': 'none',
    '-webkit-app-region': 'drag',
    width: '100%',
    height: theme.spacing(4),
    backgroundColor: 'transparent',
    position: 'fixed',
    top: 0,
    left: 0,
  },
}));

const Alert: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.base} />
  );
};

export default Alert;
