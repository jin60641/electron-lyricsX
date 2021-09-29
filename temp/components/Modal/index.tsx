import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import MuiModal, { ModalProps } from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  back: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  modal: {
    maxHeight: 700,
    height: '100%',
    maxWidth: 800,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2.5),
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
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 1,
    paddingTop: theme.spacing(2),
  },
}));

interface Props {
  isOpen: ModalProps['open'],
  onClose: () => void,
  title: string,
}

const Modal: React.FC<Props> = ({ children, isOpen, onClose, title }) => {
  const classes = useStyles();

  return (
    <MuiModal
      className={classes.back}
      open={isOpen}
      onClose={onClose}
    >
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
    </MuiModal>
  );
};

export default Modal;
