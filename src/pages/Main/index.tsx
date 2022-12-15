import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';
import { RootState } from 'store/types';

import { BackgroundColor, FontColor } from '../../store/layout/types';

type Props = {
  lineCount: number;
  lyricSize: number;
  fontColor: FontColor;
  backgroundOpacity: number;
  backgroundColor: BackgroundColor;
};

const useStyles = makeStyles<Theme, Props>((theme) => createStyles({
  main: {
    position: 'fixed',
    display: 'inline-flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2),
    flexGrow: 1,
    alignItems: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    transition: 'width .3s, height .3s',
    width: '100%',
    height: '100%',
    '-webkit-app-region': 'drag',
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    transition: 'width .3s, height .3s, opacity .3s',
    backgroundColor: ({ backgroundColor }) => backgroundColor,
    opacity: ({ backgroundOpacity }) => backgroundOpacity,
    zIndex: 0,
  },
  draggableOff: {
    '-webkit-app-region': 'no-drag',
    '&:hover': { opacity: 0 },
  },
  wrap: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    transition: 'top .3s',
  },
  row: {
    display: 'inline-flex',
    color: ({ fontColor }) => fontColor,
    textShadow: '0px 0px 8px rgba(0,255,255,.68)',
    fontSize: ({ lyricSize }) => lyricSize,
    userSelect: 'none',
    transition: 'opacity .3s',
  },
  hidden: { opacity: 0 },
}));

const selector = ({
  music: {
    list,
    lastSelected,
    isPlaying,
    currentOffset,
    globalOffset,
  },
  layout: {
    lineCount,
    lyricSize,
    fontColor,
    backgroundOpacity,
    backgroundColor,
  },
  preference: { draggable },
}: RootState) => ({
  music: (lastSelected !== undefined ? list[lastSelected] : undefined),
  isPlaying,
  currentOffset,
  globalOffset,
  draggable,
  lineCount,
  lyricSize,
  fontColor,
  backgroundOpacity,
  backgroundColor,
}
);

const Main: React.FC = () => {
  const theme = useTheme();
  const domRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(0);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(0);
  const {
    isPlaying,
    music,
    currentOffset,
    globalOffset,
    draggable, lineCount,
    lyricSize, fontColor,
    backgroundOpacity,
    backgroundColor,
  } = useSelector(selector);
  const classes = useStyles({
    lineCount,
    lyricSize,
    fontColor,
    backgroundOpacity,
    backgroundColor,
  });
  const lyrics = useMemo(() => music?.lyric?.map((lyric, i) => ({
    ...lyric,
    isSelected: !!lyric.text.length
      && (i === index || lyric.time <= (time + 10 * index))
      && i < index + lineCount
      && i >= index,
  })), [music?.lyric, time, index, lineCount]);

  useEffect(() => {
    let timerId: number | null = null;
    if (isPlaying) {
      setTime(position);
      timerId = window.setInterval(() => {
        setTime((currentTime) => currentTime + 0.03);
      }, 30);
    }
    return () => {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };
  }, [position, isPlaying]);

  useEffect(() => {
    if (lyrics) {
      const offsetSum = currentOffset + globalOffset;
      const nextIndex = lyrics.findIndex(({ time: lyricTime }) => lyricTime > time - offsetSum);
      setIndex((nextIndex === -1 ? lyrics.length : nextIndex) - 1);
    }
  }, [time, lyrics, globalOffset, currentOffset]);

  useEffect(() => {
    if (index >= 0 && domRef.current) {
      const selectedEls = [...domRef.current.children].filter((el) => el.getAttribute('data-selected') === 'true');
      const { width, height } = selectedEls.reduce((obj, selectedEl) => ({
        ...obj,
        width: Math.max(obj.width, selectedEl.clientWidth),
        height: obj.height + selectedEl.clientHeight,
      }), { width: 0, height: 0 });
      window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', {
        width: width + theme.spacing(8),
        height: height + theme.spacing(2),
      });
      if (selectedEls[0]) {
        const [parentTop, childTop] = [domRef.current, selectedEls[0]]
          .map((el) => el.getBoundingClientRect().top);
        domRef.current.style.top = `${parentTop - childTop + theme.spacing(1)}px`;
      }
    }
  }, [index, domRef, theme]);

  useEffect(() => {
    // avoid using redux for update immediately
    window.bridge.ipc.receive(getType(musicActions.seekMusic), (data: Music) => {
      if (data.position) {
        setTime(data.position);
        setPosition(data.position);
      }
    });
  }, []);

  if (!lyrics?.length) {
    return null;
  }

  return (
    <>
      <div
        className={clsx(classes.main, { [classes.draggableOff]: !draggable })}
      >
        <div
          className={classes.background}
        />
        <div
          className={classes.wrap}
          ref={domRef}
        >
          {lyrics.map(({
            text,
            isSelected,
            id,
          }) => (
            <div
              key={`lyric-row-${id}`}
              data-selected={isSelected}
              className={clsx(classes.row, !isSelected && classes.hidden)}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Main;
