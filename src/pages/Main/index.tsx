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
import { alpha } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from 'store/music/actions';
import { Music } from 'store/music/types';
import { RootState } from 'store/types';

type Props = Omit<RootState['layout'], 'lineCount' | 'palette'>;

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
    transition: 'opacity .3s',
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
    textShadow: ({ textShadowSize, textShadowColor, textShadowOpacity }) => `0px 0px ${textShadowSize}px ${alpha(textShadowColor, textShadowOpacity)}`,
    fontSize: ({ fontSize }) => fontSize,
    userSelect: 'none',
    alignItems: 'flex-end',
    flexDirection: 'row',
    opacity: 0,
    transition: 'opacity .3s',
  },
  shown: { opacity: ({ fontOpacity }) => fontOpacity },
  '@keyframes stripes': { to: { backgroundPositionX: '0px' } },
  word: {
    backgroundImage: ({ fontColor, textShadowColor }) => `linear-gradient(to right, ${textShadowColor} 50%, ${fontColor} 50%)`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: '100%',
    backgroundSize: '200%',
    'text-fill-color': 'transparent',
    'background-clip': 'text',
    '-webkit-background-clip': 'text',
    animationName: '$stripes',
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
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
    palette,
    ...layout
  },
  preference: { draggable },
}: RootState) => ({
  music: (lastSelected !== undefined ? list[lastSelected] : undefined),
  isPlaying,
  currentOffset,
  globalOffset,
  draggable,
  lineCount,
  layout,
});

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
    draggable,
    layout,
    lineCount,
  } = useSelector(selector);
  const classes = useStyles(layout);
  const lyrics = useMemo(() => music?.lyric?.map((lyric, i) => ({
    ...lyric,
    isSelected: (lyric.time <= (time + 10))
      && i < index + lineCount
      && i >= index,
  })), [music?.lyric, time, index, lineCount]);
  const filteredLyricsCount = useMemo(() => lyrics
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

  const offsetSum = useMemo(() => currentOffset + globalOffset, [currentOffset, globalOffset]);
  useEffect(() => {
    if (lyrics) {
      const nextIndex = lyrics.findIndex(({ time: lyricTime }) => lyricTime > time - offsetSum);
      setIndex((nextIndex === -1 ? lyrics.length : nextIndex) - 1);
    }
  }, [time, lyrics, offsetSum]);

  useEffect(() => {
    if (
      domRef.current
      && index >= 0
      && lineCount
    ) {
      const selectedEls = [...domRef.current.querySelectorAll('[data-selected=true]')];
      const windowSize = selectedEls.reduce((prev, selectedEl) => ({
        width: Math.max(prev.width, selectedEl.clientWidth + theme.spacing(8)),
        height: prev.height + selectedEl.clientHeight,
      }), { width: 0, height: theme.spacing(2) });
      if (filteredLyricsCount) {
        window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', windowSize);
      } else {
        window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', { width: 0, height: 0 });
      }
      if (selectedEls[0]) {
        const [parentTop, childTop] = [domRef.current, selectedEls[0]]
          .map((el) => el.getBoundingClientRect().top);
        domRef.current.style.top = `${parentTop - childTop + theme.spacing(1)}px`;
      }
    }
  }, [
    domRef,
    index,
    lineCount,
    filteredLyricsCount,
    theme,
  ]);

  useEffect(() => {
    // avoid using redux for update immediately
    window.bridge.ipc.receive(getType(musicActions.seekMusic), (data: Music) => {
      if (data.position) {
        setTime(data.position);
        setPosition(data.position);
      }
    });
  }, []);

  return (
    <div className={clsx(classes.main, { [classes.draggableOff]: !draggable })}>
      <div className={classes.background} />
      <div
        className={classes.wrap}
        ref={domRef}
      >
        {lyrics?.map(({
          isSelected,
          id,
          ...lyric
        }) => ((lyric.format === 'krc' ? (
          <div
            key={`lyric-row-${id}`}
            data-selected={isSelected}
            className={clsx(classes.row, isSelected && classes.shown)}
          >
            {lyric.words.map((word, i) => (
              <span
                // eslint-disable-next-line
                key={`lyric-row-${id}-word-${i}`}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: word.text }}
                className={clsx({
                  [classes.word]: (word.time + lyric.time
                  + offsetSum) <= time,
                })}
                style={{
                  animationDuration: `${(word.time + lyric.time
                  + currentOffset + globalOffset + word.duration) <= time
                    ? 0 : word.duration}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            key={`lyric-row-${id}`}
            data-selected={isSelected}
            className={clsx(classes.row, isSelected && classes.shown)}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: lyric.text }}
          />
        ))))}
      </div>
    </div>
  );
};

export default Main;
