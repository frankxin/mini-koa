import * as statuses from 'statuses'
import * as http from 'http'
import {Application} from './application'
import request from './request';
export default class response {
  _body = null
  _explicitStatus = false
  req: http.ClientRequest
  res: http.ServerResponse
  app: Application
  request: request
  constructor(req, res, app){
    this.req = req
    this.res = res
    this.app = app
  }
  get status(){
    return this.res.statusCode
  }
  set status(code: number){
    if(this.headerSent) return;
    this.res.statusCode = code
    this._explicitStatus = true
    if(statuses.empty[code]) this.body = null
  }

  get headerSent() {
    return this.res.headersSent;
  }

  get body() {
    return this._body;
  }

  set body(val) {
    this._body = val;

    // If not explicit status, we set status to 200
    if (!this._explicitStatus) this.status = 200;

    // set the content-type only if not yet set
    const setType = !this.header['content-type'];

    // string
    if ('string' == typeof val) {
      if (setType) this.type = /^\s*</.test(val) ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8';
      this.length = Buffer.byteLength(val);
      return;
    }
  }
  get header() {
    return this.res.getHeaders()
  }

  set length(val){
    this.res.setHeader('Content-Length', val);
  }

  get length(){
    const len = this.header['content-length'];
    return len || 0
  }
  set type(t: string){
    this.res.setHeader('Content-Type', t);
  }
  get type(){
    const type = this.header['Content-Type'] as string
    return type ? type : ''
  }
}
