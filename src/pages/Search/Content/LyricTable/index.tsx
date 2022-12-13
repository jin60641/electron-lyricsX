import React, { useCallback, useRef } from 'react';

import {
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import musicActions from 'store/music/actions';
import { RootState } from 'store/types';

const TableHead = withStyles({ root: { borderBottom: 'solid 1px gray' } })(MuiTableHead);

const selector = ({
  music: {
    list,
    searchList,
    searchIndex,
  },
}: RootState) => ({
  list,
  searchList,
  searchIndex,
});

const TableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': { backgroundColor: theme.palette.grey[100] },
    '&:hover': { backgroundColor: theme.palette.grey[800] },
    '&:focus': { backgroundColor: theme.palette.grey[800] },
  },
}))(MuiTableRow);

const TableCell = withStyles({
  root: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
})(MuiTableCell);

const LyricTable = () => {
  // const classes = useStyles();
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  const { searchList, searchIndex } = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  const handleFocusRow = useCallback((i: number) => {
    dispatch(musicActions.setSearchIndex(i));
  }, [dispatch]);

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (searchIndex > 0) {
          (tbodyRef.current?.children[searchIndex - 1] as HTMLElement)?.focus();
        }
        break;
      case 'ArrowDown':
        if (searchIndex < searchList.length - 1) {
          (tbodyRef.current?.children[searchIndex + 1] as HTMLElement)?.focus();
        }
        break;
      default: break;
    }
  }, [searchIndex, searchList, tbodyRef]);

  return (
    <TableContainer
      component={Paper}
      onKeyDown={handleOnKeyDown}
    >
      <Table size='small'>
        <TableHead>
          <MuiTableRow>
            <TableCell>제목</TableCell>
            <TableCell>아티스트</TableCell>
            <TableCell>출처</TableCell>
          </MuiTableRow>
        </TableHead>
        <TableBody ref={tbodyRef}>
          {searchList.map(({ name, artist, source }, i) => (
            <TableRow
              // eslint-disable-next-line react/no-array-index-key
              key={`SearchRow-${i}`}
              // className={classes.focused}
              role='button'
              tabIndex={i}
              onFocus={() => handleFocusRow(i)}
            >
              <TableCell>{name}</TableCell>
              <TableCell>{artist}</TableCell>
              <TableCell>{source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LyricTable;
