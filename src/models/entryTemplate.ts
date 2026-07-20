export const EntryTemplateKey = {
  DIFFICULT_CONVERSATION: 'difficult_conversation',
  ENERGY_DRAIN: 'energy_drain',
  GRATITUDE_WIN: 'gratitude_win'
} as const;

export type EntryTemplateKey = typeof EntryTemplateKey[keyof typeof EntryTemplateKey];

export interface EntryTemplate {
  key: EntryTemplateKey;
  icon: string;
  labelKey: string;
  descriptionKey: string;
  questionKeys: string[];
}

export const ENTRY_TEMPLATES: EntryTemplate[] = [
  {
    key: EntryTemplateKey.DIFFICULT_CONVERSATION,
    icon: '💬',
    labelKey: 'entryTemplates.templates.difficult_conversation.label',
    descriptionKey: 'entryTemplates.templates.difficult_conversation.description',
    questionKeys: [
      'entryTemplates.templates.difficult_conversation.questions.0',
      'entryTemplates.templates.difficult_conversation.questions.1',
      'entryTemplates.templates.difficult_conversation.questions.2',
      'entryTemplates.templates.difficult_conversation.questions.3'
    ]
  },
  {
    key: EntryTemplateKey.ENERGY_DRAIN,
    icon: '🔋',
    labelKey: 'entryTemplates.templates.energy_drain.label',
    descriptionKey: 'entryTemplates.templates.energy_drain.description',
    questionKeys: [
      'entryTemplates.templates.energy_drain.questions.0',
      'entryTemplates.templates.energy_drain.questions.1',
      'entryTemplates.templates.energy_drain.questions.2',
      'entryTemplates.templates.energy_drain.questions.3'
    ]
  },
  {
    key: EntryTemplateKey.GRATITUDE_WIN,
    icon: '🌟',
    labelKey: 'entryTemplates.templates.gratitude_win.label',
    descriptionKey: 'entryTemplates.templates.gratitude_win.description',
    questionKeys: [
      'entryTemplates.templates.gratitude_win.questions.0',
      'entryTemplates.templates.gratitude_win.questions.1',
      'entryTemplates.templates.gratitude_win.questions.2',
      'entryTemplates.templates.gratitude_win.questions.3'
    ]
  }
];

export const getEntryTemplate = (key?: string | null): EntryTemplate | undefined => {
  if (!key) return undefined;
  return ENTRY_TEMPLATES.find(template => template.key === key);
};
