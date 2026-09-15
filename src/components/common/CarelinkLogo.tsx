import React from 'react';
import { BrandLogo } from './BrandLogo';

export const CarelinkLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; theme?: 'dark' | 'light'; showText?: boolean }> = ({
  showText = true,
}) =>
  showText ? (
    <BrandLogo />
  ) : (
    <span className="brand-logo-icon">
      <img src="/assets/caremizhi-symbol.png" alt="CareMizhi" />
    </span>
  );
