import React, { Dispatch } from 'react';
import { StylesObj } from './styles';
import { StepType, BtnFnProps } from './types';
declare const Navigation: React.FC<NavigationProps>;
declare type BaseProps = {
    styles?: StylesObj;
};
declare type NavigationProps = BaseProps & {
    setCurrentStep: Dispatch<React.SetStateAction<number>>;
    steps: StepType[];
    currentStep: number;
    disableDots?: boolean;
    nextButton?: (props: BtnFnProps) => void;
    prevButton?: (props: BtnFnProps) => void;
    setIsOpen: Dispatch<React.SetStateAction<Boolean>>;
    hideButtons?: boolean;
    hideDots?: boolean;
    disableAll?: boolean;
    rtl?: boolean;
};
export default Navigation;
