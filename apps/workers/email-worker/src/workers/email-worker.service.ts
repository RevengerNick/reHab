import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
