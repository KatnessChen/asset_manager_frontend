export enum HUES {
  RED = 0,
  ORANGE = 30,
  YELLOW = 60,
  GREEN = 120,
  BLUE = 210,
  PURPLE = 270,
}

export const generateGradientColor = (
  index: number,
  length: number,
  hue: HUES
) => {
  return `hsl(${hue}, 100%, ${30 + (index / length) * 50}%)`;
};
