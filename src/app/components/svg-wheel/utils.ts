import {
  OUTER_CIRCLE_OFFSET,
  SLICE_OFFSET,
  SLICES,
  WHEEL_CONFIGS,
} from './constants';

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
  radiusInner: number,
  startAngle: number,
  endAngle: number,
  isActive = false
) => {
  const cx = WHEEL_CONFIGS.width / 2;
  const cy = WHEEL_CONFIGS.height / 2;
  const midAngle = (startAngle + endAngle) / 2;

  // Offset each slice's center outward along its midAngle to create gaps between slices
  // We calculate based on the center point
  // When active, increase the offset to push the slice outward to touch outer circle
  const centerOffset = isActive
    ? OUTER_CIRCLE_OFFSET + SLICE_OFFSET
    : SLICE_OFFSET; // Push outward by 20px more when active

  const { x: sliceCx, y: sliceCy } = polarToCartesian(
    cx,
    cy,
    centerOffset,
    midAngle
  );

  const outerStart = polarToCartesian(
    sliceCx,
    sliceCy,
    radiusOuter,
    startAngle
  );
  const outerEnd = polarToCartesian(sliceCx, sliceCy, radiusOuter, endAngle);
  const innerStart = polarToCartesian(sliceCx, sliceCy, radiusInner, endAngle);
  const innerEnd = polarToCartesian(sliceCx, sliceCy, radiusInner, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${radiusOuter} ${radiusOuter} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${radiusInner} ${radiusInner} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
};
