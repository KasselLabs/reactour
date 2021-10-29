import React from 'react';
import { StylesObj } from './styles';
declare const Close: React.FC<CloseProps>;
declare type CloseProps = {
    styles?: StylesObj;
    onClick?: () => void;
    disabled?: boolean;
};
export default Close;
