import * as delegate from 'delegates';
import { Application } from './application';
import * as http from 'http'
import request from './request';
import response from './response';

export default class Context {
  app: Application
  req: http.ClientRequest
  res: http.ServerResponse
  state = {}
  request: request
  response: response
  constructor(req, res, app){
    this.req = req
    this.res = res
    this.app = app
  }
  get cookies(){
    return 'cookies'
  }
}

delegate(Context.prototype, 'response')
  .access('status')
  .access('body')
  .access('length')
  .access('type')
  .getter('headerSent')

delegate(Context.prototype, 'request')
  .getter('header')
