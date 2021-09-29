import React, { useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import actions from 'store/layout/actions';
import { RootState } from 'store/types';

const useStyles = makeStyles((theme) => ({
  margin: { margin: theme.spacing(1) },
  error: { backgroundColor: theme.palette.error.dark },
  info: { backgroundColor: theme.palette.primary.main },
  icon: { fontSize: 20 },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },

}));

const selector = ({
  layout: {
    alert: {
      message,
      type,
    },
  },
}: RootState) => ({
  message,
  type,
});

const Alert: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const state = useSelector(selector);
  const [alertOption, setAlertOption] = useState(state);

  useEffect(() => {
    if (state.type) {
      setAlertOption(state);
    }
  }, [state]);

  const { type, message } = alertOption;

  const handleClose = () => {
    dispatch(actions.dismissAlert());
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={!!state.type}
      autoHideDuration={3000}
      onClose={() => handleClose()}
    >
      <SnackbarContent
        className={type ? classes[type] : undefined}
        message={(
          <span id='client-snackbar' className={classes.message}>
            {message}
          </span>
        )}
        action={[
          <IconButton key='close' color='inherit' onClick={handleClose}>
            <Close className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default Alert;
