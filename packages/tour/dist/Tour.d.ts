import React from 'react';
import { TourProps } from './types';
declare const Tour: React.FC<TourProps>;
export default Tour;
export interface CustomCSS extends React.CSSProperties {
    rx: number;
}
