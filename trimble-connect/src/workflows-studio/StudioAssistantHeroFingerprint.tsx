import { useId, useMemo } from 'react';
import fingerprintSvg from './assets/studio-assistant-fingerprint-right.svg?raw';

interface StudioAssistantHeroFingerprintProps {
  side: 'left' | 'right';
}

export default function StudioAssistantHeroFingerprint({ side }: StudioAssistantHeroFingerprintProps) {
  const gradientId = useId().replace(/:/g, '');

  const svgMarkup = useMemo(
    () =>
      fingerprintSvg
        .replace(/paint0_radial_248_17934/g, gradientId)
        .replace('opacity="0.2"', 'opacity="0.12"')
        .replace(
          /<svg[^>]*>/,
          '<svg class="studio-assistant-hero-fingerprint-svg" viewBox="0 0 1314 184" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg" fill="none">',
        ),
    [gradientId],
  );

  return (
    <div
      className={`studio-assistant-hero-fingerprint studio-assistant-hero-fingerprint--${side}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
