import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { inView, smoothScroll, getWindow, getRect, Portal, Observables } from '@reactour/utils';
import { Mask } from '@reactour/mask';
import { Popover } from '@reactour/popover';
import { FocusScope } from '@react-aria/focus';
import { jsx } from '@emotion/react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var initialState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  windowWidth: 0,
  windowHeight: 0
};
function useSizes(step, scrollOptions) {
  if (scrollOptions === void 0) {
    scrollOptions = {
      block: 'center',
      behavior: 'smooth',
      inViewThreshold: 0
    };
  }

  var _useState = useState(false),
      transition = _useState[0],
      setTransition = _useState[1];

  var _useState2 = useState(false),
      observing = _useState2[0],
      setObserving = _useState2[1];

  var _useState3 = useState(null),
      refresher = _useState3[0],
      setRefresher = _useState3[1];

  var _useState4 = useState(initialState),
      dimensions = _useState4[0],
      setdDimensions = _useState4[1];

  var target = document.querySelector(step == null ? void 0 : step.selector);
  var handleResize = useCallback(function () {
    // if (!target && !step?.highlightedSelectors) return
    setdDimensions(getHighlightedRect(target, step == null ? void 0 : step.highlightedSelectors, step == null ? void 0 : step.bypassElem));
  }, [target, step == null ? void 0 : step.highlightedSelectors]);
  useEffect(function () {
    handleResize();
    window.addEventListener('resize', handleResize);
    return function () {
      return window.removeEventListener('resize', handleResize);
    };
  }, [target, step == null ? void 0 : step.highlightedSelectors, refresher]);
  useEffect(function () {
    var isInView = inView(_extends({}, dimensions, {
      threshold: scrollOptions.inViewThreshold
    })); // TODO: - Solve cases when target elemente exceeds viewport
    // TODO: - Solve cases when no target but highlightedSelectors

    if (!isInView && target) {
      setTransition(true);
      smoothScroll(target, scrollOptions).then(function () {
        if (!observing) setRefresher(Date.now());
      })["finally"](function () {
        setTransition(false);
      });
    }
  }, [dimensions]);

  function observableRefresher() {
    setObserving(true);
    setdDimensions(getHighlightedRect(target, step == null ? void 0 : step.highlightedSelectors, step == null ? void 0 : step.bypassElem));
    setObserving(false);
  }

  return {
    sizes: dimensions,
    transition: transition,
    target: target,
    observableRefresher: observableRefresher
  };
}

function getHighlightedRect(node, highlightedSelectors, bypassElem) {
  if (highlightedSelectors === void 0) {
    highlightedSelectors = [];
  }

  if (bypassElem === void 0) {
    bypassElem = true;
  }

  var _getWindow = getWindow(),
      windowWidth = _getWindow.w,
      windowHeight = _getWindow.h;

  if (!highlightedSelectors) {
    return _extends({}, getRect(node), {
      windowWidth: windowWidth,
      windowHeight: windowHeight
    });
  }

  var attrs = getRect(node);
  var altAttrs = {
    bottom: 0,
    height: 0,
    left: windowWidth,
    right: 0,
    top: windowHeight,
    width: 0
  };

  for (var _iterator = _createForOfIteratorHelperLoose(highlightedSelectors), _step; !(_step = _iterator()).done;) {
    var selector = _step.value;
    var element = document.querySelector(selector);

    if (!element || element.style.display === 'none' || element.style.visibility === 'hidden') {
      continue;
    }

    var rect = getRect(element);

    if (bypassElem || !node) {
      if (rect.top < altAttrs.top) {
        altAttrs.top = rect.top;
      }

      if (rect.right > altAttrs.right) {
        altAttrs.right = rect.right;
      }

      if (rect.bottom > altAttrs.bottom) {
        altAttrs.bottom = rect.bottom;
      }

      if (rect.left < altAttrs.left) {
        altAttrs.left = rect.left;
      }

      altAttrs.width = altAttrs.right - altAttrs.left;
      altAttrs.height = altAttrs.bottom - altAttrs.top;
    } else {
      if (rect.top < attrs.top) {
        attrs.top = rect.top;
      }

      if (rect.right > attrs.right) {
        attrs.right = rect.right;
      }

      if (rect.bottom > attrs.bottom) {
        attrs.bottom = rect.bottom;
      }

      if (rect.left < attrs.left) {
        attrs.left = rect.left;
      }

      attrs.width = attrs.right - attrs.left;
      attrs.height = attrs.bottom - attrs.top;
    }
  }

  var bypassable = bypassElem || !node ? altAttrs.width > 0 && altAttrs.height > 0 : false;
  return {
    left: (bypassable ? altAttrs : attrs).left,
    top: (bypassable ? altAttrs : attrs).top,
    right: (bypassable ? altAttrs : attrs).right,
    bottom: (bypassable ? altAttrs : attrs).bottom,
    width: (bypassable ? altAttrs : attrs).width,
    height: (bypassable ? altAttrs : attrs).height,
    windowWidth: windowWidth,
    windowHeight: windowHeight
  };
}

var defaultStyles = {
  badge: function badge() {
    return {
      position: 'absolute',
      fontFamily: 'monospace',
      background: 'var(--reactour-accent,#007aff)',
      height: '1.875em',
      lineHeight: 2,
      paddingLeft: '0.8125em',
      paddingRight: '0.8125em',
      fontSize: '1em',
      borderRadius: '1.625em',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 0.25em 0.5em rgba(0, 0, 0, 0.3)',
      top: '-0.8125em',
      left: '-0.8125em'
    };
  },
  controls: function controls() {
    return {
      display: 'flex',
      marginTop: 24,
      alignItems: 'center',
      justifyContent: 'space-between'
    };
  },
  navigation: function navigation() {
    return {
      counterReset: 'dot',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    };
  },
  button: function button(_ref) {
    var disabled = _ref.disabled;
    return {
      display: 'block',
      padding: 0,
      border: 0,
      background: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer'
    };
  },
  arrow: function arrow(_ref2) {
    var disabled = _ref2.disabled;
    return {
      color: disabled ? '#caccce' : '#646464',
      width: 16,
      height: 12,
      flex: '0 0 16px',
      '&:hover': {
        color: disabled ? '#caccce' : '#000'
      }
    };
  },
  dot: function dot(_ref3) {
    var current = _ref3.current,
        disabled = _ref3.disabled,
        showNumber = _ref3.showNumber;
    return {
      counterIncrement: 'dot',
      width: 8,
      height: 8,
      border: current ? '0' : '1px solid #caccce',
      borderRadius: '100%',
      padding: 0,
      display: 'block',
      margin: 4,
      transition: 'opacity 0.3s, transform 0.3s',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: "scale(" + (current ? 1.25 : 1) + ")",
      color: current ? 'var(--reactour-accent, #007aff)' : '#caccce',
      background: current ? 'var(--reactour-accent, #007aff)' : 'none',
      '&:before': {
        content: 'counter(dot)',
        position: 'absolute',
        bottom: 'calc(100% + 0.25em)',
        left: '50%',
        opacity: 0,
        transform: 'translate(-50%, 1em)',
        transition: '0.3s',
        display: showNumber ? 'block' : 'none'
      },
      '&:hover': {
        backgroundColor: 'currentColor',
        '&:before': {
          opacity: 0.5,
          transform: 'translate(-50%, -2px)'
        }
      }
    };
  },
  close: function close(_ref4) {
    var disabled = _ref4.disabled;
    return {
      position: 'absolute',
      top: 22,
      right: 22,
      width: 9,
      height: 9,
      color: disabled ? '#caccce' : '#5e5e5e',
      '&:hover': {
        color: disabled ? '#caccce' : '#000'
      }
    };
  }
};
function stylesMatcher(styles) {
  return function (key, state) {
    var base = defaultStyles[key](state);
    var custom = styles[key];
    return custom ? custom(base, state) : base;
  };
}

/** @jsx jsx */

var Badge = function Badge(_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      children = _ref.children;
  var getStyles = stylesMatcher(styles);
  return jsx("span", {
    css: getStyles('badge', {})
  }, children);
};

/** @jsx jsx */

var Navigation = function Navigation(_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      steps = _ref.steps,
      setCurrentStep = _ref.setCurrentStep,
      currentStep = _ref.currentStep,
      setIsOpen = _ref.setIsOpen,
      nextButton = _ref.nextButton,
      prevButton = _ref.prevButton,
      disableDots = _ref.disableDots,
      hideButtons = _ref.hideButtons,
      disableAll = _ref.disableAll,
      rtl = _ref.rtl;
  var stepsLength = steps.length;
  var getStyles = stylesMatcher(styles);

  var Button = function Button(_ref2) {
    var onClick = _ref2.onClick,
        _ref2$kind = _ref2.kind,
        kind = _ref2$kind === void 0 ? 'next' : _ref2$kind,
        children = _ref2.children,
        hideArrow = _ref2.hideArrow;

    function clickHandler() {
      if (!disableAll) {
        if (onClick && typeof onClick === 'function') {
          onClick();
        } else {
          if (kind === 'next') {
            setCurrentStep(Math.min(currentStep + 1, stepsLength - 1));
          } else {
            setCurrentStep(Math.max(currentStep - 1, 0));
          }
        }
      }
    }

    return jsx("button", {
      css: getStyles('button', {
        kind: kind,
        disabled: disableAll ? disableAll : kind === 'next' ? stepsLength - 1 === currentStep : currentStep === 0
      }),
      onClick: clickHandler,
      "aria-label": "Go to " + kind + " step"
    }, !hideArrow ? jsx(Arrow, {
      styles: styles,
      inverted: rtl ? kind === 'prev' : kind === 'next',
      disabled: disableAll ? disableAll : kind === 'next' ? stepsLength - 1 === currentStep : currentStep === 0
    }) : null, children);
  };

  return jsx("div", {
    css: getStyles('controls', {}),
    dir: rtl ? 'rtl' : 'ltr'
  }, !hideButtons ? prevButton && typeof prevButton === 'function' ? prevButton({
    Button: Button,
    setCurrentStep: setCurrentStep,
    currentStep: currentStep,
    stepsLength: stepsLength,
    setIsOpen: setIsOpen
  }) : jsx(Button, {
    kind: "prev"
  }) : null, jsx("div", {
    css: getStyles('navigation', {})
  }, Array.from({
    length: stepsLength
  }, function (_, i) {
    return i;
  }).map(function (index) {
    var _steps$index;

    return jsx("button", {
      css: getStyles('dot', {
        current: index === currentStep,
        disabled: disableDots || disableAll
      }),
      onClick: function onClick() {
        if (!disableDots && !disableAll) setCurrentStep(index);
      },
      key: "navigation_dot_" + index,
      "aria-label": ((_steps$index = steps[index]) == null ? void 0 : _steps$index.navDotAriaLabel) || "Go to step " + (index + 1)
    });
  })), !hideButtons ? nextButton && typeof nextButton === 'function' ? nextButton({
    Button: Button,
    setCurrentStep: setCurrentStep,
    currentStep: currentStep,
    stepsLength: stepsLength,
    setIsOpen: setIsOpen
  }) : jsx(Button, null) : null);
};

var Arrow = function Arrow(_ref3) {
  var _ref3$styles = _ref3.styles,
      styles = _ref3$styles === void 0 ? {} : _ref3$styles,
      _ref3$inverted = _ref3.inverted,
      inverted = _ref3$inverted === void 0 ? false : _ref3$inverted,
      disabled = _ref3.disabled;
  var getStyles = stylesMatcher(styles);
  return jsx("svg", {
    viewBox: "0 0 18.4 14.4",
    css: getStyles('arrow', {
      inverted: inverted,
      disabled: disabled
    })
  }, jsx("path", {
    d: inverted ? 'M17 7.2H1M10.8 1L17 7.2l-6.2 6.2' : 'M1.4 7.2h16M7.6 1L1.4 7.2l6.2 6.2',
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeMiterlimit: "10"
  }));
};

var Content = function Content(_ref) {
  var content = _ref.content,
      setCurrentStep = _ref.setCurrentStep,
      transition = _ref.transition,
      currentStep = _ref.currentStep,
      setIsOpen = _ref.setIsOpen;
  return typeof content === 'function' ? content({
    setCurrentStep: setCurrentStep,
    transition: transition,
    currentStep: currentStep,
    setIsOpen: setIsOpen
  }) : content;
};

var Close = function Close(_ref) {
  var _ref$styles = _ref.styles,
      styles = _ref$styles === void 0 ? {} : _ref$styles,
      onClick = _ref.onClick,
      disabled = _ref.disabled,
      props = _objectWithoutPropertiesLoose(_ref, ["styles", "onClick", "disabled"]);

  var getStyles = stylesMatcher(styles);
  return jsx("button", Object.assign({
    css: _extends({}, getStyles('button', {}), getStyles('close', {
      disabled: disabled
    })),
    onClick: onClick
  }, props), jsx("svg", {
    viewBox: "0 0 9.1 9.1",
    "aria-hidden": true,
    role: "presentation"
  }, jsx("path", {
    fill: "currentColor",
    d: "M5.9 4.5l2.8-2.8c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L4.5 3.1 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4l2.8 2.8L.3 7.4c-.4.4-.4 1 0 1.4.2.2.4.3.7.3s.5-.1.7-.3L4.5 6l2.8 2.8c.3.2.5.3.8.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L5.9 4.5z"
  })));
};

var Keyboard = function Keyboard(_ref) {
  var disableKeyboardNavigation = _ref.disableKeyboardNavigation,
      setCurrentStep = _ref.setCurrentStep,
      setIsOpen = _ref.setIsOpen,
      stepsLength = _ref.stepsLength,
      disable = _ref.disable,
      rtl = _ref.rtl;

  function keyDownHandler(e) {
    e.stopPropagation();

    if (disableKeyboardNavigation === true || disable) {
      return;
    }

    var isEscDisabled, isRightDisabled, isLeftDisabled;

    if (disableKeyboardNavigation) {
      isEscDisabled = disableKeyboardNavigation.includes('esc');
      isRightDisabled = disableKeyboardNavigation.includes('right');
      isLeftDisabled = disableKeyboardNavigation.includes('left');
    }

    function next() {
      setCurrentStep(function (c) {
        return Math.min(c + 1, stepsLength - 1);
      });
    }

    function prev() {
      setCurrentStep(function (c) {
        return Math.max(c - 1, 0);
      });
    }

    if (e.keyCode === 27 && !isEscDisabled) {
      e.preventDefault();
      setIsOpen(false);
    }

    if (e.keyCode === 39 && !isRightDisabled) {
      e.preventDefault();

      if (rtl) {
        prev();
      } else {
        next();
      }
    }

    if (e.keyCode === 37 && !isLeftDisabled) {
      e.preventDefault();

      if (rtl) {
        next();
      } else {
        prev();
      }
    }
  }

  useEffect(function () {
    window.addEventListener('keydown', keyDownHandler, false);
    return function () {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [disable]);
  return null;
};

var Tour = function Tour(_ref) {
  var currentStep = _ref.currentStep,
      setCurrentStep = _ref.setCurrentStep,
      setIsOpen = _ref.setIsOpen,
      _ref$steps = _ref.steps,
      steps = _ref$steps === void 0 ? [] : _ref$steps,
      _ref$styles = _ref.styles,
      globalStyles = _ref$styles === void 0 ? {} : _ref$styles,
      scrollSmooth = _ref.scrollSmooth,
      afterOpen = _ref.afterOpen,
      beforeClose = _ref.beforeClose,
      _ref$padding = _ref.padding,
      padding = _ref$padding === void 0 ? 10 : _ref$padding,
      position = _ref.position,
      onClickMask = _ref.onClickMask,
      onClickHighlighted = _ref.onClickHighlighted,
      badgeContent = _ref.badgeContent,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'reactour__popover' : _ref$className,
      _ref$maskClassName = _ref.maskClassName,
      maskClassName = _ref$maskClassName === void 0 ? 'reactour__mask' : _ref$maskClassName,
      highlightedMaskClassName = _ref.highlightedMaskClassName,
      disableInteraction = _ref.disableInteraction,
      disableFocusLock = _ref.disableFocusLock,
      disableDotsNavigation = _ref.disableDotsNavigation,
      disableKeyboardNavigation = _ref.disableKeyboardNavigation,
      inViewThreshold = _ref.inViewThreshold,
      nextButton = _ref.nextButton,
      prevButton = _ref.prevButton,
      _ref$showPrevNextButt = _ref.showPrevNextButtons,
      showPrevNextButtons = _ref$showPrevNextButt === void 0 ? true : _ref$showPrevNextButt,
      _ref$showCloseButton = _ref.showCloseButton,
      showCloseButton = _ref$showCloseButton === void 0 ? true : _ref$showCloseButton,
      _ref$showNavigation = _ref.showNavigation,
      showNavigation = _ref$showNavigation === void 0 ? true : _ref$showNavigation,
      _ref$showBadge = _ref.showBadge,
      showBadge = _ref$showBadge === void 0 ? true : _ref$showBadge,
      disabledActions = _ref.disabledActions,
      setDisabledActions = _ref.setDisabledActions,
      rtl = _ref.rtl,
      _ref$accessibilityOpt = _ref.accessibilityOptions,
      accessibilityOptions = _ref$accessibilityOpt === void 0 ? {
    closeButtonAriaLabel: 'Close Tour',
    showNavigationScreenReaders: true
  } : _ref$accessibilityOpt;
  var step = steps[currentStep];
  var styles = (step == null ? void 0 : step.styles) || globalStyles;

  var _useSizes = useSizes(step, {
    block: 'center',
    behavior: scrollSmooth ? 'smooth' : 'auto',
    inViewThreshold: inViewThreshold
  }),
      sizes = _useSizes.sizes,
      transition = _useSizes.transition,
      observableRefresher = _useSizes.observableRefresher,
      target = _useSizes.target;

  useEffect(function () {
    if (afterOpen && typeof afterOpen === 'function') {
      afterOpen(target);
    }

    return function () {
      if (beforeClose && typeof beforeClose === 'function') {
        beforeClose(target);
      }
    };
  }, []);

  var _getPadding = getPadding((step == null ? void 0 : step.padding) || padding),
      maskPadding = _getPadding.maskPadding,
      popoverPadding = _getPadding.popoverPadding;

  function maskClickHandler() {
    if (!disabledActions) {
      if (onClickMask && typeof onClickMask === 'function') {
        onClickMask({
          setCurrentStep: setCurrentStep,
          setIsOpen: setIsOpen,
          currentStep: currentStep,
          steps: steps
        });
      } else {
        setIsOpen(false);
      }
    }
  }

  var badge = badgeContent && typeof badgeContent === 'function' ? badgeContent({
    currentStep: currentStep,
    totalSteps: steps.length,
    transition: transition
  }) : currentStep + 1;
  var doDisableInteraction = step != null && step.stepInteraction ? !(step != null && step.stepInteraction) : disableInteraction;
  useEffect(function () {
    if (step != null && step.action && typeof (step == null ? void 0 : step.action) === 'function') {
      step == null ? void 0 : step.action(target);
    }

    if (step != null && step.disableActions) {
      setDisabledActions(true);
    }
  }, [step]);
  var popoverPosition = transition ? 'center' : step != null && step.position ? step == null ? void 0 : step.position : position;
  return step ? React.createElement(Portal, null, React.createElement(FocusManager, {
    disabled: disableFocusLock
  }, React.createElement(Observables, {
    mutationObservables: step == null ? void 0 : step.mutationObservables,
    resizeObservables: step == null ? void 0 : step.resizeObservables,
    refresh: observableRefresher
  }), React.createElement(Keyboard, {
    setCurrentStep: setCurrentStep,
    setIsOpen: setIsOpen,
    stepsLength: steps.length,
    disableKeyboardNavigation: disableKeyboardNavigation,
    disable: disabledActions,
    rtl: rtl
  }), React.createElement(Mask, {
    sizes: sizes,
    onClick: maskClickHandler,
    styles: _extends({
      highlightedArea: function highlightedArea(base) {
        return _extends({}, base, {
          display: doDisableInteraction ? 'block' : 'none'
        });
      }
    }, styles),
    padding: maskPadding,
    highlightedAreaClassName: highlightedMaskClassName,
    className: maskClassName,
    onClickHighlighted: onClickHighlighted
  }), React.createElement(Popover, {
    sizes: sizes,
    styles: styles,
    position: popoverPosition,
    padding: popoverPadding,
    "aria-labelledby": accessibilityOptions == null ? void 0 : accessibilityOptions.ariaLabelledBy,
    className: className
  }, showBadge ? React.createElement(Badge, {
    styles: styles
  }, badge) : null, showCloseButton ? React.createElement(Close, {
    styles: styles,
    "aria-label": accessibilityOptions == null ? void 0 : accessibilityOptions.closeButtonAriaLabel,
    disabled: disabledActions,
    onClick: function onClick() {
      if (!disabledActions) setIsOpen(false);
    }
  }) : null, React.createElement(Content, {
    content: step == null ? void 0 : step.content,
    setCurrentStep: setCurrentStep,
    currentStep: currentStep,
    transition: transition,
    setIsOpen: setIsOpen
  }), showNavigation ? React.createElement(Navigation, {
    setCurrentStep: setCurrentStep,
    currentStep: currentStep,
    setIsOpen: setIsOpen,
    steps: steps,
    styles: styles,
    "aria-hidden": !(accessibilityOptions != null && accessibilityOptions.showNavigationScreenReaders),
    nextButton: nextButton,
    prevButton: prevButton,
    disableDots: disableDotsNavigation,
    hideButtons: !showPrevNextButtons,
    disableAll: disabledActions,
    rtl: rtl
  }) : null))) : null;
};

var FocusManager = function FocusManager(_ref2) {
  var disabled = _ref2.disabled,
      children = _ref2.children;
  return disabled ? React.createElement(React.Fragment, null, children) : React.createElement(FocusScope, {
    contain: true,
    autoFocus: true,
    restoreFocus: true
  }, children);
};

function getPadding(padding) {
  if (typeof padding === 'object' && padding !== null) {
    return {
      maskPadding: padding.mask,
      popoverPadding: padding.popover
    };
  }

  return {
    maskPadding: padding,
    popoverPadding: padding
  };
}

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  var ref = useRef(); // Store current value in ref

  useEffect(function () {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)

  return ref.current;
}

var defaultState = {
  isOpen: false,
  setIsOpen: function setIsOpen() {
    return false;
  },
  currentStep: 0,
  setCurrentStep: function setCurrentStep() {
    return 0;
  },
  steps: [],
  setSteps: function setSteps() {
    return [];
  },
  disabledActions: false,
  setDisabledActions: function setDisabledActions() {
    return false;
  }
};
var TourContext = /*#__PURE__*/React.createContext(defaultState);

var TourProvider = function TourProvider(_ref) {
  var children = _ref.children,
      _ref$defaultOpen = _ref.defaultOpen,
      defaultOpen = _ref$defaultOpen === void 0 ? false : _ref$defaultOpen,
      _ref$startAt = _ref.startAt,
      startAt = _ref$startAt === void 0 ? 0 : _ref$startAt,
      defaultSteps = _ref.steps,
      onClose = _ref.onClose,
      props = _objectWithoutPropertiesLoose(_ref, ["children", "defaultOpen", "startAt", "steps", "onClose"]);

  var _useState = useState(defaultOpen),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var _useState2 = useState(startAt),
      currentStep = _useState2[0],
      setCurrentStep = _useState2[1];

  var _useState3 = useState(defaultSteps),
      steps = _useState3[0],
      setSteps = _useState3[1];

  var _useState4 = useState(false),
      disabledActions = _useState4[0],
      setDisabledActions = _useState4[1];

  var value = _extends({
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    currentStep: currentStep,
    setCurrentStep: setCurrentStep,
    steps: steps,
    setSteps: setSteps,
    disabledActions: disabledActions,
    setDisabledActions: setDisabledActions
  }, props);

  var previousIsOpen = usePrevious(isOpen);
  useEffect(function () {
    var hasClosedTour = previousIsOpen === true && isOpen === false;

    if (hasClosedTour && onClose && typeof onClose === 'function') {
      onClose({
        currentStep: currentStep,
        steps: steps
      });
    }
  }, [isOpen, previousIsOpen]);
  return React.createElement(TourContext.Provider, {
    value: value
  }, children, isOpen ? React.createElement(Tour, Object.assign({}, value)) : null);
};
function useTour() {
  return useContext(TourContext);
}

function withTour(WrappedComponent) {
  var ComponentWithTour = function ComponentWithTour(props) {
    var tourProps = useTour();
    return React.createElement(WrappedComponent, Object.assign({}, props, tourProps));
  };

  return ComponentWithTour;
}

export default Tour;
export { Tour, TourContext, TourProvider, useTour, withTour };
//# sourceMappingURL=tour.esm.js.map
