import React, { Dispatch } from 'react';
declare const Content: React.FC<ContentProps>;
declare type ContentProps = {
    content: any;
    setCurrentStep: Dispatch<React.SetStateAction<number>>;
    setIsOpen?: Dispatch<React.SetStateAction<Boolean>>;
    currentStep: number;
    transition?: boolean;
};
export default Content;
