import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { RootState } from 'store/types';
import { timeTagToTimestamp } from 'utils/parse';
import { timeTagRegex } from 'utils/regex';

const OFFSET = 0;
const LINE_COUNT = 3;

const useStyles = makeStyles((theme) => createStyles({
  main: {
    display: 'inline-flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(2),
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    alignItems: 'center',
    textAlign: 'center',
    whiteSpace: 'nowrap',
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
  },
}));

const selector = ({
  music: {
    list,
    lastSelected,
  },
}: RootState) => (lastSelected !== undefined ? list[lastSelected] : undefined);

interface Row {
  timestamp: string,
  time: number,
  text: string,
  id: ReturnType<typeof uuid>,
}

const Main: React.FC = () => {
  const domRef = useRef<HTMLDivElement | null>(null);
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [time, setTime] = useState(0);
  const [index, setIndex] = useState(0);
  const music = useSelector(selector);
  const lyrics = useMemo(() => {
    if (!music?.lyric?.length) {
      return undefined;
    }
    if (!timeTagRegex.test(music.lyric)) {
      return undefined;
    }
    return music.lyric.split('\n').reduce((arr, row) => {
      const matches = row.match(timeTagRegex);
      if (!matches) {
        return arr;
      }
      const [timestamp] = matches;
      const item: Row = {
        timestamp,
        time: timeTagToTimestamp(timestamp),
        text: row.replace(timestamp, '').replace('/\r/', ''),
        id: uuid(),
      };
      return arr.concat([item]);
    }, [] as Row[]);
  }, [music?.lyric]);

  useEffect(() => {
    let timerId: number | null = null;
    if (music?.position) {
      setTime(music.position);
      timerId = window.setInterval(() => {
        setTime((currentTime) => currentTime + 0.095);
      }, 100);
    }
    return () => {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };
  }, [music?.position]);

  useEffect(() => {
    if (lyrics) {
      setIndex(lyrics.findIndex(({ time: lyricTime }) => lyricTime > time - OFFSET));
    }
  }, [time, lyrics]);

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
      const rect = domRef.current.getBoundingClientRect();
      setWidth(rect.width);
      setHeight(rect.height);
    }
  }, [index, domRef]);

  useEffect(() => {
    window.bridge.ipc.send('LAYOUT.RESIZE_WINDOW', { width, height });
  }, [width, height]);

  if (!selectedLyrics?.length) {
    return null;
  }

  return (
    <div className={classes.main} style={{ width, height }}>
      <div className={classes.wrap} ref={domRef}>
        {selectedLyrics.map(({
          text,
          id,
        }) => (
          <div key={`lyric-row-${id}`} className={classes.row}>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
