import { Injectable } from '@nestjs/common';
import { RESPONSES } from '../constants/appConstants.json';

@Injectable()
export class ResponseHandlers {
  success(data: any, message = RESPONSES.SUCCESS) {
    return {
      message,
      success: true,
      data: data || {},
    };
  }

  error(message: string, data: any = {}) {
    return {
      message,
      success: false,
      data: data || {},
    };
  }
}
