import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuBookOpen, LuCompass, LuGrid2X2, LuScale, LuUserPlus, LuUsers } from 'react-icons/lu';
import FrameworkEntryForm, { stripMarkdown } from './FrameworkEntryForm';
import PersonForm from '../PersonForm/PersonForm';
import { useCreateSavedFrameworkEntryMutation } from '../../queries/savedFrameworkEntriesQueryHook';
import { useCreatePersonMutation } from '../../queries/peopleQueryHook';
import type { FrameworkType } from '../../models/savedFrameworkEntry';
import type { CreatePersonRequest } from '../../models/person';

interface InsightCatcherPanelProps {
  conversationId: string | null;
  /** Latest "Tóm tắt" text, if any — seeds the Free-form content field so the connection between
   * summarizing and saving is shown, not just explained (see plan doc, Phase 2b). */
  latestSummary?: string | null;
  /** A SavedFrameworkEntry (self insight or Life Positions) was saved — redirect to Đúc kết. */
  onSaved: (entryId: string) => void;
  /** A Person was added/updated via the PRM quick-add flow — redirect to "Thấu hiểu". */
  onPersonSaved: (personId: string) => void;
}

interface FrameworkOption {
  type: FrameworkType;
  labelKey: string;
  descKey: string;
  icon: typeof LuBookOpen;
}

const SELF_FRAMEWORK_OPTIONS: FrameworkOption[] = [
  { type: 'FREEFORM', labelKey: 'insightCatcher.freeformLabel', descKey: 'insightCatcher.freeformDesc', icon: LuBookOpen },
  { type: 'JOHARI_WINDOW', labelKey: 'insightCatcher.johariWindowLabel', descKey: 'insightCatcher.johariWindowDesc', icon: LuGrid2X2 },
  { type: 'ACT_MATRIX', labelKey: 'insightCatcher.actMatrix', descKey: 'insightCatcher.actMatrixDesc', icon: LuCompass },
  { type: 'PERSONAL_SWOT', labelKey: 'insightCatcher.personalSwot', descKey: 'insightCatcher.personalSwotDesc', icon: LuScale },
];

/**
 * Right-hand "catch an insight" column on the Aura chat page. Two groups, matching the user's
 * original split: "về bản thân" (self — Free-form/Johari/ACT Matrix/SWOT, saved as
 * SavedFrameworkEntry, shown on "Đúc kết") and "Bản đồ mối quan hệ (PRM)" (relationship — Life
 * Positions, also a SavedFrameworkEntry but tied to a Person; and the PRM quick-add/update-Person
 * flow, shown on "Thấu hiểu"). Each option is a labeled card with a one-line description — plain
 * icon+label buttons tested as unexplained jargon to anyone unfamiliar with these frameworks.
 */
const InsightCatcherPanel = ({ conversationId, latestSummary, onSaved, onPersonSaved }: InsightCatcherPanelProps) => {
  const { t } = useTranslation();
  const [activeFramework, setActiveFramework] = useState<FrameworkType | null>(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const createEntry = useCreateSavedFrameworkEntryMutation();
  const createPerson = useCreatePersonMutation();

  const handleSubmitEntry = async (title: string | undefined, payload: Record<string, unknown>, personId?: string) => {
    if (!activeFramework) return;
    const entry = await createEntry.mutateAsync({
      frameworkType: activeFramework,
      title,
      payload,
      conversationId: conversationId ?? undefined,
      personId,
    });
    setActiveFramework(null);
    onSaved(entry.id);
  };

  const handleAddPerson = async (person: CreatePersonRequest) => {
    const saved = await createPerson.mutateAsync(person);
    setIsAddingPerson(false);
    onPersonSaved(saved.id);
  };

  if (activeFramework) {
    // Seed Free-form with the latest summary so "log theo format nào" has a concrete answer:
    // the summary itself becomes the starting content, editable before saving.
    const initialPayload =
      activeFramework === 'FREEFORM' && latestSummary ? { content: stripMarkdown(latestSummary) } : undefined;

    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <h2 className="text-sm font-semibold text-coach-text">{t(labelKeyFor(activeFramework))}</h2>
        <FrameworkEntryForm
          frameworkType={activeFramework}
          initialPayload={initialPayload}
          onSubmit={handleSubmitEntry}
          onCancel={() => setActiveFramework(null)}
          submitLabel={t('insightCatcher.save')}
        />
      </div>
    );
  }

  if (isAddingPerson) {
    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <h2 className="text-sm font-semibold text-coach-text">{t('insightCatcher.prm')}</h2>
        <PersonForm onSubmit={handleAddPerson} onCancel={() => setIsAddingPerson(false)} submitLabel={t('insightCatcher.save')} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h2 className="text-sm font-semibold text-coach-text">{t('insightCatcher.title')}</h2>
        <p className="mt-1 text-xs text-coach-text-muted">{t('insightCatcher.subtitle')}</p>
        <div className="mt-2 flex flex-col gap-2">
          {SELF_FRAMEWORK_OPTIONS.map((option) => (
            <FrameworkOptionCard key={option.type} option={option} onClick={() => setActiveFramework(option.type)} />
          ))}
        </div>
      </div>

      <div className="border-t border-coach-border pt-3">
        <h2 className="text-sm font-semibold text-coach-text">{t('insightCatcher.relationshipTitle')}</h2>
        <p className="mt-1 text-xs text-coach-text-muted">{t('insightCatcher.relationshipSubtitle')}</p>
        <div className="mt-2 flex flex-col gap-2">
          <FrameworkOptionCard
            option={{
              type: 'LIFE_POSITIONS',
              labelKey: 'insightCatcher.lifePositions',
              descKey: 'insightCatcher.lifePositionsDesc',
              icon: LuUsers,
            }}
            onClick={() => setActiveFramework('LIFE_POSITIONS')}
          />
          <button
            type="button"
            onClick={() => setIsAddingPerson(true)}
            className="flex flex-col items-start gap-0.5 rounded-lg border border-coach-border bg-coach-bg px-3 py-2.5 text-left transition-colors hover:border-coach-primary hover:bg-coach-surface"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-coach-text">
              <LuUserPlus size={14} className="text-coach-primary" />
              {t('insightCatcher.prm')}
            </span>
            <span className="text-xs text-coach-text-muted">{t('insightCatcher.prmDesc')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const FrameworkOptionCard = ({ option, onClick }: { option: FrameworkOption; onClick: () => void }) => {
  const { t } = useTranslation();
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-0.5 rounded-lg border border-coach-border bg-coach-bg px-3 py-2.5 text-left transition-colors hover:border-coach-primary hover:bg-coach-surface"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-coach-text">
        <Icon size={14} className="text-coach-primary" />
        {t(option.labelKey)}
      </span>
      <span className="text-xs text-coach-text-muted">{t(option.descKey)}</span>
    </button>
  );
};

const labelKeyFor = (type: FrameworkType): string => {
  switch (type) {
    case 'FREEFORM':
      return 'insightCatcher.freeformLabel';
    case 'JOHARI_WINDOW':
      return 'insightCatcher.johariWindowLabel';
    case 'ACT_MATRIX':
      return 'insightCatcher.actMatrix';
    case 'PERSONAL_SWOT':
      return 'insightCatcher.personalSwot';
    case 'LIFE_POSITIONS':
      return 'insightCatcher.lifePositions';
    default:
      return 'insightCatcher.title';
  }
};

export default InsightCatcherPanel;
