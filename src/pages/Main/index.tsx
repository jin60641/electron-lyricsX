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
} from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';
import { RootState } from 'store/types';

interface Props {
  lineCount: number;
  lyricSize: number;
  fontColor: string;
  backgroundOpacity: number;
  backgroundColor: string;
}

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
    alignItems: 'flex-end',
    flexDirection: 'row',
    opacity: 0,
  },
  shown: {
    opacity: 1,
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    '& ~ &': {
      marginTop: theme.spacing(-1),
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
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
});

const Main: React.FC = () => {
  const domRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(0);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(0);
  const {
    isPlaying,
    music,
    currentOffset,
    globalOffset,
    lineCount,
    lyricSize,
    fontColor,
    draggable,
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
      && (lyric.time <= (time + 10))
      && i < index + lineCount
      && i >= index,
  })), [music?.lyric, time, index, lineCount]);
  const selectedLyricsCount = useMemo(() => lyrics
    ?.filter(({ isSelected }) => isSelected)?.length, [lyrics]);

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
    if (
      domRef.current
      && index >= 0
      && lineCount
      && selectedLyricsCount !== undefined
      && lyricSize
      && currentOffset !== undefined
      && globalOffset !== undefined
    ) {
      const selectedEls = [...domRef.current.children].filter((el) => el.getAttribute('data-selected') === 'true');
      const windowSize = selectedEls.reduce((obj, selectedEl) => ({
        ...obj,
        width: Math.max(obj.width, selectedEl.clientWidth),
        height: obj.height + selectedEl.clientHeight,
      }), { width: 0, height: 0 });
      window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', windowSize);
      if (selectedEls[0]) {
        const [parentTop, childTop] = [domRef.current, selectedEls[0]]
          .map((el) => el.getBoundingClientRect().top);
        domRef.current.style.top = `${parentTop - childTop}px`;
      }
    }
  }, [
    domRef,
    index,
    lineCount,
    currentOffset,
    globalOffset,
    lyricSize,
    selectedLyricsCount,
  ]);

  useEffect(() => {
    // avoid using redux for update immediately
    window.bridge.ipc.receive(getType(musicActions.seekMusic), (data: Music) => {
      console.log(data);
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
              className={clsx(classes.row, isSelected && classes.shown)}
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
