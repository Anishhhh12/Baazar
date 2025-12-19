// services/visionService.js
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export const analyzeImage = async (imageBuffer) => {
  // Call Google Vision
  const [result] = await client.annotateImage({
    image: { content: imageBuffer },
    features: [
      { type: "LABEL_DETECTION" },
      { type: "IMAGE_PROPERTIES" }
    ]
  });

  // Extract labels
  const labels = result.labelAnnotations || [];
  const colors =
    result.imagePropertiesAnnotation?.dominantColors?.colors || [];

  return { labels, colors };
};


const TYPE_MAP = {
  shirt: ["shirt", "t-shirt", "top", "tee"],
  shoes: ["shoe", "shoes", "sneaker", "footwear"],
  jeans: ["jeans", "denim", "pants", "trousers"],
  jacket: ["jacket", "coat"]
};

const COLOR_MAP = {
  blue: ["blue", "navy", "sky blue"],
  black: ["black", "dark"],
  white: ["white"],
  brown: ["brown", "tan"],
  red: ["red"],
  green: ["green"]
};


const normalizeDetections = (labels, colors) => {
  let detectedTypes = new Set();
  let detectedColors = new Set();

  for (const label of labels) {
    const desc = label.description.toLowerCase();

    for (const [type, keywords] of Object.entries(TYPE_MAP)) {
      if (keywords.some(k => desc.includes(k))) {
        detectedTypes.add(type);
      }
    }

    for (const [color, keywords] of Object.entries(COLOR_MAP)) {
      if (keywords.some(k => desc.includes(k))) {
        detectedColors.add(color);
      }
    }
  }

  // fallback: use dominant color
  if (detectedColors.size === 0 && colors.length > 0) {
    const dominant = colors[0].color;
    if (dominant.blue > dominant.red && dominant.blue > dominant.green) {
      detectedColors.add("blue");
    } else if (dominant.red > dominant.green) {
      detectedColors.add("red");
    } else {
      detectedColors.add("green");
    }
  }

  return Array.from(detectedTypes).map(type => ({
    type,
    color: Array.from(detectedColors)[0] || "random"
  }));
};

export const detectProductsFromImage = async (imageBuffer) => {
  const { labels, colors } = await analyzeImage(imageBuffer);
  return normalizeDetections(labels, colors);
};
