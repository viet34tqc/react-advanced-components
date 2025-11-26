'use client';

import { Circle, Square, Triangle } from 'lucide-react';
import Slider from './Slider';

const SliderPage = () => {
  return (
    <div className="w-96">
      <Slider
        stops={[
          <Square key="s1" className="fill-[#AB87FF]" />,
          <Circle key="c1" className="fill-[#446DF6]" />,
          <Triangle key="t1" className="fill-[#FBB02D]" />,
          <Square key="s2" className="fill-[#ACECA1]" />,
          <Circle key="c2" className="fill-[#FFFF4C]" />,
          <Square key="s3" className="fill-[#FE65B7]" />,
        ]}
      />
    </div>
  );
};

export default SliderPage;
