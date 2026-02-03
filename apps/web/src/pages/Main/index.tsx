import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { getType } from 'typesafe-actions';

import musicActions from '@renderer/store/music/actions';
import { RootState } from '@renderer/store/types';
import { Info, KrcRow, KrcWord, LyricFormat } from '@repo/types';

// [중요] 스타일을 함수 외부에서 정의하여 매 렌더링마다 객체가 생성되지 않도록 함
const staticStyles = {
  main: {
    position: 'fixed' as const,
    display: 'inline-flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    alignItems: 'center',
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
    top: 0,
    WebkitAppRegion: 'drag',
  },
  wrap: {
    whiteSpace: 'pre' as const,
    position: 'absolute' as const,
    top: 0,
    zIndex: 1,
    display: 'inline-flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    transition: 'top .3s',
  },
  row: {
    display: 'inline-flex',
    flexDirection: 'column' as const,
    opacity: 0,
    alignItems: 'center',
    transition: 'opacity .3s',
  },
  shown: { opacity: 1 },
};

const selector = ({ music, layout, preference }: RootState) => ({
  music: music.list[music.lastSelected],
  isPlaying: music.isPlaying,
  currentOffset: music.currentOffset,
  globalOffset: music.globalOffset,
  draggable: preference.draggable,
  lineCount: layout.lineCount,
  layout, // 전체 레이아웃 정보
  showTlit: preference.showTlit,
  showFurigana: preference.showFurigana,
});

const Main: React.FC = () => {
  const theme = useTheme();
  const domRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(0);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(0);
  const [maxWindowSize, setMaxWindowSize]= useState({ width: 0 , height: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const {
    isPlaying, music, currentOffset, globalOffset,
    draggable, layout, lineCount, showTlit, showFurigana,
  } = useSelector(selector);

  const offsetSum = useMemo(() => currentOffset + globalOffset, [currentOffset, globalOffset]);

  // 가사 데이터 가공
  const lyrics = useMemo(() => music?.lyric?.map((lyric, i) => ({
    ...lyric,
    isSelected: (lyric.time <= (time + 10 - offsetSum)) && i < index + lineCount && i >= index,
  })), [music?.lyric, time, index, lineCount, offsetSum]);

  const filteredLyricsCount = useMemo(() => lyrics?.filter(({ isSelected }) => isSelected)?.length, [lyrics]);

  // 타이머 로직
  useEffect(() => {
    let timerId: number | null = null;
    if (isPlaying) {
      setTime(position);
      timerId = window.setInterval(() => setTime((c) => c + 0.03), 30);
    }
    return () => { if (timerId) window.clearInterval(timerId); };
  }, [position, isPlaying]);

  // 인덱스 계산
  useEffect(() => {
    if (lyrics) {
      const nextIndex = lyrics.findIndex(({ time: lyricTime }) => lyricTime > time - offsetSum);
      setIndex((nextIndex === -1 ? lyrics.length : nextIndex) - 1);
    }
  }, [time, lyrics, offsetSum]);

  // 레이아웃 리사이징 및 스크롤 위치 계산
  useEffect(() => {
    if (domRef.current && index >= 0 && lineCount) {
      const selectedEls = Array.from(domRef.current.querySelectorAll('[data-selected=true]')) as HTMLElement[];
      
      // theme.spacing(n)이 문자열이므로 숫자로 변환 (1단위 = 8px 기준)
      const space8 = 8 * 8; 
      const space1 = 1 * 8;

      const windowSize = selectedEls.reduce((prev, el) => ({
        width: Math.max(prev.width, el.clientWidth + space8),
        height: prev.height + el.clientHeight + space1,
      }), { width: 0, height: space1 });

      setWindowSize(windowSize);
      window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', filteredLyricsCount ? windowSize : { width: 0, height: 0 });

      if (selectedEls[0]) {
        const parentTop = domRef.current.getBoundingClientRect().top;
        const childTop = selectedEls[0].getBoundingClientRect().top;
        domRef.current.style.top = `${parentTop - childTop + space1}px`;
      }
    }
  }, [domRef, index, lineCount, filteredLyricsCount, showFurigana, showTlit, music?.hasTlit]);


    // 레이아웃 리사이징 및 스크롤 위치 계산
  useEffect(() => {
    if (domRef.current && index >= 0) {
      const selectedEls = Array.from(domRef.current.children) as HTMLElement[];

      // theme.spacing(n)이 문자열이므로 숫자로 변환 (1단위 = 8px 기준)
      const space8 = 8 * 8;
      const space1 = 1 * 8;

      const windowSize = selectedEls.reduce((prev, el) => ({
        width: Math.max(prev.width, el.clientWidth + space8),
        height: Math.max(prev.height + el.clientHeight + space1),
      }), { width: 0, height: 0 });

      setMaxWindowSize(windowSize);
    }
  }, [domRef, index, filteredLyricsCount, showFurigana, showTlit, music?.hasTlit]);

  // IPC 수신
  useEffect(() => {
    window.bridge.ipc.receive(getType(musicActions.seekMusic), (data: Info) => {
      if (data.position) {
        setTime(data.position);
        setPosition(data.position);
      }
    });
  }, []);

  // 동적 인라인 스타일 생성 함수 (성능을 위해 useMemo 없이 직접 반환)
  const getWordStyle = (fullFill: boolean, percent: number) => ({
    backgroundImage: `linear-gradient(to right, ${alpha(layout.progressColor, layout.progressOpacity)} 50%, ${alpha(layout.fontColor, layout.fontOpacity)} 50%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '200%',
    backgroundPositionX: `${fullFill ? 0 : percent}%`,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitFilter: `drop-shadow(0px 0px ${layout.textShadowSize}px ${alpha(layout.textShadowColor, layout.textShadowOpacity)})`,
    transitionProperty: 'background-position-x',
  });

  const renderWord = (lyric: KrcRow, words: KrcWord[]) => words.map((word, i) => {
    const wordStart = word.time + lyric.time + offsetSum;
    const percent = Math.min(100, (1 - (time - wordStart) / word.duration) * 100);
    const fullFill = (wordStart + word.duration) <= time;

    return (
      <span
        key={`lyric-row-${lyric.id}-word-${i}`}
        dangerouslySetInnerHTML={{ __html: showFurigana ? word.text : word.srcText }}
        style={getWordStyle(fullFill, percent)}
      />
    );
  });


  return (
    <div style={{ ...staticStyles.main, width: maxWindowSize.width, left: -maxWindowSize.width/2 + windowSize.width / 2 + 2, height: windowSize.height }}>
      {/* Background (인라인 스타일) */}
      <div style={{
        borderRadius: '16px',
        position: 'fixed',
        transition: 'opacity .3s',
        backgroundColor: layout.backgroundColor,
        opacity: layout.backgroundOpacity,
        zIndex: 0,
        ...windowSize,
      }} />
      
      <div style={{
        ...staticStyles.wrap,
        width: '100%',
        height: '100%',
        left: 0,
      }} ref={domRef}>
        {lyrics?.map(({ isSelected, ...lyric }) => (
          <div
            key={`lyric-row-${lyric.id}`}
            data-selected={isSelected}
            style={{
              ...staticStyles.row,
              opacity: isSelected ? 1 : 0,
              textShadow: lyric.format !== LyricFormat.KRC 
                ? `0px 0px ${layout.textShadowSize}px ${alpha(layout.textShadowColor, layout.textShadowOpacity)}` 
                : undefined
            }}
          >
            <div style={{
              color: layout.fontColor,
              fontSize: layout.fontSize,
              lineHeight: `${layout.fontSize}px`,
              userSelect: 'none',
              alignItems: 'flex-end',
              flexDirection: 'row',
              display: 'inline-flex',
              paddingTop: layout.fontSize / 4,
            }}>
              {lyric.format === LyricFormat.KRC ? (
                renderWord(lyric, lyric.words)
              ) : (
                <span 
                  style={{ opacity: layout.fontOpacity }}
                  dangerouslySetInnerHTML={{ __html: showFurigana ? lyric.text : lyric.srcText }} 
                />
              )}
            </div>
            {showTlit && (lyric.format === LyricFormat.KRC ? lyric.tlitWords : lyric.tlitText) && (
              <div style={{
                color: layout.fontColor,
                fontSize: layout.fontSize,
                lineHeight: `${layout.fontSize}px`,
                userSelect: 'none',
                alignItems: 'flex-end',
                flexDirection: 'row',
                display: 'inline-flex',
                paddingTop: layout.fontSize / 4,
              }}>
                {lyric.format === LyricFormat.KRC 
                  ? renderWord(lyric, lyric.tlitWords!) 
                  : <span style={{ opacity: layout.fontOpacity }}>{lyric.tlitText}</span>
                }
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
