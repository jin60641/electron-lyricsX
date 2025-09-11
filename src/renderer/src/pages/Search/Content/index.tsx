import React, { useCallback, useRef } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { styled } from '@mui/material/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import musicActions from '@renderer/store/music/actions';
import { RootState } from '@renderer/store/types';

// 스타일드 컴포넌트 정의

const StyledTableContainer = styled(TableContainer)({
  height: '30vh',
  width: '100%',
  borderBottom: 'solid gray 1px',
  flexGrow: 1,
  flexShrink: 0,
});

const StyledTable = styled(Table)({
  width: '100%',
  tableLayout: 'fixed',
  overflowWrap: 'break-word',
});

const StyledTableHead = styled(TableHead)({
  borderBottom: 'solid 1px gray',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[200],
  },
  '&:focus': {
    backgroundColor: theme.palette.grey[500],
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[500],
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.grey[700],
  },
  '&.Mui-selected:hover': {
    backgroundColor: theme.palette.grey[800],
  },
}));

const StyledTableCell = styled(TableCell)({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

// selector
const selector = ({ music: { list, lastSelected } }: RootState) => ({
  list,
  lastSelected,
});

const LyricTable = () => {
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  const { list, lastSelected } = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();

  const handleFocusRow = useCallback(
    (i: number) => {
      dispatch(musicActions.setLastSelected(i));
    },
    [dispatch],
  );

  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
        default:
          break;
      }
    },
    [lastSelected, list],
  );

  return (
    <StyledTableContainer onKeyDown={handleOnKeyDown}>
      <StyledTable size="small" stickyHeader>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>제목</StyledTableCell>
            <StyledTableCell>아티스트</StyledTableCell>
            <StyledTableCell width={120}>출처</StyledTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody ref={tbodyRef}>
          {list.map(({ name, artist, source }, i) => (
            <StyledTableRow
              key={`SearchRow-${i}`}
              role="button"
              tabIndex={i}
              selected={lastSelected === i}
              onFocus={() => handleFocusRow(i)}
            >
              <StyledTableCell>{name}</StyledTableCell>
              <StyledTableCell>{artist}</StyledTableCell>
              <StyledTableCell>{source}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default LyricTable;
