import { IsSocketAdminGuard } from './is-socket-admin.guard';

describe('IsSocketAdminGuard', () => {
  it('should be defined', () => {
    expect(new IsSocketAdminGuard()).toBeDefined();
  });
});
