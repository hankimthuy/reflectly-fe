import { describe, it, expect } from 'vitest';
import { ENTRY_TEMPLATES, EntryTemplateKey, getEntryTemplate } from '../entryTemplate';

describe('entryTemplate model', () => {
  it('should define exactly the 3 default templates', () => {
    expect(ENTRY_TEMPLATES).toHaveLength(3);
    expect(ENTRY_TEMPLATES.map(t => t.key)).toEqual([
      EntryTemplateKey.DIFFICULT_CONVERSATION,
      EntryTemplateKey.ENERGY_DRAIN,
      EntryTemplateKey.GRATITUDE_WIN,
    ]);
  });

  it('should give every template a label key, description key and 3-5 guiding question keys', () => {
    ENTRY_TEMPLATES.forEach((template) => {
      expect(template.labelKey).toMatch(/^entryTemplates\.templates\..+\.label$/);
      expect(template.descriptionKey).toMatch(/^entryTemplates\.templates\..+\.description$/);
      expect(template.questionKeys.length).toBeGreaterThanOrEqual(3);
      expect(template.questionKeys.length).toBeLessThanOrEqual(5);
      template.questionKeys.forEach((key) => {
        expect(key).toMatch(/^entryTemplates\.templates\..+\.questions\.\d+$/);
      });
    });
  });

  describe('getEntryTemplate', () => {
    it('should return the matching template for a known key', () => {
      const template = getEntryTemplate(EntryTemplateKey.GRATITUDE_WIN);
      expect(template?.key).toBe(EntryTemplateKey.GRATITUDE_WIN);
    });

    it('should return undefined for an unknown key', () => {
      expect(getEntryTemplate('not_a_real_template')).toBeUndefined();
    });

    it('should return undefined when no key is provided', () => {
      expect(getEntryTemplate(undefined)).toBeUndefined();
      expect(getEntryTemplate(null)).toBeUndefined();
    });
  });
});
