const COLORS = [
  '#F98080',
  '#F9A826',
  '#34D399',
  '#60A5FA',
  '#A78BFA',
  '#F472B6',
  '#38BDF8',
  '#4ADE80',
];

export const getRandomColor = () =>
  COLORS[Math.floor(Math.random() * COLORS.length)];
