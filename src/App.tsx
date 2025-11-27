import { useState, useEffect } from "react";
import { ChristmasTree } from "./components/christmas-tree";
import { SnowEffect } from "./components/snow-effect";
import { fetchOrnaments, updateOrnamentText, initializeOrnaments, type Ornament } from "./api";

export default function App() {
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Deterministic seeded random number generator
  function seededRandom(seed: number) {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  function generateOrnaments() {
    const ornamentColors = [
      "#ef4444", // red
      "#f59e0b", // amber
      "#eab308", // yellow
      "#3b82f6", // blue
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#06b6d4", // cyan
      "#10b981", // emerald
    ];

    const ornaments = [];
    // Use a fixed seed for consistent layout
    const random = seededRandom(12345);

    // Helper function to check if a point is inside the tree triangles
    const isInsideTree = (x: number, y: number) => {
      // Top triangle: (50,8) at top, (28,38) and (72,38) at bottom
      if (y >= 19 && y <= 40) {
        const triangleHeight = 31; // 38 - 8
        const currentHeight = y - 14;
        const widthAtCurrentHeight =
          (currentHeight / triangleHeight) * 53; // base width at bottom is 44 (72-28)
        const leftBound = 51 - widthAtCurrentHeight / 2;
        const rightBound = 47 + widthAtCurrentHeight / 2;
        return x >= leftBound && x <= rightBound;
      }

      // Middle triangle: (50,25) at top, (18,60) and (82,60) at bottom
      if (y >= 23 && y <= 57) {
        const triangleHeight = 35; // 60 - 25
        const currentHeight = y - 27;
        const widthAtCurrentHeight =
          (currentHeight / triangleHeight) * 75; // base width at bottom is 64 (82-18)
        const leftBound = 52 - widthAtCurrentHeight / 2;
        const rightBound = 48 + widthAtCurrentHeight / 2;
        return x >= leftBound && x <= rightBound;
      }

      // Bottom triangle: (50,45) at top, (10,88) and (90,88) at bottom
      if (y >= 29 && y <= 88) {
        const triangleHeight = 43; // 88 - 45
        const currentHeight = y - 45;
        const widthAtCurrentHeight =
          (currentHeight / triangleHeight) * 103; // base width at bottom is 80 (90-10)
        const leftBound = 50 - widthAtCurrentHeight / 2;
        const rightBound = 50 + widthAtCurrentHeight / 2;
        return x >= leftBound && x <= rightBound;
      }

      return false;
    };

    const hasCollision = (x: number, y: number) => {
      return ornaments.some((ornament) => {
        const dx = x - ornament.x;
        const dy = y - ornament.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 2.3;
      });
    };

    // Generate ornaments with deterministic positions
    // Use a grid-based approach for better distribution
    const targetCount = 250;
    let attempts = 0;
    let id = 0;
    
    // Try grid-based positions first for better distribution
    for (let layer = 0; layer < 15 && ornaments.length < targetCount; layer++) {
      const yBase = 20 + layer * 4;
      const maxWidth = 30 + layer * 2;
      const xSpacing = Math.max(2.5, maxWidth / 8);
      
      for (let xOffset = -maxWidth / 2; xOffset <= maxWidth / 2 && ornaments.length < targetCount; xOffset += xSpacing) {
        const x = 50 + xOffset + (random() - 0.5) * 1.5; // Add slight variation
        const y = yBase + (random() - 0.5) * 2;
        
        if (isInsideTree(x, y) && !hasCollision(x, y)) {
          const color = ornamentColors[id % ornamentColors.length];
          ornaments.push({
            id: id++,
            text: "",
            x,
            y,
            color,
          });
        }
      }
    }
    
    // Fill remaining spots with random positions if needed
    while (ornaments.length < targetCount && attempts < 1000) {
      const x = 2 + random() * 90;
      const y = 16 + random() * 61;

      if (isInsideTree(x, y) && !hasCollision(x, y)) {
        const color = ornamentColors[id % ornamentColors.length];
        ornaments.push({
          id: id++,
          text: "",
          x,
          y,
          color,
        });
      }
      attempts++;
    }

    return ornaments;
  }

  // Load ornaments on mount
  useEffect(() => {
    async function loadOrnaments() {
      try {
        const data = await fetchOrnaments();
        
        if (data.ornaments && data.ornaments.length > 0) {
          // Use saved ornaments from backend - these have consistent positions
          setOrnaments(data.ornaments);
          setIsInitialized(true);
          setIsLoading(false);
        } else {
          // Backend is empty - generate deterministic layout and save it
          const generated = generateOrnaments();
          setOrnaments(generated);
          setIsLoading(false);
          // Save to backend - this ensures positions are saved
          try {
            await initializeOrnaments(generated);
            setIsInitialized(true);
          } catch (initError) {
            console.error('Failed to initialize ornaments on backend:', initError);
            // Still mark as initialized so UI works
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error('Error loading ornaments:', error);
        // Fallback to generated ornaments if API fails
        // These will have consistent positions due to seeded random
        const generated = generateOrnaments();
        setOrnaments(generated);
        setIsLoading(false);
        setIsInitialized(true);
      }
    }
    
    loadOrnaments();
  }, []);

  const updateOrnamentTextHandler = async (id: number, text: string) => {
    // Optimistically update UI
    setOrnaments((prev) =>
      prev.map((ornament) =>
        ornament.id === id ? { ...ornament, text } : ornament,
      ),
    );
    
    // Save to backend
    try {
      await updateOrnamentText(id, text);
    } catch (error) {
      console.error('Failed to save ornament text:', error);
      // Optionally revert on error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] relative overflow-hidden">
      <SnowEffect />

      <div className="relative z-1- container mx-auto px-4 py-20">
        <div className="relative mx-auto max-w-3xl mb-0">
          <div className="bg-gradient-to-r from-[#dc2626] via-[#16a34a] to-[#dc2626] p-1 rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-xl py-4 px-6 border-2 border-[#fbbf24]">
              <h1 className="text-center text-[#fef3c7] mb-2 tracking-wide drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse" style={{ 
                textShadow: '2px 2px 4px rgba(220, 38, 38, 0.3), -2px -2px 4px rgba(34, 197, 94, 0.3)',
                fontFamily: 'HEINEKEN core, bold',
                fontStyle: 'bold',
                fontSize: '23px'
              }}>
                🎄 Transformation Compliment Tree 🎄
              </h1>
              <p className="text-center text-[#fde68a] mb-0 max-w-2xl mx-auto drop-shadow-lg" style={{
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                fontFamily: 'HEINEKEN core'
              }}>
                Click an ornament to compliment someone. Optionally, write your name.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-[#fef3c7] py-20">
            <p>Loading your Christmas tree...</p>
          </div>
        ) : (
          <ChristmasTree
            ornaments={ornaments}
            onUpdateOrnament={updateOrnamentTextHandler}
          />
        )}
      </div>
    </div>
  );
}