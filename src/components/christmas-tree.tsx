import { Ornament } from './ornament';

interface OrnamentData {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface ChristmasTreeProps {
  ornaments: OrnamentData[];
  onUpdateOrnament: (id: number, text: string) => void;
}

export function ChristmasTree({ ornaments, onUpdateOrnament }: ChristmasTreeProps) {
  // Safety check to ensure ornaments is defined
  if (!ornaments) {
    return null;
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[3/4]">
      {/* Tree body - 3 layered triangles and trunk */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Main tree triangles */}
        <defs>
          <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#14532d', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#15803d', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#166534', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#78350f', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#451a03', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="treeShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Trunk - aligned to bottom of tree */}
        <rect
          x="46"
          y="88"
          width="8"
          height="12"
          fill="url(#trunkGradient)"
          rx="0.5"
        />
        
        {/* Bottom layer - widest, connects to trunk */}
        <path
          d="M 50 45 L 10 88 L 90 88 Z"
          fill="url(#treeGradient)"
          filter="url(#treeShadow)"
        />
        
        {/* Middle layer */}
        <path
          d="M 50 25 L 18 60 L 82 60 Z"
          fill="url(#treeGradient)"
          filter="url(#treeShadow)"
        />
        
        {/* Top layer - smallest */}
        <path
          d="M 50 8 L 28 38 L 72 38 Z"
          fill="url(#treeGradient)"
          filter="url(#treeShadow)"
        />
        
        {/* Star on top */}
        <g transform="translate(50, 6)">
          <path
            d="M 0 -4 L 1 -1 L 4 -1 L 1.5 1 L 2.5 4 L 0 2 L -2.5 4 L -1.5 1 L -4 -1 L -1 -1 Z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="0.3"
          />
          <circle cx="0" cy="0" r="0.8" fill="#fef3c7" opacity="0.8" />
        </g>
      </svg>
      
      {/* Ornaments */}
      <div className="absolute inset-0">
        {ornaments.map((ornament) => (
          <Ornament
            key={ornament.id}
            ornament={ornament}
            onUpdate={onUpdateOrnament}
          />
        ))}
      </div>
    </div>
  );
}