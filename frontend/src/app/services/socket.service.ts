import { Injectable } from '@angular/core';

import { Socket, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    autoConnect: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket{

  constructor() {
    super(config);
  }
}
