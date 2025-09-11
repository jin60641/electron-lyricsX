import koaCors from '@koa/cors';
import http from 'http';
import Koa from 'koa';
import router from './router';
import koaBody from 'koa-body';

const app = new Koa();

app.use(koaCors({ origin: '*' }));
app.use(koaBody.default());
app.use(router.routes());

const server = http.createServer(app.callback());
server.listen(15252);
server.timeout = 60 * 10 * 1000;

export default server;
