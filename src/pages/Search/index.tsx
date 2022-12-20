import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import Modal from 'components/Modal';
import layoutActions from 'store/layout/actions';

import Content from './Content';
import Lyric from './Lyric';
import Nav from './Nav';

const useStyle = makeStyles({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
    minHeight: 0,
  },
});

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
    >
      <div className={classes.wrap}>
        <Nav />
        <Content />
        <Lyric />
      </div>
    </Modal>
  );
};

export default Search;
