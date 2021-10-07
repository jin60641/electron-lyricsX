import React from 'react';

interface Props {
  className: string
}
const Content: React.FC<Props> = ({ className }) => (
  <div className={className} />
);

export default Content;
