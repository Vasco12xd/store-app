import { ok, fail, Result } from './result';

describe('Result - Railway Oriented Programming', () => {
  describe('ok', () => {
    it('should create a success result', () => {
      const result = ok('value');
      expect(result.ok).toBe(true);
    });

    it('should contain the value', () => {
      const result = ok(42);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('should work with objects', () => {
      const data = { id: '1', name: 'test' };
      const result = ok(data);
      if (result.ok) {
        expect(result.value).toEqual(data);
      }
    });

    it('should work with null', () => {
      const result = ok(null);
      expect(result.ok).toBe(true);
    });
  });

  describe('fail', () => {
    it('should create a failure result', () => {
      const result = fail('error message');
      expect(result.ok).toBe(false);
    });

    it('should contain the error', () => {
      const result = fail('something went wrong');
      if (!result.ok) {
        expect(result.error).toBe('something went wrong');
      }
    });

    it('should work with error objects', () => {
      const error = { code: 404, message: 'not found' };
      const result = fail(error);
      if (!result.ok) {
        expect(result.error).toEqual(error);
      }
    });
  });

  describe('type narrowing', () => {
    it('should narrow to Success when ok is true', () => {
      const result: Result<string> = ok('hello');
      if (result.ok) {
        expect(result.value).toBe('hello');
      } else {
        fail('Should not reach here');
      }
    });

    it('should narrow to Failure when ok is false', () => {
      const result: Result<string> = fail('error');
      if (!result.ok) {
        expect(result.error).toBe('error');
      } else {
        fail('Should not reach here');
      }
    });
  });
});