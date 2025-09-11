import React from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// 스타일 정의
const StyledModal = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[100],
  borderRadius: 10,
}));

const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.25),
  paddingLeft: theme.spacing(2.5),
  borderBottom: `1px solid ${theme.palette.grey[400]}`,
}));

const Title = styled(Typography)({
  fontWeight: 'bold',
});

const CloseButton = styled(IconButton)({
  fontSize: 20,
});

const Body = styled('div')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'row',
  minHeight: 0,
  paddingTop: theme.spacing(2),
}));

// Props 정의
interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<React.PropsWithChildren<Props>> = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <StyledModal elevation={3}>
      <Header>
        <Title variant="h5">{title}</Title>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </Header>
      <Body>{children}</Body>
    </StyledModal>
  );
};

export default Modal;
