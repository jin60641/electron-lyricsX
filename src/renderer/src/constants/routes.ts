import { FC } from 'react';
import { RouteProps } from 'react-router-dom';

export type Route = RouteProps & {
  key: string;
  component: FC;
};
