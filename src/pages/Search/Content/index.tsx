import React from 'react';

import LyricList from './LyricTable';

interface Props {
  className: string
}
const Content: React.FC<Props> = ({ className }) => (
  <div className={className}>
    <LyricList />
  </div>
);

export default Content;
