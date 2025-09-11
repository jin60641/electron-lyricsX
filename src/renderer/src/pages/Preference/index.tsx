import React, { lazy, Suspense, useCallback, useMemo } from 'react';

import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { Link, Route, Routes, useLocation, useMatch, LinkProps } from 'react-router-dom';

import Modal from '@renderer/components/Modal';
import { Route as TRoute } from '@renderer/constants/routes';
import layoutActions from '@renderer/store/layout/actions';

const Menu = styled('div')({
  flexDirection: 'column',
  display: 'flex',
  width: 230,
  paddingLeft: 20,
  paddingRight: 20,
});

const Content = styled('div')({
  flexDirection: 'column',
  display: 'flex',
  flexGrow: 1,
  paddingRight: 20,
});

interface MenuButtonProps extends ButtonProps {
  selected?: boolean;
}

const MenuButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<MenuButtonProps & LinkProps>(({ theme, selected }) => ({
  textAlign: 'left',
  justifyContent: 'flex-start',
  padding: '4px 10px',
  marginBottom: 4,
  boxShadow: 'none',
  ...(selected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

enum Tabs {
  language = 'Language',
  theme = 'Theme',
  settings = 'Settings',
}

const views = import.meta.glob('./*/index.tsx') as Record<
  string,
  () => Promise<{ default: React.ComponentType<unknown> }>
>;

// 2. index.tsx 제외하고 라우트 만들기
const routes: TRoute[] = Object.entries(views)
  .filter(([path]) => path !== './index.tsx')
  .map(([key, importer]) => {
    return {
      key: key.replace('./', '').replace('/index.tsx', ''),
      component: lazy(importer),
    };
  });

const Preference: React.FC = () => {
  const dispatch = useDispatch();
  const match = useMatch('/preference/*');
  const pathname = useLocation().pathname;
  const base = match?.pathnameBase || '/preference';

  const tab = useMemo(() => pathname.replace(`${base}/`, ''), [base, pathname]);

  const handleClose = useCallback(() => {
    dispatch(layoutActions.closePreference());
  }, [dispatch]);

  return (
    <Modal isOpen onClose={handleClose} title="Preferences">
      <Menu>
        {Object.entries(Tabs).map(([key, value]) => (
          <MenuButton
            component={Link}
            to={`${base}/${key}`}
            key={`preference-menu-${key}`}
            selected={tab === key}
            variant={tab === key ? 'contained' : 'text'}
            disableRipple
          >
            {value}
          </MenuButton>
        ))}
      </Menu>
      <Content>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map(({ key, component: Component }) => (
              <Route key={key} path={`${key}`} element={<Component />} />
            ))}
          </Routes>
        </Suspense>
      </Content>
    </Modal>
  );
};

export default Preference;
