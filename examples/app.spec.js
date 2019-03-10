import app from '../lib/application'

let x = new app();

x.use(async (ctx, next) => {
  console.log(ctx)
  console.log("0");
  await next();
  ctx.body = 'Hello world!'
  console.log("1");
});

x.use(async (ctx, next) => {
  console.log("2");
  await next();
  console.log("3");
});

x.listen(8083)
