import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  modal: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[100],
    borderRadius: 10,
  },
  header: {
    padding: theme.spacing(1.25),
    paddingLeft: theme.spacing(2.5),
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
  },
  title: { fontWeight: 'bold' },
  close: { fontSize: 20 },
  body: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    minHeight: 0,
    paddingTop: theme.spacing(2),
  },
}));

interface Props {
  isOpen: boolean,
  onClose: () => void,
  title: string,
}

const Modal: React.FC<Props> = ({ children, isOpen, onClose, title }) => {
  const classes = useStyles();

  if (!isOpen) {
    return null;
  }

  return (
    <Paper className={classes.modal}>
      <div className={classes.header}>
        <Typography className={classes.title} variant='h5'>
          {title}
        </Typography>
        <IconButton className={classes.close} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className={classes.body}>
        {children}
      </div>
    </Paper>
  );
};

export default Modal;
