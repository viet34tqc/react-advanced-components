export const WHEEL_CONFIGS = {
  width: 700,
  height: 700,
  radius: 290, // The viewbox is equal to the width and height, so we need the radius of the slice to be less than the viewBox. Otherwise, the slice will be clipped
  innerRadius: 50,
};

/**
 * We want to start drawing the slice not from the center, we shift this point a little bit, in order to create a gap between the slices. If all the slices starts from the same location, their stroke will still gather at the same point when we add gap. Because each slice has a stroke width as 1, we use '2' here to create 1px offset
 */
export const SLICE_OFFSET = 2;
// The outer circle will offset from the slice 20px
export const OUTER_CIRCLE_OFFSET = 20;

export const SLICES = [
  {
    id: 'wan',
    label: 'WAN',
    values: [0],
    details: 'No WAN configured or not available.',
    classNames: 'stroke-slate-800',
    color: '#475569', // slate-600
  },
  {
    id: 'lan',
    label: 'LAN/WLAN',
    values: [5, 4],
    details: 'LAN/WLAN devices: 5 healthy, 4 warnings.',
    classNames: 'stroke-slate-800',
    color: '#334155', // slate-700
  },
  {
    id: 'clients',
    label: 'CLIENTS',
    values: [1, 11],
    details: '1 healthy critical, 11 unknown clients.',
    classNames: 'stroke-slate-800',
    color: '#1e293b', // slate-800
  },
  {
    id: 'services',
    label: 'SERVICES',
    values: [0],
    details: 'No services active.',
    classNames: 'stroke-slate-800',
    color: '#64748b', // slate-500
  },
  {
    id: 'cpe',
    label: 'CPE',
    values: [2, 0],
    details: 'CPE: 2 healthy, 0 errors.',
    classNames: 'stroke-slate-800',
    color: '#334155', // slate-700
  },
];
