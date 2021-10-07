import React from 'react';

interface Props {
  className: string
}
const Lyric: React.FC<Props> = ({ className }) => (
  <div className={className}>Lyric</div>
);

export default Lyric;
