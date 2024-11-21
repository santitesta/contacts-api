import { GlobalExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new GlobalExceptionFilter()).toBeDefined();
  });
});
