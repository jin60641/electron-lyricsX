import { FC } from 'react';

import { RouteProps } from 'react-router-dom';

interface Route extends RouteProps {
  key: string;
  component: FC<any>;
}

const routes: Route[] = [];

export default routes;
