import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import musicActions from 'store/music/actions';
import { RootState } from 'store/types';

const useStyles = makeStyles({
  th: { borderBottom: 'solid 1px gray' },
  evenTr: { backgroundColor: 'black' },
  cell: {
    textOverflowX: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
});
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

const FOCUSED_COLOR = '#1E90FF';
const EVEN_BLURED_COLOR = '#000000';
const ODD_BLURED_COLOR = '#313131';
const BLURED_COLOR = '#717171';
const UP = 1;
const DOWN = -1;

const LyricTable = () => {
  const { list, searchList, searchIndex } = useSelector(selector, shallowEqual);
  const classes = useStyles();
  const dispatch = useDispatch();
  const tbody = useRef<HTMLTableSectionElement>(null);

  const getCurrentRow = useCallback(() => (
    tbody.current?.childNodes[searchIndex] as HTMLTableRowElement),
  [searchIndex]);
  const getIndexOfNode = (target: HTMLTableRowElement) => {
    const childNodes = tbody.current?.childNodes;

    for (let i = 0, len = childNodes?.length ?? 0; i < len; i += 1) {
      if (childNodes![i] === target) return i;
    }
    return 0;
  };
  const getCurrentRowColor = useCallback(() => (
    searchIndex % 2 === 0 ? EVEN_BLURED_COLOR : ODD_BLURED_COLOR),
  [searchIndex]);
  const changeRowBgColor = useCallback((target: HTMLTableRowElement, color: string) => {
    target.style.backgroundColor = color; // eslint-disable-line no-param-reassign
  }, []);
  const moveRow = useCallback((gap: number) => {
    dispatch(musicActions.setSearchIndex(searchIndex + gap));
    changeRowBgColor(getCurrentRow(), getCurrentRowColor());
  }, [searchIndex, dispatch, changeRowBgColor, getCurrentRow, getCurrentRowColor]);
  const handleOnBlur = useCallback(() => {
    changeRowBgColor(getCurrentRow(), BLURED_COLOR);
  }, [changeRowBgColor, getCurrentRow]);
  const handleOnFocus = useCallback((e: React.FocusEvent) => {
    const { target } = e;

    if (target.tagName === 'TR') {
      changeRowBgColor(getCurrentRow(), getCurrentRowColor());
      changeRowBgColor(target as HTMLTableRowElement, FOCUSED_COLOR);
      dispatch(musicActions.setSearchIndex(getIndexOfNode(target as HTMLTableRowElement)));
    }
  }, [changeRowBgColor, dispatch, getCurrentRow, getCurrentRowColor]);

  const handleOnKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (searchList.length === 0) {
          if (searchIndex > 0) {
            moveRow(DOWN);
          }
        } else if (searchIndex > 0) {
          moveRow(DOWN);
        }
        break;
      case 'ArrowDown':
        if (searchList.length === 0) {
          if (searchIndex < list.length - 1) {
            moveRow(UP);
          }
        } else if (searchIndex < searchList.length - 1) {
          moveRow(UP);
        }
        break;
      default: break;
    }
  }, [list.length, moveRow, searchIndex, searchList.length]);
  useEffect(() => { // 새로 검색을 할때마다 0번째 인덱스에 포커스
    if (searchList.length > 0) getCurrentRow()?.focus();
    else if (list.length > 0) getCurrentRow()?.focus();
  }, [searchList, getCurrentRow, list]);
  useEffect(() => { // 인덱스가 변경 될 때마다 포커스 변경
    getCurrentRow()?.focus();
  }, [searchIndex, getCurrentRow]);
  return (
    <TableContainer
      component={Paper}
      onKeyDown={handleOnKeyDown}
      onFocus={handleOnFocus}
    >
      <Table size='small'>
        <TableHead className={classes.th}>
          <TableRow>
            <TableCell align='left'>제목</TableCell>
            <TableCell align='left'>아티스트</TableCell>
            <TableCell align='left'>출처</TableCell>
          </TableRow>
        </TableHead>
        <TableBody ref={tbody}>
          {searchList.length === 0
            ? list.map(({ name, artist, source }, i) => (
              <TableRow
                className={i % 2 === 0 ? classes.evenTr : undefined}
                onBlur={handleOnBlur}
                tabIndex={0}
              >
                <TableCell align='left' className={classes.cell}>{name}</TableCell>
                <TableCell align='left' className={classes.cell}>{artist}</TableCell>
                <TableCell align='left' className={classes.cell}>{source}</TableCell>
              </TableRow>
            ))
            : searchList.map(({ name, artist, source }, i) => (
              <TableRow
                className={i % 2 === 0 ? classes.evenTr : undefined}
                onBlur={handleOnBlur}
                tabIndex={0}
              >
                <TableCell align='left' className={classes.cell}>{name}</TableCell>
                <TableCell align='left' className={classes.cell}>{artist}</TableCell>
                <TableCell align='left' className={classes.cell}>{source}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LyricTable;
