import { generateClickId, isValidClickId } from '@/lib/tracking/clickId';

describe('Click ID Generation', () => {
  describe('generateClickId', () => {
    it('should generate a valid UUID v4', () => {
      const clickId = generateClickId();
      expect(clickId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique IDs', () => {
      const id1 = generateClickId();
      const id2 = generateClickId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with correct length', () => {
      const clickId = generateClickId();
      expect(clickId.length).toBe(36); // UUID v4 format: 8-4-4-4-12
    });
  });

  describe('isValidClickId', () => {
    it('should validate correct UUID v4 format', () => {
      const validId = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidClickId(validId)).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      expect(isValidClickId('not-a-uuid')).toBe(false);
      expect(isValidClickId('12345')).toBe(false);
      expect(isValidClickId('')).toBe(false);
    });

    it('should validate UUID format', () => {
      // Test with a valid UUID v4
      const v4Id = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidClickId(v4Id)).toBe(true);
    });

    it('should handle edge cases', () => {
      expect(isValidClickId(null as any)).toBe(false);
      expect(isValidClickId(undefined as any)).toBe(false);
    });
  });
});

