import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import Modal from 'components/Modal';
import layoutActions from 'store/layout/actions';

import Content from './Content/index';
import Lyric from './Lyric/index';
import Nav from './Nav/index';

const useStyle = makeStyles({
  nav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: 'auto',
    borderBottom: 'solid gray 1px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '30vh',
    width: '100%',
    borderBottom: 'solid gray 1px',
  },
  lyric: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    height: '60vh',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
});

const styleProps = {
  flexDirection: 'column',
  display: 'flex',
  flexGrow: 1,
  overflowY: 'hidden',
};
const Search: React.FC = () => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    dispatch(layoutActions.closePreference());
  }, [dispatch]);
  return (
    <Modal
      isOpen
      onClose={handleClose}
      title='Search'
      styleProps={styleProps}
    >
      <Nav className={classes.nav} />
      <Content className={classes.content} />
      <Lyric className={classes.lyric} />
    </Modal>
  );
};

export default Search;
