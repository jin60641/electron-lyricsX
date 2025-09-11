import React, { useEffect, useMemo, useRef, useState } from 'react';

import { styled, alpha, useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from '@renderer/store/music/actions';
import { RootState } from '@renderer/store/types';
import { Info, KrcRow, KrcWord, LyricFormat } from '@renderer/types';

type LayoutConfig = Omit<RootState['layout'], 'lineCount' | 'palette'>;

const selector = ({
  music: { list, lastSelected, isPlaying, currentOffset, globalOffset },
  layout: { lineCount, palette: _palette, ...layout },
  preference: { draggable, showTlit, showFurigana },
}: RootState) => ({
  music: list[lastSelected],
  isPlaying,
  currentOffset,
  globalOffset,
  draggable,
  lineCount,
  layout,
  showTlit,
  showFurigana,
});

const MainContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'draggable',
})<{ draggable: boolean }>(({ draggable }) => ({
  position: 'fixed',
  display: 'inline-flex',
  flexDirection: 'column',
  flexGrow: 1,
  alignItems: 'center',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  width: '100%',
  height: '100%',
  WebkitAppRegion: draggable ? 'drag' : 'no-drag',
  ...(draggable === false && {
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 0,
    },
  }),
}));

const Background = styled('div')<LayoutConfig>(({ backgroundColor, backgroundOpacity, theme }) => ({
  borderRadius: theme.spacing(2),
  width: '100%',
  height: '100%',
  position: 'fixed',
  transition: 'opacity .3s',
  backgroundColor,
  opacity: backgroundOpacity,
  zIndex: 0,
}));

const Wrap = styled('div')(() => ({
  whiteSpace: 'pre',
  position: 'absolute',
  top: 0,
  zIndex: 1,
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'top .3s',
}));

const Row = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ isSelected }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  opacity: isSelected ? 1 : 0,
  transition: 'opacity .3s',
}));

const RowInner = styled('div')<LayoutConfig>(({ fontColor, fontSize, fontOpacity }) => ({
  color: fontColor,
  fontSize,
  userSelect: 'none',
  alignItems: 'flex-end',
  flexDirection: 'row',
  display: 'flex',
  '& > span': {
    opacity: fontOpacity,
    paddingTop: fontSize / 2,
  },
}));

const Word = styled('span')<LayoutConfig>(
  ({
    fontColor,
    fontOpacity,
    progressColor,
    progressOpacity,
    textShadowSize,
    textShadowColor,
    textShadowOpacity,
  }) => ({
    backgroundImage: `linear-gradient(to right, ${alpha(progressColor, progressOpacity)} 50%, ${alpha(fontColor, fontOpacity)} 50%)`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: '100%',
    backgroundSize: '200%',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    transitionProperty: 'background-position-x',
    WebkitFilter: `drop-shadow(0px 0px ${textShadowSize}px ${alpha(textShadowColor, textShadowOpacity)})`,
  }),
);

const LrcRow = styled('div')<LayoutConfig>(
  ({ textShadowSize, textShadowColor, textShadowOpacity }) => ({
    textShadow: `0px 0px ${textShadowSize}px ${alpha(textShadowColor, textShadowOpacity)}`,
  }),
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
    draggable,
    layout,
    lineCount,
    showTlit,
    showFurigana,
  } = useSelector(selector);

  const offsetSum = useMemo(() => currentOffset + globalOffset, [currentOffset, globalOffset]);

  const lyrics = useMemo(
    () =>
      music?.lyric?.map((lyric, i) => ({
        ...lyric,
        isSelected: lyric.time <= time + 10 - offsetSum && i < index + lineCount && i >= index,
      })),
    [music?.lyric, time, index, lineCount, offsetSum],
  );

  const filteredLyricsCount = useMemo(
    () => lyrics?.filter(({ isSelected }) => isSelected)?.length,
    [lyrics],
  );

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
      }
    };
  }, [position, isPlaying]);

  useEffect(() => {
    if (lyrics) {
      const nextIndex = lyrics.findIndex(({ time: lyricTime }) => lyricTime > time - offsetSum);
      setIndex((nextIndex === -1 ? lyrics.length : nextIndex) - 1);
    }
  }, [time, lyrics, offsetSum]);

  useEffect(() => {
    if (domRef.current && index >= 0 && lineCount) {
      const selectedEls = Array.from(
        domRef.current.querySelectorAll('[data-selected=true]'),
      ) as HTMLDivElement[];
      const windowSize: { width: number; height: number } = selectedEls.reduce(
        (prev, el) => ({
          width: Math.max(prev.width, el.clientWidth + parseInt(theme.spacing(8), 10)),
          height: prev.height + el.clientHeight,
        }),
        { width: 0, height: parseInt(theme.spacing(2), 10) } as { width: number; height: number },
      );

      if (filteredLyricsCount) {
        window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', windowSize);
      } else {
        window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', { width: 0, height: 0 });
      }

      if (selectedEls[0]) {
        const parentTop = domRef.current.getBoundingClientRect().top;
        const childTop = selectedEls[0].getBoundingClientRect().top;
        domRef.current.style.top = `${parentTop - childTop + parseInt(theme.spacing(1), 10)}px`;
      }
    }
  }, [
    domRef,
    index,
    lineCount,
    filteredLyricsCount,
    theme,
    showFurigana,
    showTlit,
    music?.hasTlit,
  ]);

  useEffect(() => {
    window.bridge.ipc.receive(getType(musicActions.seekMusic), (rawData) => {
      const data = rawData as Info;
      if (data.position) {
        setTime(data.position);
        setPosition(data.position);
      }
    });
  }, []);

  const renderWord = (lyric: KrcRow, words: KrcWord[]) =>
    words.map((word, i) => {
      const wordStart = word.time + lyric.time + offsetSum;
      const wordFinish = wordStart + word.duration;
      const fullFill = wordFinish <= time;
      const percent = Math.min(100, (1 - (time - wordStart) / word.duration) * 100);

      return (
        <Word
          key={`lyric-row-${lyric.id}-word-${i}`}
          {...layout}
          style={{ backgroundPositionX: `${fullFill ? 0 : percent}%` }}
          dangerouslySetInnerHTML={{ __html: showFurigana ? word.text : word.srcText }}
        />
      );
    });

  return (
    <MainContainer draggable={draggable}>
      <Background {...layout} />
      <Wrap ref={domRef}>
        {lyrics?.map(({ isSelected, ...lyric }) =>
          lyric.format === LyricFormat.KRC ? (
            <Row key={`lyric-row-${lyric.id}`} isSelected={isSelected} data-selected={isSelected}>
              <RowInner {...layout}>{renderWord(lyric, lyric.words)}</RowInner>
              {showTlit && lyric.tlitWords && (
                <RowInner {...layout}>{renderWord(lyric, lyric.tlitWords)}</RowInner>
              )}
            </Row>
          ) : (
            <LrcRow key={`lyric-row-${lyric.id}`} {...layout} data-selected={isSelected}>
              <RowInner {...layout}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: showFurigana ? lyric.text : lyric.srcText,
                  }}
                />
              </RowInner>
              {showTlit && lyric.tlitText && (
                <RowInner {...layout}>
                  <span>{lyric.tlitText}</span>
                </RowInner>
              )}
            </LrcRow>
          ),
        )}
      </Wrap>
    </MainContainer>
  );
};

export default Main;
