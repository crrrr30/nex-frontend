import { useState, useRef, useEffect } from "react";

interface GradientCardProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
}

const GradientCard: React.FC<GradientCardProps> = ({
  children,
  width = "400px",
  height = "300px",
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-lg shadow-lg"
      style={{ width, height }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
        style={{
          filter: "blur(100px)",
          transform: "scale(1.2)",
        }}
      />
      <div
        className="absolute bg-white/30 rounded-full"
        style={{
          width: "150px",
          height: "150px",
          left: `${mousePosition.x - 75}px`,
          top: `${mousePosition.y - 75}px`,
          filter: "blur(50px)",
          transition: "all 0.1s ease",
        }}
      />
      <div className="relative z-10 h-full p-6">{children}</div>
    </div>
  );
};

export default GradientCard;
