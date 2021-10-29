/// <reference types="react" />
export declare type StylesKeys = 'badge' | 'controls' | 'navigation' | 'button' | 'arrow' | 'dot' | 'close';
export declare type StylesObj = {
    [key in StylesKeys]?: StyleFn;
};
export declare type StyleFn = (props: {
    [key: string]: any;
}, state?: {
    [key: string]: any;
}) => React.CSSProperties;
export declare type Styles = {
    badge: StyleFn;
    controls: StyleFn;
    navigation: StyleFn;
    button: StyleFn;
    arrow: StyleFn;
    dot: StyleFn;
    close: StyleFn;
};
export declare type StyleKey = keyof Styles;
export declare const defaultStyles: Styles;
export declare type getStylesType = (key: StylesKeys, extra?: any) => {};
export declare function stylesMatcher(styles: StylesObj): (key: StyleKey, state: {}) => {};
