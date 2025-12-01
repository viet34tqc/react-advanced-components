import { SLICES, WHEEL_CONFIGS } from './constants';

export const deg2rad = (degree: number) => (degree * Math.PI) / 180;

// We are going to map radius of each slice to cartesian (x, y graph that svg uses)
const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
) => {
  const a = deg2rad(angleDeg - 90);
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
};

export const getSlicesWithAngle = () => {
  const total = SLICES.length;
  const angle = 360 / total;
  const offset = -angle / 2; // Center first slice at 12 o'clock

  return SLICES.map((s, i) => {
    const startAngle = offset + i * angle;
    const endAngle = startAngle + angle;
    return {
      ...s,
      startAngle,
      endAngle,
      midAngle: startAngle + angle / 2,
      index: i,
    };
  });
};

export const calculateSlicePath = (
  radiusOuter: number,
  radiusInnter: number,
  startAngle: number,
  endAngle: number
) => {
  const cx = WHEEL_CONFIGS.width / 2;
  const cy = WHEEL_CONFIGS.height / 2;
  const outerStart = polarToCartesian(cx, cy, radiusOuter, startAngle);
  const outerEnd = polarToCartesian(cx, cy, radiusOuter, endAngle);
  const innerStart = polarToCartesian(cx, cy, radiusInnter, endAngle);
  const innerEnd = polarToCartesian(cx, cy, radiusInnter, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${radiusOuter} ${radiusOuter} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${radiusInnter} ${radiusInnter} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
};
