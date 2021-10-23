import Router from 'koa-router';

import playback from '../playback';

const router = new Router();

router.get('/health', (ctx) => {
  ctx.status = 200;
});
router.post('/chrome', (ctx) => {
  playback.handleData(ctx.request.body);
  ctx.status = 200;
});

export default router;
