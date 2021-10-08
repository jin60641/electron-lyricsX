import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';
import { RootState } from 'store/types';

const LINE_COUNT = 2;

type Props = {
  draggable: boolean;
};

const useStyles = makeStyles<Theme, Props>((theme) => createStyles({
  main: {
    display: 'inline-flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2),
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    alignItems: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    transition: 'width .3s, height .3s, opacity .3s',
    overflow: 'hidden',
    '-webkit-app-region': 'no-drag',
    '&:hover': { opacity: 0 },
  },
  draggableOn: {
    display: 'inline-flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2),
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    alignItems: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    transition: 'width .3s, height .3s, opacity 1s',
    overflow: 'hidden',
    '-webkit-app-region': 'drag',
  },

  wrap: {
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    display: 'inline-flex',
    flexDirection: 'column',
  },
  row: {
    display: 'inline-block',
    // TODO: CUSTOMIZE
    color: 'white',
    textShadow: '0px 0px 8px rgba(0,255,255,.68)',
    fontSize: 28,
    userSelect: 'none',
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
  layout: { draggable },
}: RootState) => ({
  music: (lastSelected !== undefined ? list[lastSelected] : undefined),
  isPlaying,
  currentOffset,
  globalOffset,
  draggable,
}
);

const Main: React.FC = () => {
  const domRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [position, setPosition] = useState(0);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(0);
  const { isPlaying, music, currentOffset, globalOffset, draggable } = useSelector(selector);
  const classes = useStyles({ draggable });
  const lyrics = useMemo(() => music?.lyric, [music?.lyric]);
  // const [opacity, setOpacity] = useState(1);

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

  const selectedLyrics = useMemo(() => (lyrics ? lyrics
    .slice(index, index + LINE_COUNT)
    .filter(({
      time: rowTime,
      text,
    }, i) => (
      text.length
      && (i === 0 || rowTime <= (time + 10 * i))
    )) : null), [lyrics, index, time]);

  useEffect(() => {
    if (index >= 0 && domRef.current) {
      setWidth(domRef.current.scrollWidth);
      setHeight(domRef.current.scrollHeight);
    }
  }, [index, domRef]);

  useEffect(() => {
    window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', { width, height });
  }, [width, height]);

  useEffect(() => {
    window.bridge.ipc.send('LAYOUT.CHANGE_DRAGGABLE', { draggable });
  }, [draggable]);

  useEffect(() => {
    // avoid using redux for update immediately
    window.bridge.ipc.receive(getType(musicActions.seekMusic), (data: Music) => {
      if (data.position) {
        setTime(data.position);
        setPosition(data.position);
      }
    });
  }, []);

  if (!selectedLyrics?.length) {
    return null;
  }

  return (
    <>
      <div
        className={draggable ? classes.draggableOn : classes.main}
        style={{ width, height }}
      >
        <div className={classes.wrap} ref={domRef}>
          {selectedLyrics.map(({
            text,
            id,
          }) => (
            // eslint-disable-next-line react/no-danger
            <div key={`lyric-row-${id}`} className={classes.row} dangerouslySetInnerHTML={{ __html: text }} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Main;
