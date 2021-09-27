import React from 'react';

import {
  // useDispatch,
  useSelector,
} from 'react-redux';

import { RootState } from 'store/types';

const selector = ({ layout: { search: isVisible } }: RootState) => ({ isVisible });

const Search = () => {
  const { isVisible } = useSelector(selector);
  // const dispatch = useDispatch();
  if (!isVisible) {
    return null;
  }
  return (
    <div>
      {`${isVisible}`}
    </div>
  );
};

export default Search;
