import ChatPreviewCard from './ChatPreviewCard';
import RelationshipMapPreviewCard from './RelationshipMapPreviewCard';
import InsightTimelinePreviewCard from './InsightTimelinePreviewCard';

/**
 * Public homepage preview section: a static, illustrative snapshot of the AI Coach chat,
 * relationship map, and insight timeline — the three things a signed-in user actually gets.
 * None of these cards fetch real data (the homepage route is unauthenticated); each links into
 * the real, authenticated experience via its own CTA.
 */
const HomePreviewGrid = () => {
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-20 lg:grid-cols-2">
      <ChatPreviewCard />
      <div className="flex flex-col gap-6">
        <RelationshipMapPreviewCard />
        <InsightTimelinePreviewCard />
      </div>
    </section>
  );
};

export default HomePreviewGrid;
