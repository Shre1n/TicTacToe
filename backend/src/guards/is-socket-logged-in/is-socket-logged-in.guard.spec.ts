import { IsSocketLoggedInGuard } from './is-socket-logged-in.guard';

describe('IsSocketLoggedInGuard', () => {
  it('should be defined', () => {
    expect(new IsSocketLoggedInGuard()).toBeDefined();
  });
});
