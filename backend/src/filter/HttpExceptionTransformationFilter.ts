import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionTransformationFilter extends BaseWsExceptionFilter {
  /**
   * Transforms http exception to ws exception
   * @param exception
   * @param host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(new WsException(exception.getResponse()), host);
  }
}
