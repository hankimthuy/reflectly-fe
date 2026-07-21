import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplatePicker from '../TemplatePicker';
import { EntryTemplateKey } from '../../../models/entryTemplate';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TemplatePicker', () => {
  it('should render the freeform option plus all 3 default templates', () => {
    render(<TemplatePicker selectedTemplateKey={null} onSelect={vi.fn()} />);

    expect(screen.getByText('entryTemplates.freeform.label')).toBeInTheDocument();
    expect(screen.getByText('entryTemplates.templates.difficult_conversation.label')).toBeInTheDocument();
    expect(screen.getByText('entryTemplates.templates.energy_drain.label')).toBeInTheDocument();
    expect(screen.getByText('entryTemplates.templates.gratitude_win.label')).toBeInTheDocument();
  });

  it('should mark the selected template as selected', () => {
    render(
      <TemplatePicker
        selectedTemplateKey={EntryTemplateKey.ENERGY_DRAIN}
        onSelect={vi.fn()}
      />
    );

    const selectedCard = screen.getByText('entryTemplates.templates.energy_drain.label').closest('button');
    expect(selectedCard).toHaveClass('selected');
  });

  it('should mark freeform as selected when no template key is selected', () => {
    render(<TemplatePicker selectedTemplateKey={null} onSelect={vi.fn()} />);

    const freeformCard = screen.getByText('entryTemplates.freeform.label').closest('button');
    expect(freeformCard).toHaveClass('selected');
  });

  it('should call onSelect with the template key when a template card is clicked', () => {
    const onSelect = vi.fn();
    render(<TemplatePicker selectedTemplateKey={null} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('entryTemplates.templates.gratitude_win.label'));

    expect(onSelect).toHaveBeenCalledWith(EntryTemplateKey.GRATITUDE_WIN);
  });

  it('should call onSelect with null when the freeform card is clicked', () => {
    const onSelect = vi.fn();
    render(
      <TemplatePicker
        selectedTemplateKey={EntryTemplateKey.DIFFICULT_CONVERSATION}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('entryTemplates.freeform.label'));

    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
