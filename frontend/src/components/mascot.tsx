import { useId } from "react";

// Thynk's cloud mascot, drawn in SVG so it can bounce, squash and blink.
// The bumps form one clipPath, so gradients and shine fill the cloud as a single seamless shape.
// Each instance gets its own ids: url(#id) resolves to the first match in the document, so shared
// ids would break every mascot whenever the first one is hidden (e.g. the navbar one on mobile).
export function Mascot({ className = "" }: { className?: string }) {
  const uid = `mascot${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const id = {
    body: `${uid}-body`,
    shine: `${uid}-shine`,
    iris: `${uid}-iris`,
    cloud: `${uid}-cloud`,
    mouth: `${uid}-mouth`,
  };

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={id.body} x1="160" y1="30" x2="50" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b6f75e" />
          <stop offset="0.35" stopColor="#3fdc5f" />
          <stop offset="0.75" stopColor="#1fb36a" />
          <stop offset="1" stopColor="#0f8a74" />
        </linearGradient>
        <radialGradient id={id.shine} cx="135" cy="55" r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id.iris} cx="0" cy="0" r="1" gradientUnits="objectBoundingBox" gradientTransform="translate(0.5 0.55) scale(0.55)">
          <stop offset="0.45" stopColor="#06281a" />
          <stop offset="1" stopColor="#3a9a1c" />
        </radialGradient>
        <clipPath id={id.cloud}>
          <circle cx="100" cy="112" r="62" />
          <circle cx="104" cy="60" r="40" />
          <circle cx="62" cy="76" r="34" />
          <circle cx="146" cy="80" r="34" />
          <circle cx="40" cy="112" r="32" />
          <circle cx="162" cy="122" r="31" />
          <circle cx="58" cy="152" r="33" />
          <circle cx="100" cy="164" r="34" />
          <circle cx="140" cy="156" r="33" />
        </clipPath>
        <clipPath id={id.mouth}>
          <path d="M84 128 Q102 132 120 126 Q117 152 102 152 Q87 152 84 128 Z" />
        </clipPath>
      </defs>

      <g className="mascot-hop">
        <g className="mascot-squash">
          <g className="mascot-sway">
            {/* Body */}
            <rect width="200" height="200" fill={`url(#${id.body})`} clipPath={`url(#${id.cloud})`} />
            <rect width="200" height="200" fill={`url(#${id.shine})`} clipPath={`url(#${id.cloud})`} />

            {/* Eyebrows */}
            <g className="mascot-brows" fill="none" stroke="#0d4a2c" strokeWidth="7" strokeLinecap="round">
              <path d="M66 86 Q78 77 90 82" />
              <path d="M114 80 Q127 74 138 82" />
            </g>

            {/* Eyes */}
            <g className="mascot-eye">
              <ellipse cx="80" cy="110" rx="15" ry="17" fill="#f4fff0" />
              <circle cx="82" cy="109" r="12" fill={`url(#${id.iris})`} />
              <circle cx="85" cy="104" r="4.5" fill="#ffffff" />
              <circle cx="79" cy="113" r="2" fill="#ffffff" />
            </g>
            <g className="mascot-eye">
              <ellipse cx="124" cy="108" rx="15" ry="17" fill="#f4fff0" />
              <circle cx="126" cy="107" r="12" fill={`url(#${id.iris})`} />
              <circle cx="129" cy="102" r="4.5" fill="#ffffff" />
              <circle cx="123" cy="111" r="2" fill="#ffffff" />
            </g>

            {/* Blush */}
            <g stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round">
              <path d="M58 136 L61 129" />
              <path d="M65 137 L68 130" />
              <path d="M138 133 L141 126" />
              <path d="M145 134 L148 127" />
            </g>

            {/* Mouth */}
            <g className="mascot-mouth">
              <path d="M84 128 Q102 132 120 126 Q117 152 102 152 Q87 152 84 128 Z" fill="#073020" />
              <ellipse cx="102" cy="153" rx="13" ry="10" fill="#7ee83a" clipPath={`url(#${id.mouth})`} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
