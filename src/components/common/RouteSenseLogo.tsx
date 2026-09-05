import React from 'react';
import { CarelinkLogo } from './CarelinkLogo';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  showText?: boolean;
}

export const RouteSenseLogo: React.FC<LogoProps> = (props) => {
  return <CarelinkLogo {...props} />;
};

export { CarelinkLogo };
