import { test, expect } from '@playwright/test';
import { BookingApiClient } from '../../integrations/api/BookingApiClient';
import bookingTestData from '../../data/booking-test-data.json';
import { Logger } from '../../utils/logger';

test('@smoke @api RB-102 should get booking ids', async ({ request }) => {
  const bookingApiClient = new BookingApiClient(request);

  const response = await bookingApiClient.getBookingIds();

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBeTruthy();
  expect(responseBody.length).toBeGreaterThan(0);
});

test('@regression @api RB-103 should create a new booking', async ({ request }) => {
  Logger.info('Creating a new booking using API');

  const bookingApiClient = new BookingApiClient(request);

  const response = await bookingApiClient.createBooking(bookingTestData.validBooking);

  Logger.info(`Create booking API response status: ${response.status()}`);

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  Logger.info(`Created booking ID: ${responseBody.bookingid}`);

  expect(responseBody).toHaveProperty('bookingid');
  expect(responseBody.booking.firstname).toBe(bookingTestData.validBooking.firstname);
  expect(responseBody.booking.lastname).toBe(bookingTestData.validBooking.lastname);
});