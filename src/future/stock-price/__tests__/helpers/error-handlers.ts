import { Type } from '@nestjs/common';

export const testErrorHandling = async (
  operation: () => Promise<any>,
  ErrorType: Type<Error>,
  errorMessage: string,
  mockFn?: jest.SpyInstance,
) => {
  await expect(operation()).rejects.toThrow(ErrorType);

  await expect(operation()).rejects.toThrow(errorMessage);

  if (mockFn) {
    expect(mockFn).not.toHaveBeenCalled();
  }
};
