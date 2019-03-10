import * as http from 'http'
import { Application } from './application';
import response from './response';
export default class request {
  req: http.ClientRequestArgs
  res: http.ServerResponse
  app: Application
  response: response
  constructor(req, res, app){
    this.req = req
  }
  get header(){
    return this.req.headers
  }
  set header(val){
    this.req.headers = val
  }
}
