'use client';

import { useState, useCallback } from 'react';
import { SoundEffects, SoundName } from '@/lib/sounds';

export function useSound() {
  const [enabled, setEnabled] = useState(true);

  const play = useCallback(
    (name: SoundName) => {
      if (enabled) SoundEffects[name]();
    },
    [enabled],
  );

  const toggle = useCallback(() => setEnabled(v => !v), []);

  return { soundEnabled: enabled, toggleSound: toggle, play };
}
