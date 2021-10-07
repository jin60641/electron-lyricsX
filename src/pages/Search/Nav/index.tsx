import React from 'react';

import Artist from './Artist/index';
import SearchBtn from './SearchBtn/index';
import Title from './Title/index';

interface Props {
  className: string
}

const Nav: React.FC<Props> = ({ className }) => (
  <nav className={className}>
    <Title />
    <Artist />
    <SearchBtn />
  </nav>
);

export default Nav;
