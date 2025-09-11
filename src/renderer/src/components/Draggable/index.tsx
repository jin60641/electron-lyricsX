import React from 'react';
import { styled } from '@mui/material/styles';

// 스타일된 div 정의
const Base = styled('div')(({ theme }) => ({
  WebkitUserSelect: 'none',
  userSelect: 'none',
  WebkitAppRegion: 'drag',
  width: '100%',
  height: theme.spacing(4),
  backgroundColor: 'transparent',
  position: 'fixed',
  top: 0,
  left: 0,
}));

const Draggable: React.FC = () => {
  return <Base />;
};

export default Draggable;
