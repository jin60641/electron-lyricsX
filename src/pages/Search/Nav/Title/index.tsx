import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import layoutAction from 'store/layout/actions';
import { RootState } from 'store/types';

const useStyle = makeStyles({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: '1',
  },
  label: {
    fontSize: '15px',
    marginRight: '10px',
  },
  input: { fontSize: '15px' },
});

const selector = ({ layout: { title } }: RootState) => (title);
const Title = () => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const title = useSelector(selector);
  const handleOnChange = useCallback((e) => {
    dispatch(layoutAction.setTitle(e.target.value));
  }, [dispatch]);

  return (
    <div className={classes.title}>
      <label className={classes.label} htmlFor='title'>제목: </label>
      <input className={classes.input} name='title' type='text' value={title} onChange={handleOnChange} size={30} />
    </div>
  );
};

export default Title;
