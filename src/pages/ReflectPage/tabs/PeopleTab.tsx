import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePeopleQuery, useCreatePersonMutation, useUpdatePersonMutation } from '../../../queries/peopleQueryHook';
import { usePersonInsightsQuery } from '../../../queries/insightsQueryHook';
import RelationshipMap from '../../../components/RelationshipMap/RelationshipMap';
import PersonForm from '../../../components/PersonForm/PersonForm';
import { ButtonLink } from '../../../components/Button/Button';
import { APP_ROUTES } from '../../../constants/route';
import Loading from '../../../components/Loading/Loading';

const PeopleTab = () => {
    const { t } = useTranslation();
    const { data: people, isLoading } = usePeopleQuery();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const createPerson = useCreatePersonMutation();
    const updatePerson = useUpdatePersonMutation();

    const selected = (people ?? []).find((p) => p.id === selectedId) ?? null;
    const { data: personInsights } = usePersonInsightsQuery(selected?.id ?? null);

    const selectPerson = (id: string) => {
        setIsEditing(false);
        setIsAdding(false);
        setSelectedId(id === selectedId ? null : id);
    };

    if (isLoading) return <Loading message={t('dashboard.loading') as string} fullHeight />;

    return (
        <div className="reflect-people">
            <div className="reflect-people__map">
                <div className="reflect-people__map-head">
                    <span className="reflect-people__count">{t('reflect.people.count', { count: people?.length ?? 0 })}</span>
                    <button type="button" className="btn btn-ghost" onClick={() => { setIsAdding((v) => !v); setIsEditing(false); }}>
                        {t('dashboard.person.add')}
                    </button>
                </div>
                {isAdding && (
                    <div className="reflect-people__form">
                        <PersonForm
                            submitLabel={t('dashboard.person.add')}
                            onCancel={() => setIsAdding(false)}
                            onSubmit={async (person) => {
                                await createPerson.mutateAsync(person);
                                setIsAdding(false);
                            }}
                        />
                    </div>
                )}
                <RelationshipMap people={people ?? []} emptyLabel={t('dashboard.mapEmpty')} selectedId={selectedId} onSelect={selectPerson} />
            </div>

            <div className="reflect-people__detail">
                {!selected ? (
                    <p className="reflect-people__hint">{t('reflect.people.selectHint')}</p>
                ) : isEditing ? (
                    <PersonForm
                        initialValue={{ name: selected.name, relationshipType: selected.relationshipType, notes: selected.notes ?? undefined }}
                        submitLabel={t('dashboard.person.save')}
                        onCancel={() => setIsEditing(false)}
                        onSubmit={async (person) => {
                            await updatePerson.mutateAsync({ id: selected.id, person });
                            setIsEditing(false);
                        }}
                    />
                ) : (
                    <>
                        <div className="reflect-people__card">
                            <div className="reflect-people__card-head">
                                <div>
                                    <div className="reflect-people__name">{selected.name}</div>
                                    <div className="reflect-people__meta">
                                        {t(`onboarding.relationshipType.${selected.relationshipType}`)}
                                        {typeof selected.daysSinceLastMention === 'number' &&
                                            ` · ${t('today.daysSince', { count: selected.daysSinceLastMention })}`}
                                    </div>
                                </div>
                                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(true)}>{t('dashboard.person.edit')}</button>
                            </div>
                            <div className="reflect-people__card-body">
                                <div className="reflect-people__signal-label">{t('reflect.people.healthSignal')}</div>
                                <div className="reflect-people__signal-track">
                                    <div className="reflect-people__signal-fill" style={{ width: `${Math.round(selected.healthSignal * 100)}%` }} />
                                </div>
                                <p className="reflect-people__note">{selected.nudgeText || t('dashboard.noNudge')}</p>
                                <ButtonLink
                                    to={APP_ROUTES.COACH_CHAT}
                                    state={{ prefill: t('reflect.people.talkAboutPrefill', { name: selected.name }) }}
                                    variant="primary"
                                    className="btn-block"
                                >
                                    {t('reflect.people.talkAbout', { name: selected.name })}
                                </ButtonLink>
                            </div>
                        </div>

                        {personInsights && personInsights.content.length > 0 && (
                            <div className="reflect-people__insights">
                                <div className="reflect-people__section-label">{t('reflect.people.whatAuraNoticed')}</div>
                                <div className="reflect-people__insights-list">
                                    {personInsights.content.map((insight) => (
                                        <div key={insight.id} className="reflect-people__insight">
                                            <span className={`tag ${insight.category === 'RELATIONSHIP' ? 'tag-accent' : 'tag-neutral'}`}>
                                                {t(`dashboard.category.${insight.category === 'BEHAVIOR_PATTERN' ? 'behaviorPattern' : insight.category.toLowerCase()}`)}
                                            </span>
                                            <p>{insight.insightText}</p>
                                            <div className="reflect-people__insight-date">
                                                {new Date(insight.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PeopleTab;
