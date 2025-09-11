import 'koa';

declare module 'koa' {
  interface Request {
    body: unknown;
  }
}

declare module 'koa-body' {
  import { Middleware } from 'koa';
  const koaBody: () => Middleware;
  export = { default: koaBody };
}

