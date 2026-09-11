import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PersonForm from '../PersonForm/PersonForm';
import { useCreateSavedFrameworkEntryMutation } from '../../queries/savedFrameworkEntriesQueryHook';
import { useCreatePersonMutation } from '../../queries/peopleQueryHook';
import { MIRROR_PANES, type MirrorPane } from '../../hooks/useMirrorSnapshot';
import type { CreatePersonRequest } from '../../models/person';
import './InsightCatcherPanel.scss';

type CatchTab = 'mirror' | 'note' | 'person';

interface InsightCatcherPanelProps {
  conversationId: string | null;
  /** A message's text, handed in from a bubble's "Catch this" or the composer's ⌘K shortcut
   * (empty string) — seeds the draft each time it changes. */
  draftText: string | null;
  onSaved: (entryId: string) => void;
  onPersonSaved: (personId: string) => void;
  /** Present only when the panel renders as a mobile overlay sheet (see mockup 2b) — gives it a
   * "Cancel" to dismiss with. Omitted on desktop, where the panel is a permanent rail. */
  onClose?: () => void;
}

/**
 * "Catch" — one keystroke from any message, three destinations (see the redesign brief, section
 * 04). Replaces the old framework picker (Free-form / Johari / ACT Matrix / SWOT / Life
 * Positions) with exactly what the redesign calls for: drop a line into one pane of the Mirror,
 * jot it as a plain Note, or use it to add/update someone on the People map. ACT Matrix,
 * Personal SWOT and Life Positions aren't a door this panel opens anymore — any entry made that
 * way before this redesign still shows up (read-only) in the Journal tab's "Notes" section.
 */
const InsightCatcherPanel = ({ conversationId, draftText, onSaved, onPersonSaved, onClose }: InsightCatcherPanelProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<CatchTab>('mirror');
  const [text, setText] = useState('');
  const [pane, setPane] = useState<MirrorPane>('hidden');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Re-seed the draft whenever the parent hands in a new one (a different bubble's "Catch this",
  // or the composer's ⌘K shortcut) — adjusted during render, per React's own guidance for this
  // exact case, rather than in an effect (https://react.dev/learn/you-might-not-need-an-effect).
  const [seenDraftText, setSeenDraftText] = useState(draftText);
  if (draftText !== seenDraftText) {
    setSeenDraftText(draftText);
    if (draftText !== null) {
      setText(draftText);
      setTab('mirror');
      setError(null);
    }
  }

  const createEntry = useCreateSavedFrameworkEntryMutation();
  const createPerson = useCreatePersonMutation();

  const handleSaveMirror = async () => {
    if (!text.trim()) {
      setError(t('insightCatcher.johari.atLeastOneRequired'));
      return;
    }
    setError(null);
    const payload = Object.fromEntries(MIRROR_PANES.map((p) => [p, p === pane ? text.trim() : '']));
    const entry = await createEntry.mutateAsync({
      frameworkType: 'JOHARI_WINDOW',
      payload,
      conversationId: conversationId ?? undefined,
    });
    setText('');
    onSaved(entry.id);
    onClose?.();
  };

  const handleSaveNote = async () => {
    if (!text.trim()) {
      setError(t('insightCatcher.freeform.contentRequired'));
      return;
    }
    setError(null);
    const tags = tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean);
    const entry = await createEntry.mutateAsync({
      frameworkType: 'FREEFORM',
      payload: { content: text.trim(), ...(tags.length > 0 ? { tags } : {}) },
      conversationId: conversationId ?? undefined,
    });
    setText('');
    setTagsInput('');
    onSaved(entry.id);
    onClose?.();
  };

  const handleAddPerson = async (person: CreatePersonRequest) => {
    const saved = await createPerson.mutateAsync(person);
    onPersonSaved(saved.id);
    onClose?.();
  };

  const saving = createEntry.isPending;

  return (
    <div className="catch-panel">
      <div className="catch-panel__head">
        <div className="catch-panel__head-row">
          <div className="catch-panel__title">{t('talk.catchTitle')}</div>
          {onClose && (
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {t('insightCatcher.cancel')}
            </button>
          )}
        </div>
        <p className="catch-panel__subtitle">{t('talk.catchSubtitle')}</p>
      </div>

      <div className="catch-panel__tabs">
        <button type="button" className={`catch-panel__tab ${tab === 'mirror' ? 'catch-panel__tab--active' : ''}`} onClick={() => setTab('mirror')}>
          {t('mirror.title')}
        </button>
        <button type="button" className={`catch-panel__tab ${tab === 'note' ? 'catch-panel__tab--active' : ''}`} onClick={() => setTab('note')}>
          {t('talk.note')}
        </button>
        <button type="button" className={`catch-panel__tab ${tab === 'person' ? 'catch-panel__tab--active' : ''}`} onClick={() => setTab('person')}>
          {t('talk.person')}
        </button>
      </div>

      <div className="catch-panel__body">
        {tab === 'person' ? (
          <PersonForm onSubmit={handleAddPerson} onCancel={() => setTab('mirror')} submitLabel={t('insightCatcher.save')} />
        ) : (
          <>
            {/* What's actually being caught, shown back before it's filed — the panel used to
                give no indication of which line a "Catch this" had picked up. Only rendered for
                a seeded draft; typing straight into the textarea needs no echo of itself. */}
            {seenDraftText && (
              <blockquote className="catch-panel__quote">{seenDraftText}</blockquote>
            )}
            <p className="catch-panel__hint">{tab === 'mirror' ? t('talk.dropTheLine') : t('talk.noteHint')}</p>
            <textarea className="input catch-panel__textarea" value={text} onChange={(e) => setText(e.target.value)} rows={3} />

            {tab === 'mirror' && (
              <>
                <div className="catch-panel__pane-label">{t('mirror.whichPane')}</div>
                <div className="catch-panel__pane-grid">
                  {MIRROR_PANES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPane(p)}
                      className={`btn btn-secondary catch-panel__pane-btn ${pane === p ? 'catch-panel__pane-btn--active' : ''}`}
                    >
                      {t(`mirror.${p}.label`)}
                      {pane === p ? ' ✓' : ''}
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'note' && (
              <input
                type="text"
                className="input catch-panel__tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={t('insightCatcher.freeform.tagsPlaceholder') as string}
              />
            )}

            {error && <p className="catch-panel__error">{error}</p>}

            <button
              type="button"
              className="btn btn-primary btn-block catch-panel__save"
              onClick={tab === 'mirror' ? handleSaveMirror : handleSaveNote}
              disabled={saving}
            >
              {saving ? t('insightCatcher.saving') : tab === 'mirror' ? t('talk.saveToMirror') : t('insightCatcher.save')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightCatcherPanel;
