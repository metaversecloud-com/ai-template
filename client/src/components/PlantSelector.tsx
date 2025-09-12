import React from "react";

const PLANT_IMAGES = [
  // Replace with actual URLs or local paths
  "https://example.com/plant1.png",
  "https://example.com/plant2.png",
  "https://example.com/plant3.png",
  "https://example.com/plant4.png",
  "https://example.com/plant5.png",
  "https://example.com/plant6.png",
];

interface PlantSelectorProps {
  onSelect: (imageUrl: string) => void;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({ onSelect }) => (
  <div className="grid grid-cols-3 gap-4">
    {PLANT_IMAGES.map((url, idx) => (
      <img
        key={url}
        src={url}
        alt={`Plant ${idx + 1}`}
        className="cursor-pointer rounded shadow hover:scale-105 transition"
        onClick={() => onSelect(url)}
        style={{ width: 120, height: 120 }}
      />
    ))}
  </div>
);

export default PlantSelector;
