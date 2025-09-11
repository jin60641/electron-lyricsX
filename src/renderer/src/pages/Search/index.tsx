import React, { useCallback } from 'react';

import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';

import Modal from '@renderer/components/Modal';
import layoutActions from '@renderer/store/layout/actions';

import Content from './Content';
import Lyric from './Lyric';
import Nav from './Nav';

// 스타일 정의
const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flexGrow: 1,
  minHeight: 0,
});

const Search: React.FC = () => {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(layoutActions.closePreference());
  }, [dispatch]);

  return (
    <Modal isOpen onClose={handleClose} title="Search">
      <Wrap>
        <Nav />
        <Content />
        <Lyric />
      </Wrap>
    </Modal>
  );
};

export default Search;
