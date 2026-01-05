import { generateUTMParams } from '@/lib/tracking';

describe('UTM Parameter Generation', () => {
  describe('generateUTMParams', () => {
    it('should generate UTM parameters for search', () => {
      const params = generateUTMParams('stays', 'results_row', 'New York');
      
      expect(params).toHaveProperty('utm_source', 'alotrips');
      expect(params).toHaveProperty('utm_medium', 'affiliate');
      expect(params).toHaveProperty('utm_campaign', 'hotels');
      expect(params).toHaveProperty('utm_content', 'results_row');
      expect(params).toHaveProperty('utm_term', 'New York');
    });

    it('should generate UTM parameters for click', () => {
      const params = generateUTMParams('flights', 'results_row', 'JFK-LAX');
      
      expect(params).toHaveProperty('utm_source', 'alotrips');
      expect(params).toHaveProperty('utm_medium', 'affiliate');
      expect(params).toHaveProperty('utm_campaign', 'flights');
      expect(params).toHaveProperty('utm_content', 'results_row');
      expect(params).toHaveProperty('utm_term', 'JFK-LAX');
    });

    it('should handle empty content', () => {
      const params = generateUTMParams('stays', 'results_row', '');
      
      expect(params).toHaveProperty('utm_source', 'alotrips');
      expect(params).toHaveProperty('utm_medium', 'affiliate');
      expect(params).toHaveProperty('utm_campaign', 'hotels');
      expect(params.utm_content).toBeDefined();
    });

    it('should handle special characters in content', () => {
      const params = generateUTMParams('stays', 'results_row', 'New York & Los Angeles');
      
      expect(params.utm_term).toContain('New York');
    });
  });
});

