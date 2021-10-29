import React from 'react';
export default function withTour<P>(WrappedComponent: React.ComponentType<P>): (props: P) => JSX.Element;
