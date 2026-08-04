const ThinkingBubble = () => (
  <div className="flex w-full justify-start">
    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-coach-border bg-coach-surface px-4 py-3">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coach-primary-light [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coach-primary-light [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coach-primary-light" />
    </div>
  </div>
);

export default ThinkingBubble;
