import React, { Dispatch } from 'react';
import { KeyboardParts } from './types';
declare const Keyboard: React.FC<KeyboardProps>;
export declare type KeyboardProps = {
    disableKeyboardNavigation?: boolean | KeyboardParts[];
    setCurrentStep: Dispatch<React.SetStateAction<number>>;
    setIsOpen: Dispatch<React.SetStateAction<Boolean>>;
    stepsLength: number;
    disable?: boolean;
    rtl?: boolean;
};
export default Keyboard;
