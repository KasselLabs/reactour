import { StepType } from './types';
export declare function useSizes(step: StepType, scrollOptions?: ScrollIntoViewOptions & {
    inViewThreshold?: number;
}): {
    sizes: {
        bottom: number;
        height: number;
        left: number;
        right: number;
        top: number;
        width: number;
        windowWidth: number;
        windowHeight: number;
    };
    transition: boolean;
    target: Element | null;
    observableRefresher: () => void;
};
