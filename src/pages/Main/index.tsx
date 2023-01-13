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
import { RootState } from 'store/types';
import { Info } from 'types/lyric';

type Props = Omit<RootState['layout'], 'lineCount' | 'palette'>;

const useStyles = makeStyles<Theme, Props>((theme) => createStyles({
  main: {
    position: 'fixed',
    display: 'inline-flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    width: '100%',
    height: '100%',
    '-webkit-app-region': 'drag',
  },
  background: {
    borderRadius: theme.spacing(2),
    width: '100%',
    height: '100%',
    position: 'fixed',
    transition: 'opacity .3s',
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
    whiteSpace: 'pre',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'top .3s',
  },
  row: {
    display: 'inline-flex',
    flexDirection: 'column',
    opacity: 0,
    transition: 'opacity .3s',
  },
  rowInner: {
    color: ({ fontColor }) => fontColor,
    fontSize: ({ fontSize }) => fontSize,
    userSelect: 'none',
    alignItems: 'flex-end',
    flexDirection: 'row',
    '& > span': {
      opacity: ({ fontOpacity }) => fontOpacity,
      paddingTop: ({ fontSize }) => fontSize / 2,
    },
  },
  shown: { opacity: 1 },
  word: {
    backgroundImage: ({ fontColor, fontOpacity, progressColor, progressOpacity }) => `linear-gradient(to right, ${alpha(progressColor, progressOpacity)} 50%, ${alpha(fontColor, fontOpacity)} 50%)`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: '100%',
    backgroundSize: '200%',
    'text-fill-color': 'transparent',
    'background-clip': 'text',
    '-webkit-background-clip': 'text',
    transitionProperty: 'background-position-x',
    '-webkit-filter': ({ textShadowSize, textShadowColor, textShadowOpacity }) => `drop-shadow(0px 0px ${textShadowSize}px ${alpha(textShadowColor, textShadowOpacity)})`,
  },
  lrcRow: {
    // background-clip text와 text-shadow같이 사용할 때 shadow가 text를 침범하기 때문에 lrc 에만 text-shadow 사용
    textShadow: ({ textShadowSize, textShadowColor, textShadowOpacity }) => `0px 0px ${textShadowSize}px ${alpha(textShadowColor, textShadowOpacity)}`,
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
  music: list[lastSelected],
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
    window.bridge.ipc.receive(getType(musicActions.seekMusic), (data: Info) => {
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
            <div className={classes.rowInner}>
              {lyric.words.map((word, i) => {
                const wordStart = word.time + lyric.time + offsetSum;
                const wordFinish = wordStart + word.duration;
                const fullFill = wordFinish <= time;
                const percent = Math.min(100, (1 - (time - wordStart) / word.duration) * 100);
                return (
                  <span
                    // eslint-disable-next-line
                    key={`lyric-row-${id}-word-${i}`}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: word.text }}
                    className={classes.word}
                    style={{ backgroundPositionX: `${fullFill ? 0 : percent}%` }}
                  />
                );
              })}
            </div>
            {lyric.tlitWords && (
              <div className={classes.rowInner}>
                {lyric.tlitWords.map((word, i) => {
                  const wordStart = word.time + lyric.time + offsetSum;
                  const wordFinish = wordStart + word.duration;
                  const fullFill = wordFinish <= time;
                  const percent = Math.min(100, (1 - (time - wordStart) / word.duration) * 100);
                  return (
                    <span
                      // eslint-disable-next-line
                      key={`lyric-row-${id}-tlitWord-${i}`}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: word.text }}
                      className={classes.word}
                      style={{ backgroundPositionX: `${fullFill ? 0 : percent}%` }}
                    />
                  );
                })}

              </div>
            )}
          </div>
        ) : (
          <div
            key={`lyric-row-${id}`}
            data-selected={isSelected}
            className={clsx(classes.row, isSelected && classes.shown, classes.lrcRow)}
          >
            <div className={classes.rowInner}>
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: lyric.text }}
              />
            </div>
            {lyric.tlitText && (
              <div className={classes.rowInner}>
                <span>
                  {lyric.tlitText}
                </span>
              </div>
            )}
          </div>
        ))))}
      </div>
    </div>
  );
};

export default Main;
