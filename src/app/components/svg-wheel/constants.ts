export const WHEEL_CONFIGS = {
  width: 600,
  height: 600,
  radius: 290, // The viewbox is equal to the width and height, so we need the radius of the slice to be less than the viewBox. Otherwise, the slice will be clipped
  innerRadius: 50,
};

export const SLICES = [
  {
    id: 'wan',
    label: 'WAN',
    values: [0],
    details: 'No WAN configured or not available.',
    classNames: 'fill-slate-600 stroke-slate-800',
  },
  {
    id: 'lan',
    label: 'LAN/WLAN',
    values: [5, 4],
    details: 'LAN/WLAN devices: 5 healthy, 4 warnings.',
    classNames: 'fill-slate-700 stroke-slate-800',
  },
  {
    id: 'clients',
    label: 'CLIENTS',
    values: [1, 11],
    details: '1 healthy critical, 11 unknown clients.',
    classNames: 'fill-slate-800 stroke-slate-800',
  },
  {
    id: 'services',
    label: 'SERVICES',
    values: [0],
    details: 'No services active.',
    classNames: 'fill-slate-900 stroke-slate-800',
  },
  {
    id: 'cpe',
    label: 'CPE',
    values: [2, 0],
    details: 'CPE: 2 healthy, 0 errors.',
    classNames: 'fill-slate-700 stroke-slate-800',
  },
];
