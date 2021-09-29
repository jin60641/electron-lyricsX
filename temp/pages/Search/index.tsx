import React, { useCallback, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import Modal from 'components/Modal';
import musicActions from 'store/music/actions';
import { RootState } from 'store/types';
import { getImageSize, Size } from 'utils/image';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  body: {
    width: '100%',
    display: 'flex',
    flex: 1,
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  img: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    paddingTop: 'calc(100% - 2px)',
    borderRadius: 4,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    border: `1px solid ${theme.palette.grey[400]}`,
    cursor: 'pointer',
    boxSizing: 'border-box',
    marginBottom: theme.spacing(0.5),
    overflow: 'hidden',
  },
  selected: {
    backgroundColor: 'rgba(0,0,0,.8)',
    width: '100%',
    paddingTop: '100%',
    top: 0,
    position: 'absolute',
    opacity: 0,
    transition: 'opacity .2s',
  },
  selectedOn: { opacity: 1 },
  selectedIcon: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    fontSize: 80,
  },
  footer: {
    display: 'flex',
    padding: theme.spacing(2),
  },
}));

const selector = ({ music: { search } }: RootState) => [
  ...new Set(search.map(({ lyric }) => lyric)),
];

const initialSize: Size = { width: 0, height: 0 };

const Search: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const list = useSelector(selector);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [sizes, setSizes] = useState<Size[]>([]);

  const handleClose = useCallback(() => {
    setSelected(undefined);
    dispatch(musicActions.resetSearch());
  }, [dispatch]);

  useEffect(() => {
    if (list) {
      Promise
        .all(list.map((src) => (src ? getImageSize(src) : null)))
        .then((nextSizes) => {
          setSizes(nextSizes.map((size) => (size === null ? initialSize : size)));
        });
    }
  }, [list]);

  const handleSubmit = useCallback(() => {
    // dispatch(musicActions.setInputPicture(selected));
    handleClose();
  }, [handleClose]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  }, []);

  if (!list.length) {
    return null;
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title='Search'
    >
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.body}>
          <div className={classes.grid}>
            {list.map((picture, i) => (!picture ? null : (
              <label
                key={`search-picture-${picture}`}
                className={classes.wrap}
              >
                <div
                  className={classes.img}
                  style={{ backgroundImage: `url('${picture}')` }}
                >
                  <div
                    className={clsx(
                      classes.selected,
                      selected === picture && classes.selectedOn,
                    )}
                  >
                    <CheckCircleIcon className={classes.selectedIcon} color='primary' />
                  </div>
                </div>
                {sizes[i] && (
                <Typography variant='body1'>
                  {sizes[i].width}
                  x
                  {sizes[i].height}
                </Typography>
                )}
                <input
                  hidden
                  type='radio'
                  name='search-picture'
                  value={picture}
                  onChange={handleChange}
                />
              </label>
            )))}
          </div>
        </div>
        <div className={classes.footer}>
          <Button
            type='submit'
            color='primary'
            disabled={!selected}
            variant='contained'
            onClick={handleSubmit}
          >
            Select
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Search;
