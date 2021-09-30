import React, { lazy, useCallback, useMemo } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import {
  Link,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import Modal from 'components/Modal';
import { Route as TRoute } from 'constants/routes';
import layoutActions from 'store/layout/actions';

const useStyles = makeStyles((theme) => ({
  menu: {
    flexDirection: 'column',
    display: 'flex',
    width: 230,
    paddingLeft: 20,
    paddingRight: 20,
  },
  content: {
    flexDirection: 'column',
    display: 'flex',
    flexGrow: 1,
    paddingRight: 20,
  },
  menuItem: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    padding: '4px 10px 4px 10px',
    transition: 'none',
    marginBottom: 4,
    boxShadow: 'none !important',
  },
  selectedMenuItem: { '&:hover': { backgroundColor: theme.palette.primary.main } },
}));

enum Tabs {
  language = 'Language',
  theme = 'Theme',
}

const routes: TRoute[] = Object.entries(Tabs).map(([key, value]) => ({
  key,
  component: lazy(() => import(`./${value}`)),
}));

const Preference: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const tab = useMemo(() => pathname.replace(`${path}/`, ''), [pathname, path]);
  const handleClose = useCallback(() => {
    dispatch(layoutActions.closePreference());
  }, [dispatch]);

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title='Preferences'
    >
      <div className={classes.menu}>
        {Object.entries(Tabs).map(([key, value]) => (
          <Button
            component={Link}
            to={`${path}/${key}`}
            key={`preference-menu-${key}`}
            classes={{
              root: classes.menuItem,
              containedPrimary: classes.selectedMenuItem,
            }}
            variant={tab === key ? 'contained' : 'text'}
            color={tab === key ? 'primary' : undefined}
            disableRipple
          >
            {value}
          </Button>
        ))}
      </div>
      <div className={classes.content}>
        <Switch>
          {routes.map(({
            key,
            ...props
          }) => (
            <Route
              key={`app-route-${key}`}
              path={`${path}/${key}`}
              {...props}
            />
          ))}
        </Switch>
      </div>
    </Modal>
  );
};

export default Preference;
