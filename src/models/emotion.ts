export const Emotion = {
  HAPPY: 'happy',
  BLESSED: 'blessed',
  GOOD: 'good',
  CONFUSED: 'confused',
  BORED: 'bored',
  AWKWARD: 'awkward',
  ANGRY: 'angry',
  ANXIOUS: 'anxious',
  DOWN: 'down'
} as const;

export type Emotion = typeof Emotion[keyof typeof Emotion];

export interface EmotionData {
  id: Emotion;
  label: string;
  icon: string;
  color: string;
  description?: string;
}

export const EMOTION_DATA: Record<Emotion, EmotionData> = {
  [Emotion.HAPPY]: {
    id: Emotion.HAPPY,
    label: 'Happy',
    icon: '😊',
    color: '#FFD700',
    description: 'Feeling joyful and content'
  },
  [Emotion.BLESSED]: {
    id: Emotion.BLESSED,
    label: 'Blessed',
    icon: '🙏',
    color: '#FF6B6B',
    description: 'Feeling grateful and fortunate'
  },
  [Emotion.GOOD]: {
    id: Emotion.GOOD,
    label: 'Good',
    icon: '✌️',
    color: '#4ECDC4',
    description: 'Feeling positive and well'
  },
  [Emotion.CONFUSED]: {
    id: Emotion.CONFUSED,
    label: 'Confused',
    icon: '😕',
    color: '#95A5A6',
    description: 'Feeling uncertain or puzzled'
  },
  [Emotion.BORED]: {
    id: Emotion.BORED,
    label: 'Bored',
    icon: '😐',
    color: '#BDC3C7',
    description: 'Feeling uninterested or listless'
  },
  [Emotion.AWKWARD]: {
    id: Emotion.AWKWARD,
    label: 'Awkward',
    icon: '😅',
    color: '#F39C12',
    description: 'Feeling uncomfortable or embarrassed'
  },
  [Emotion.ANGRY]: {
    id: Emotion.ANGRY,
    label: 'Angry',
    icon: '😠',
    color: '#E74C3C',
    description: 'Feeling mad or frustrated'
  },
  [Emotion.ANXIOUS]: {
    id: Emotion.ANXIOUS,
    label: 'Anxious',
    icon: '😰',
    color: '#9B59B6',
    description: 'Feeling worried or nervous'
  },
  [Emotion.DOWN]: {
    id: Emotion.DOWN,
    label: 'Down',
    icon: '😔',
    color: '#34495E',
    description: 'Feeling sad or low'
  }
};
