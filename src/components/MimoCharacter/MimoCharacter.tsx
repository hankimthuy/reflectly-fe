import React from 'react';
import './MimoCharacter.scss';
import auraIdle from '../../assets/aura/aura-idle.gif';

// Single hand-off point for the production Aura mascot art: drop the exported file into
// src/assets/aura/ (see documentation/01-UX-UI-Specs/Design-System.md §4) and update this
// import — no other code needs to change.
// Currently unused on the homepage (moved to a small inline avatar next to the chat preview
// instead — see HomePreviewGrid/ChatPreviewCard.tsx and CoachChatPage.tsx), but kept available
// as the full floating/glow presence for a future full-screen moment (e.g. onboarding).

export type MimoTheme = 'bridge' | 'inner' | 'outer';

interface MimoCharacterProps {
  theme?: MimoTheme;
  className?: string;
}

const MimoCharacter = ({ theme = 'bridge', className = '' }: MimoCharacterProps) => {
  return (
    <div className={`mimo-character ${className}`}>
      <div className={`mimo-character__body mimo-character__body--${theme}`}>
         <img
            src={auraIdle}
            alt="Aura mascot"
            className="mimo-character__image"
         />

         <div className="mimo-character__glow"></div>
      </div>

      <div className="mimo-character__shadow"></div>
    </div>
  );
};

export default MimoCharacter;
