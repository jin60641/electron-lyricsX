import React, { useCallback } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Modal from 'components/Modal';
import layoutActions from 'store/layout/actions';
import { PreferenceState } from 'store/layout/types';
import { RootState } from 'store/types';

import Language from './Language';
import Theme from './Theme';

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

const selector = ({ layout: { preference } }: RootState) => preference;

const Map: {
  [key in PreferenceState]: React.FC<any>
} = {
  [PreferenceState.theme]: Theme,
  [PreferenceState.language]: Language,
};

const Preference: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const page = useSelector(selector);

  const handleClickMenu = useCallback((key: PreferenceState) => {
    dispatch(layoutActions.setPreference(key));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(layoutActions.setPreference(undefined));
  }, [dispatch]);

  if (!page) {
    return null;
  }

  const Component = Map[page];

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title='Preferences'
    >
      <div className={classes.menu}>
        {Object.values(PreferenceState).map((key) => (
          <Button
            key={`preference-menu-${key}`}
            onClick={() => handleClickMenu(key)}
            classes={{
              root: classes.menuItem,
              containedPrimary: classes.selectedMenuItem,
            }}
            variant={page === key ? 'contained' : 'text'}
            color={page === key ? 'primary' : undefined}
            disableRipple
          >
            {key}
          </Button>
        ))}
      </div>
      <div className={classes.content}>
        <Component />
      </div>
    </Modal>
  );
};

export default Preference;
