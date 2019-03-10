// Manage middleware and handle request
import * as http from "http";
import Context from "./context";
import Request from './request';
import Response from './response';

export class Application {
  middleware: Array<Function> = [];
  env = process.env.NODE_ENV || "development";
  constructor() {}

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  // 把回调从createServer中拆分出来
  // 这样用户可以创建多个服务监听不同端口
  // const app = new Koa();
  // http.createServer(app.callback()).listen(3000);
  // https.createServer(app.callback()).listen(3001);
  callback() {
    const fn = this.compose(this.middleware);
    return (req, res) => {
      // Create context for every request
      const ctx = this.createContext(req,res)
      fn(ctx)
        .then(() => {
          res.end(ctx.body);
        })
        .catch(error => {
          res.end(error.message)
        });
    };
  }
  compose(middleware: Array<Function>) {
    for (let f of middleware) {
      if (typeof f !== "function") {
        throw new Error("中间件必须是函数");
      }
    }
    return (context) => {
      return new Promise((resolve, reject) => {
        let index = -1;
        run.call(this, 0);
        function run(i) {
          if (i <= index) {
            reject("不能调用多次next");
          }
          index = i;
          if (middleware[i]) {
            try {
              middleware[i](context, run.bind(this, i + 1));
            } catch (error) {
              reject(error);
            }
          }
        }
        resolve();
      });
    };
  }
  use(m: Function) {
    this.middleware.push(m);
  }
  createContext(req, res) {
    const context = new Context(req, res, this);
    const response = new Response(req, res, this);
    const request = new Request(req, res, this);
    context.request = response.request = request;
    context.response = request.response = response;

    return context;
  }
}
