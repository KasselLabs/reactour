import React from 'react';
import { ProviderProps, TourProps } from './types';
declare const TourContext: React.Context<TourProps>;
declare const TourProvider: React.FC<ProviderProps>;
export { TourProvider };
export default TourContext;
export declare function useTour(): TourProps;
