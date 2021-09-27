import React, { useCallback } from 'react';

import Divider from '@material-ui/core/Divider';
import MuiDrawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import layoutActions from 'store/layout/actions';
import { drawerWidth } from 'store/layout/types';
import { RootState } from 'store/types';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 0,
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerContent: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  list: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  drawerPaper: { width: drawerWidth },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 64,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  drawerShift: { width: drawerWidth },
}));

const selector = ({
  music: {
    lastSelected,
    list,
  },
  layout: { drawer: isOpen },
}: RootState) => ({
  music: (lastSelected !== undefined) ? list[lastSelected] : undefined,
  isOpen,
});

const Drawer: React.FC = () => {
  const dispatch = useDispatch();
  const {
    music,
    isOpen,
  } = useSelector(selector, shallowEqual);
  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerClose = useCallback(() => {
    dispatch(layoutActions.setDrawer(false));
  }, [dispatch]);

  return (
    <MuiDrawer
      className={clsx(classes.drawer, isOpen && classes.drawerShift)}
      variant='persistent'
      anchor='left'
      open={isOpen}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <div className={classes.drawerContent}>
        <List className={classes.list}>
          <ListItem>
            <textarea
              value={music?.lyric}
            />
          </ListItem>
        </List>
      </div>
    </MuiDrawer>
  );
};

export default Drawer;
