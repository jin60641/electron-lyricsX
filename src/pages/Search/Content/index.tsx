import React, { useCallback, useRef } from 'react';

import {
  Table as MuiTable,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TableBody,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import musicActions from 'store/music/actions';
import { RootState } from 'store/types';

const TableContainer = withStyles({
  root: {
    height: '30vh',
    width: '100%',
    borderBottom: 'solid gray 1px',
    flexGrow: 1,
    flexShrink: 0,
  },
})(MuiTableContainer);

const Table = withStyles({
  root: {
    width: '100%',
    tableLayout: 'fixed',
    overflowWrap: 'break-word',
  },
})(MuiTable);

const TableHead = withStyles({ root: { borderBottom: 'solid 1px gray' } })(MuiTableHead);

const selector = ({
  music: {
    list,
    lastSelected,
  },
}: RootState) => ({
  list,
  lastSelected,
});

const TableRow = withStyles((theme) => ({
  root: {
    cursor: 'pointer',
    '&:nth-of-type(odd)': { backgroundColor: theme.palette.grey[200] },
    '&:focus': { backgroundColor: theme.palette.grey[500] },
    '&:hover': { backgroundColor: theme.palette.grey[500] },
    '&.Mui-selected': { backgroundColor: theme.palette.grey[700] },
    '&.Mui-selected:hover': { backgroundColor: theme.palette.grey[800] },
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
  const { list, lastSelected } = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  const handleFocusRow = useCallback((i: number) => {
    dispatch(musicActions.setLastSelected(i));
  }, [dispatch]);

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    switch (e.key) {
      case 'ArrowUp':
        if (lastSelected > 0) {
          (tbodyRef.current?.children[lastSelected - 1] as HTMLElement)?.focus();
        }
        break;
      case 'ArrowDown':
        if (lastSelected < list.length - 1) {
          (tbodyRef.current?.children[lastSelected + 1] as HTMLElement)?.focus();
        }
        break;
      default: break;
    }
  }, [lastSelected, list, tbodyRef]);

  return (
    <TableContainer
      onKeyDown={handleOnKeyDown}
    >
      <Table size='small' stickyHeader>
        <TableHead>
          <MuiTableRow>
            <TableCell>제목</TableCell>
            <TableCell>아티스트</TableCell>
            <TableCell width={120}>출처</TableCell>
          </MuiTableRow>
        </TableHead>
        <TableBody ref={tbodyRef}>
          {list.map(({ name, artist, source }, i) => (
            <TableRow
              // eslint-disable-next-line react/no-array-index-key
              key={`SearchRow-${i}`}
              role='button'
              tabIndex={i}
              selected={lastSelected === i}
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
