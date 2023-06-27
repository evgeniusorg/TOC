import React, { FC, useMemo } from 'react';
import './style.scss';

type SkeletonProps = {
  width?: number;
  height?: number;
};

export const Skeleton: FC<SkeletonProps> = ({ width= 100, height = 18 }) => {
  const style = useMemo(() => ({ width: width + 'px', height: height + 'px' }), [width, height]);

  return (
    <div className="skeleton" style={style} />
  );
};
