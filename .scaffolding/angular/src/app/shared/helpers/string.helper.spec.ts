import { truncate, capitalize, slugify } from './string.helper';

describe('string.helper', () => {
  describe('truncate', () => {
    it('should return the string unchanged when shorter than limit', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate and append ellipsis when over limit', () => {
      expect(truncate('hello world', 5)).toBe('hello...');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('angular')).toBe('Angular');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should lowercase the rest of the string', () => {
      expect(capitalize('aNGULAR')).toBe('Angular');
    });
  });

  describe('slugify', () => {
    it('should convert spaces to hyphens and lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should strip special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('should handle multiple consecutive spaces', () => {
      expect(slugify('hello   world')).toBe('hello-world');
    });
  });
});
