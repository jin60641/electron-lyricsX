import React from 'react';
import { styled } from '@mui/material/styles';
import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from '@renderer/store/types';
import { LyricFormat } from '@repo/types';

//
// 스타일 정의 (theme 없이 static 스타일)
//
const RootContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  flex: '1 1 auto',
  padding: '16px', // spacing 2
});

const LyricParagraph = styled('p')({
  padding: 0,
  margin: 0,
});

const Timestamp = styled('span')({
  marginRight: '8px', // spacing 1
});

//
// 리덕스 상태 선택자
//
const selector = ({ music: { list, lastSelected } }: RootState) => ({
  list,
  lastSelected,
});

const Lyric: React.FC = () => {
  const { list, lastSelected } = useSelector(selector, shallowEqual);

  return (
    <RootContainer>
      {list[lastSelected]?.lyric?.map((lyric) => (
        <LyricParagraph key={`lyric-row-${lyric.id}`}>
          <Timestamp>
            {new Date(lyric.time * 1000).toISOString().replace(/.*T/, '[').replace('Z', ']')}
          </Timestamp>
          {(lyric.format === LyricFormat.KRC ? lyric.words : [{ text: lyric.text }]).map(
            (word, i) => (
              <span
                key={`lyric-word-${lyric.id}-${i}`}
                dangerouslySetInnerHTML={{ __html: word.text }}
              />
            ),
          )}
        </LyricParagraph>
      ))}
    </RootContainer>
  );
};

export default Lyric;
