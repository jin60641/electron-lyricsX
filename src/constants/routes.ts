import { FC } from 'react';

import { RouteProps } from 'react-router-dom';

export interface Route extends RouteProps {
  key: string;
  component: FC<any>;
}
