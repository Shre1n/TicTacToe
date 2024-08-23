import {BaseWsExceptionFilter, WsException} from "@nestjs/websockets";
import {ArgumentsHost, Catch, HttpException} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(new WsException(exception.getResponse()), host);
  }
}