import React from 'react';

import LyricTable from './LyricTable';

interface Props {
  className: string
}
const Content: React.FC<Props> = ({ className }) => (
  <div className={className}>
    <LyricTable />
  </div>
);

export default Content;
