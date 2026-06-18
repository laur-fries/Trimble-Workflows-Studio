import { useId, useMemo } from 'react';
import fingerprintSvg from './assets/studio-assistant-fingerprint-right.svg?raw';

interface StudioAssistantHeroFingerprintProps {
  side: 'left' | 'right';
}

function buildFingerprintSvg(side: 'left' | 'right', gradientId: string): string {
  const innerMatch = fingerprintSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);

  if (!innerMatch) {
    return fingerprintSvg;
  }

  let inner = innerMatch[1]
    .replace(/paint0_radial_248_17934/g, gradientId)
    .replace('opacity="0.2"', 'opacity="0.12"');

  const preserveAspectRatio = side === 'left' ? 'xMinYMid slice' : 'xMaxYMid slice';

  if (side === 'left') {
    inner = `<g transform="translate(1314 0) scale(-1 1)">${inner}</g>`;
  }

  return `<svg class="studio-assistant-hero-fingerprint-svg" viewBox="0 0 1314 184" preserveAspectRatio="${preserveAspectRatio}" xmlns="http://www.w3.org/2000/svg" fill="none">${inner}</svg>`;
}

export default function StudioAssistantHeroFingerprint({ side }: StudioAssistantHeroFingerprintProps) {
  const gradientId = useId().replace(/:/g, '');

  const svgMarkup = useMemo(() => buildFingerprintSvg(side, gradientId), [gradientId, side]);

  return (
    <div
      className={`studio-assistant-hero-fingerprint studio-assistant-hero-fingerprint--${side}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
