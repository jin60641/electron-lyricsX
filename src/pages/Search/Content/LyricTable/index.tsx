import React, { useEffect, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import musicActions from 'store/music/actions';
import { RootState } from 'store/types';

/**
 * 1. 각 div resizable하게 변경
 * 2. article에서 하단 도달 시 scroll 되도록 변경
 * 3. 이벤트 처리 리팩토링
 * 4. lyric area에서 onBlur시 row 배경 회색으로 변경
 */
const useStyles = makeStyles({
  rowWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  th: {
    position: 'sticky',
    top: '0',
    backgroundColor: '#6b6b6b',
  },
  table: { width: '100%' },
  child: {
    flex: '1',
    border: 'solid 1px gray',
  },
});
const selector = ({
  music: {
    searchList,
    searchIndex,
  },
}: RootState) => ({
  searchList,
  searchIndex,
});

const FOCUSED_COLOR = '#1E90FF';
const BLURED_COLOR = 'black';

const LyricTable = () => {
  const { searchList, searchIndex } = useSelector(selector);
  const dispatch = useDispatch();
  const classes = useStyles();
  const tbody = useRef<HTMLTableSectionElement>(null);

  const getFocusedRow = () => (tbody.current?.childNodes[searchIndex] as HTMLTableRowElement);
  const getIndexOfNode = (target: HTMLTableRowElement) => {
    const childNodes = tbody.current?.childNodes;

    for (let i = 0, len = childNodes?.length ?? 0; i < len; i += 1) {
      if (childNodes![i] === target) return i;
    }
    return 0;
  };
  const changeRowBgColor = (target: HTMLTableRowElement, color: string) => {
    target.style.backgroundColor = color; // eslint-disable-line no-param-reassign
  };
  const moveRow = (target: HTMLTableRowElement, gap: number) => {
    target.blur();
    dispatch(musicActions.setSearchIndex(searchIndex + gap));
  };
  const handleOnBlur = () => {
    changeRowBgColor(getFocusedRow(), BLURED_COLOR);
  };
  const handleOnFocus = (e: React.FocusEvent<HTMLTableRowElement>) => {
    const target = e.target.closest('tr');

    if (target) {
      changeRowBgColor(target, FOCUSED_COLOR);
      dispatch(musicActions.setSearchIndex(getIndexOfNode(target)));
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        if (searchIndex > 0) {
          moveRow(getFocusedRow(), -1);
        }
        break;
      case 'ArrowDown':
        if (searchIndex < searchList.length - 1) {
          moveRow(getFocusedRow(), 1);
        }
        break;
      default: break;
    }
  };
  useEffect(() => {
    getFocusedRow()?.focus();
  }, [searchIndex]);
  return (
    <table className={classes.table}>
      <thead className={classes.th}>
        <tr className={classes.rowWrapper}>
          <th className={classes.child}>제목</th>
          <th className={classes.child}>아티스트</th>
          <th className={classes.child}>소스</th>
        </tr>
      </thead>
      <tbody ref={tbody}>
        {searchList.map((info) => (
          <tr className={classes.rowWrapper} onFocus={handleOnFocus} onBlur={handleOnBlur} onKeyDown={handleOnKeyDown} role='row' tabIndex={0}>
            <td className={classes.child}>{info.title}</td>
            <td className={classes.child}>{info.artist}</td>
            <td className={classes.child}>{info.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LyricTable;
