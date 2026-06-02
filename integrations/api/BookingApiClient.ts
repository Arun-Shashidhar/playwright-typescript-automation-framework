import { APIRequestContext } from '@playwright/test';
import { ENV } from '../../utils/env';

export class BookingApiClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getBookingIds() {
    return await this.request.get(`${ENV.API_BASE_URL}/booking`);
  }

  async createBooking(bookingPayload: object) {
    return await this.request.post(`${ENV.API_BASE_URL}/booking`, {
      data: bookingPayload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }
}