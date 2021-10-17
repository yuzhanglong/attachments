import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

// 指定一个url匹配
router.get('/', async (ctx) => {
  ctx.body = 'base!';
});

// 指定一个url匹配
router.get('/hello_world', async (ctx) => {
  ctx.body = 'hello world!';
});

app.use(router.routes());

app.listen(8001, () => {
  console.log('server is running on http://localhost:8001');
});
