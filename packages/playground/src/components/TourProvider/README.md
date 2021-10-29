### Basic example

Navigate through three simple steps using Popover buttons or the keyboard

```jsx
import { useState } from 'react'
import { useTour } from '@reactour/tour'

const stepStyle = { color: '#5ae' }

function Paragraphs() {
  const { setIsOpen, ...rest } = useTour()
  return (
    <div>
      <p>
        <span data-tour="step-1" style={stepStyle}>
          Lorem ipsum
        </span>{' '}
        dolor sit amet, consectetur adipiscing elit. Vivamus volutpat quam eu
        mauris euismod imperdiet. Nullam elementum fermentum neque a placerat.
        Vivamus sed dui nisi. Phasellus vel dolor interdum, accumsan eros ut,
        rutrum dolor.{' '}
        <span data-tour="step-2" style={stepStyle}>
          Pellentesque a magna enim. Pellentesque malesuada egestas urna, et
          pulvinar lorem viverra suscipit.
        </span>
        Duis sit amet mauris ante. Fusce at ante nunc. Maecenas ut leo eu erat porta
        fermentum.
      </p>{' '}
      <button onClick={() => setIsOpen(true)}>Open</button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet.{' '}
        <span data-tour="step-3" style={stepStyle}>
          Vivamus sed dui nisi. Phasellus vel dolor interdum,
        </span>
        Ut augue massa, aliquam in bibendum sed, euismod vitae magna. Nulla sit amet
        sodales augue. Curabitur in nulla in magna luctus porta et sit amet dolor.
        Pellentesque a magna enim.
      </p>
    </div>
  )
}

const steps = [
  {
    selector: '[data-tour="step-1"]',
    content: <p>Lorem ipsum dolor sit amet</p>,
  },
  {
    selector: '[data-tour="step-2"]',
    content: <p>consectetur adipiscing elit</p>,
  },
  {
    selector: '[data-tour="step-3"]',
    content: <p>Vivamus sed dui nisi</p>,
  },
]


const AppDemo = () => {
  return (
    <TourProvider steps={steps}>
      <Paragraphs />
    </TourProvider>
  )
}

<AppDemo />
```

### Mask Click

Change to next step clicking the _Mask_, when is the last one, closes the _Tour_.

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'mask-click'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
    <TourProvider
      steps={steps}
      onClickMask={({ setCurrentStep, currentStep, setIsOpen }) => {
        if (currentStep === steps.length - 1) {
          setIsOpen(false)
        }
        setCurrentStep(s => (s === steps.length - 1 ? 0 : s + 1))
      }}
    >
      <Placeholder demoId={demoId} />
    </TourProvider>
  )
}

<AppDemo />
```

### Disable Keyboard Navigation

Change to next step clicking the _Mask_, when is the last one, closes the _Tour_.

```jsx
import { useState } from 'react'
import { Placeholder, doSteps } from '../utils'

const demoId = 'disable-keyboard'
const steps = doSteps(demoId)
const [disable, setDisable] = useState(true)

function toggleKeys(key) {
  setDisable(value => {
    if (Array.isArray(value)) {
      if (value.includes(key)) {
        // Remove
        if (value.length === 1) {
          return false
        }
        return value.filter(v => v !== key)
      }
      // Add
      const newValue = Array.from(new Set([...value, key]))
      if (newValue.length === 3) {
        return true
      }
      return newValue
    } else {
      return [key]
    }
  })
}

const AppDemo = () => {
 return (
   <TourProvider steps={steps} disableKeyboardNavigation={disable}>
    <Placeholder demoId={demoId}>
      {' '}
      Disable: <label>
        <input
          type="checkbox"
          onChange={e => setDisable(e.target.checked)}
          checked={disable === true}
        />
        All
      </label>
      <label>
        <input
          type="checkbox"
          onChange={() => toggleKeys('left')}
          checked={Array.isArray(disable) && disable.includes('left')}
        />
        Left
      </label>
      <label>
        <input
          type="checkbox"
          onChange={() => toggleKeys('right')}
          checked={Array.isArray(disable) && disable.includes('right')}
        />
        Right
      </label>
      <label>
        <input
          type="checkbox"
          onChange={() => toggleKeys('esc')}
          checked={Array.isArray(disable) && disable.includes('esc')}
        />
        Esc
      </label>
    </Placeholder>
  </TourProvider>
 )
}

<AppDemo />
```

### Scroll Smooth

Change to next step clicking the _Mask_, when is the last one, closes the _Tour_.

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'scroll-smooth'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
   <TourProvider steps={steps} scrollSmooth>
    <Placeholder demoId={demoId} className="scroll-demo" />
    </TourProvider>
 )
}

<AppDemo />
```

### Popover fixed position

Show the Popover at the same fixed position on each step

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'fixed-position'
const steps = doSteps(demoId)

function calcPosition(sizes) {
  const { windowWidth, width, windowHeight, height } = sizes
  return [windowWidth - width - 20, windowHeight - height - 20]
}

const AppDemo = () => {
 return (
  <TourProvider steps={steps} position={calcPosition}>
    <Placeholder demoId={demoId} />
  </TourProvider>
 )
}

<AppDemo />
```

### Padding

Adjunsting padding values

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'padding'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
  <TourProvider steps={steps} padding={{ mask: 0, popover: [1, 5] }}>
    <Placeholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### Custom Prev and Next Button

Using cutsom buttons and behavior

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'prev-next-btn'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
   <TourProvider
    steps={steps}
    nextButton={({
      Button,
      currentStep,
      stepsLength,
      setIsOpen,
      setCurrentStep,
    }) => {
      const last = currentStep === stepsLength - 1
      return (
        <Button
          hideArrow={last}
          onClick={() => {
            if (last) {
              setIsOpen(false)
            } else {
              setCurrentStep(s => (s === steps.length - 1 ? 0 : s + 1))
            }
          }}
        >
          {last ? 'Close!' : null}
        </Button>
      )
    }}
    prevButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => {
      const first = currentStep === 0
      const next = first ? steps.length - 1 : currentStep - 1
      return (
        <button
          class="custom-btn"
          onClick={() => {
            if (first) {
              setCurrentStep(s => steps.length - 1)
            } else {
              setCurrentStep(s => s - 1)
            }
          }}
        >
          Back to step {next + 1}. {steps[next].content}
        </button>
      )
    }}
  >
    <Placeholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### RTL

Using RTL layout

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'rtl'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
  <TourProvider steps={steps} rtl>
    <Placeholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### Styles

Customizing styles

```jsx
import { Placeholder, doSteps } from '../utils'
import { keyframes } from '@emotion/react'
const demoId = 'custom-styles'
const steps = doSteps(demoId)
const radius = 10

const keyframesRotate = keyframes`
  50% {
    transform: translateY(-5px  );
  }
}`

const AppDemo = () => {
 return (
   <TourProvider
    styles={{
      popover: base => ({
        ...base,
        '--reactour-accent': '#ef5a3d',
        borderRadius: radius,
      }),
      maskArea: base => ({ ...base, rx: radius }),
      maskWrapper: base => ({ ...base, color: '#ef5a3d' }),
      badge: base => ({ ...base, left: 'auto', right: '-0.8125em' }),
      controls: base => ({ ...base, marginTop: 100 }),
      close: base => ({ ...base, right: 'auto', left: 8, top: 8 }),
      dot: base => ({
        ...base,
        animationDuration: '1s',
        animationName: keyframesRotate,
        animationIterationCount: 'infinite',
        '&:nth-of-type(1)': {
          animationDelay: '.3s',
        },
        '&:nth-of-type(2)': {
          animationDelay: '.6s',
        },
      }),
    }}
    steps={steps}
  >
    <Placeholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### Disable scroll

In this example we are using [body-scroll-lock](https://www.npmjs.com/package/body-scroll-lock) to disable scroll on `afterOpen` and retrieve on `beforeClose`

```jsx
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { Placeholder, doSteps } from '../utils'

const demoId = 'scroll-lock'
const steps = doSteps(demoId)
const disableBody = target => disableBodyScroll(target)
const enableBody = target => enableBodyScroll(target)

const AppDemo = () => {
 return (
    <TourProvider steps={steps} afterOpen={disableBody} beforeClose={enableBody}>
      <Placeholder demoId={demoId} />
    </TourProvider>
  )
}

<AppDemo />
```

### Badge Content

Update Badge content thourgh custom function

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'custom-badge'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
    <TourProvider
      steps={steps}
      badgeContent={({ totalSteps, currentStep }) =>
        `${currentStep + 1}/${totalSteps}`
      }
    >
      <Placeholder demoId={demoId} />
    </TourProvider>
  )
}

<AppDemo />
```

### Disable Dots Navigation

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'disable-dots-nav'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
   <TourProvider steps={steps} disableDotsNavigation>
      <Placeholder demoId={demoId} />
    </TourProvider>
  )
}

<AppDemo />
```

### Disable Interaction

In this example is disabled the ability to interact with the highlightes content. Try selecting the text inside the Mask

```jsx
import { TextPlaceholder, doSteps } from '../utils'

const demoId = 'disable-interaction'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
  <TourProvider
    steps={steps}
    onClickHighlighted={e => {
      e.stopPropagation()
      console.log('No interaction')
    }}
    disableInteraction
  >
    <TextPlaceholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### Show/Hide Navigation parts

```jsx
import { useState } from 'react'
import { Placeholder, doSteps } from '../utils'

const demoId = 'show-hide-nav'
const steps = doSteps(demoId)
const [values, setValues] = useState({
  badge: true,
  close: true,
  nav: true,
  prevNext: true,
})

function toggleKeys(key) {
  setValues(value => {
    if (value[key]) {
      return { ...value, [key]: false }
    }
    return { ...value, [key]: true }
  })
}

const AppDemo = () => {
 return (
  <TourProvider
    steps={steps}
    showBadge={values.badge}
    showCloseButton={values.close}
    showNavigation={values.nav}
    showPrevNextButtons={values.prevNext}
  >
    <Placeholder demoId={demoId}>
      {' '}
      <label>
        <input
          type="checkbox"
          onChange={e => toggleKeys('badge')}
          checked={values.badge}
        />
        Badge
      </label>
      <label>
        <input
          type="checkbox"
          onChange={e => toggleKeys('close')}
          checked={values.close}
        />
        Close button
      </label>
      <label>
        <input
          type="checkbox"
          onChange={e => toggleKeys('nav')}
          checked={values.nav}
        />
        Navigation
      </label>
      <label>
        <input
          type="checkbox"
          onChange={e => toggleKeys('prevNext')}
          checked={values.prevNext}
        />
        Prev and Next buttons
      </label>
    </Placeholder>
  </TourProvider>
  )
}

<AppDemo />
```

### Start at specific step

```jsx
import { Placeholder, doSteps } from '../utils'

const demoId = 'start-at'
const steps = doSteps(demoId)

const AppDemo = () => {
 return (
  <TourProvider steps={steps} startAt={1}>
    <Placeholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### Routes Demo

```jsx
import { useEffect } from 'react'
import {
  useRouteMatch,
  Switch,
  Route,
  Link,
  useLocation,
  BrowserRouter as Router,
} from 'react-router-dom'
import { useTour } from '@reactour/tour'

const steps = [
  {
    selector: '[data-tour="r-step-1"]',
    content: 'text 1',
  },
  {
    selector: '[data-tour="r-step-2"]',
    content: 'text 2',
  },
  {
    selector: '[data-tour="r-step-3"]',
    content: 'text 3',
  },
]

function Routes() {
  let location = useLocation()
  const { path, url } = useRouteMatch()
  const { setSteps, setCurrentStep } = useTour()
  useEffect(() => {
    setCurrentStep(0)
    if (location.pathname === '/page-1') {
      setSteps([
        {
          selector: '[data-tour="r-step-page"]',
          content: 'text page',
        },
      ])
    } else if (location.pathname === '/page-2') {
      setSteps([
        {
          selector: '[data-tour="r-step-page-2"]',
          content: 'text page 2',
        },
        {
          selector: '[data-tour="r-step-page-3"]',
          content: 'text page 3',
        },
      ])
    } else {
      setSteps(steps)
    }
  }, [location.pathname, setCurrentStep, setSteps])

  return (
    <>
      <header>
        <Link to="/">Home</Link> <Link to="/page-1">Page 1</Link>{' '}
        <Link to="/page-2">Page 2</Link> <Link to="/page-3">Page 3</Link>
      </header>{' '}
      <Switch>
        <Route path="/page-1">
          <DemoPage1 />
        </Route>
        <Route path="/page-2">
          <DemoPage2 />
        </Route>
        <Route path="/page-3">Page 3</Route>
        <Route exact path="/">
          <DemoHome />
        </Route>
      </Switch>
    </>
  )
}

function DemoPage1() {
  return (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat
      quam eu mauris euismod imperdiet. Nullam elementum fermentum neque a
      placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum, accumsan
      eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus vitae urna at
      congue.{' '}
      <Link data-tour="r-step-page" to="/">
        Back Home
      </Link>
    </p>
  )
}

function DemoPage2() {
  return (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat
      quam eu mauris euismod imperdiet. Nullam elementum fermentum neque a
      placerat. <span data-tour="r-step-page-2">Vivamus sed dui nisi.</span>{' '}
      Phasellus vel dolor interdum, accumsan eros ut, rutrum dolor. Etiam in leo
      urna. Vestibulum maximus vitae urna at congue.{' '}
      <Link data-tour="r-step-page-3" to="/">
        Back Home
      </Link>
    </p>
  )
}

function DemoHome() {
  const { setIsOpen } = useTour()
  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet. Nullam elementum fermentum
        neque a placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum,
        accumsan eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus
        vitae urna at congue.{' '}
        <Link data-tour="r-step-1" to="/page-1">
          Page 1
        </Link>
        Vivamus lectus nisi, pellentesque at orci a, tempor lobortis orci. Praesent
        non lorem erat. Ut augue massa, aliquam in bibendum sed, euismod vitae magna.
        Nulla sit amet sodales augue. Curabitur in nulla in magna luctus porta et
        sit amet dolor. Pellentesque a magna enim. Pellentesque malesuada egestas
        urna, et pulvinar lorem viverra suscipit. Duis sit amet mauris ante. Fusce
        at ante nunc. Maecenas ut leo eu erat porta fermentum.
      </p>{' '}
      <Link to="/" data-tour="r-step-2">
        Back Home 2
      </Link>{' '}
      <button onClick={() => setIsOpen(true)}>Open</button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet. Nullam elementum fermentum
        neque a placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum,
        accumsan eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus
        vitae urna at congue. Vivamus lectus nisi, pellentesque at orci a,
        tempor lobortis orci. Praesent non lorem erat. Ut augue massa, aliquam
        in bibendum sed, euismod vitae magna. Nulla sit amet sodales augue.
        Curabitur in nulla in magna luctus porta et sit amet dolor. Pellentesque
        a magna enim. Pellentesque malesuada{' '}
        <Link data-tour="r-step-3" to="/page-2">
          Page 2
        </Link>
        egestas urna, et pulvinar lorem viverra suscipit. Duis sit amet mauris ante.
        Fusce at ante nunc. Maecenas ut leo eu erat porta fermentum.
      </p>
    </div>
  )
}

const AppDemo = () => {
 return (
  <Router>
    <TourProvider steps={steps}>
      <Routes />
    </TourProvider>
  </Router>
 )
}

<AppDemo />
```

### Modal Demo

```jsx
import { useEffect, useContext } from 'react'
import { ModalProvider, ModalContext } from 'modaaals'
import { useTour } from '@reactour/tour'

const steps = [
  {
    selector: '[data-tour="1"]',
    content: 'text 1',
    highlightedSelectors: ['.modaaals-modal'],
    mutationObservables: ['#portaaal'],
  },
  { selector: '[data-tour="2"]', content: 'text 2' },
  { selector: '[data-tour="3"]', content: 'text 3' },
]

const modals = {
  test: TestModal,
}

function TestModal() {
  return (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat
      quam eu mauris euismod imperdiet. Nullam elementum fermentum neque a
      placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum, accumsan
      eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus vitae urna at
      congue.
    </p>
  )
}

function DemoHome() {
  const { setIsOpen } = useTour()
  const { openModal } = useContext(ModalContext)
  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet. Nullam elementum fermentum
        neque a placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum,
        accumsan eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus
        vitae urna at congue.{' '}
        <button data-tour="1" onClick={() => openModal('test')}>
          Open Modal
        </button>
        Vivamus lectus nisi, pellentesque at orci a, tempor lobortis orci. Praesent
        non lorem erat. Ut augue massa, aliquam in bibendum sed, euismod vitae magna.
        Nulla sit amet sodales augue. Curabitur in nulla in magna luctus porta et
        sit amet dolor. Pellentesque a magna enim. Pellentesque malesuada egestas
        urna, et pulvinar lorem viverra suscipit. Duis sit amet mauris ante. Fusce
        at ante nunc. Maecenas ut leo eu erat porta fermentum.
      </p>{' '}
      <button to="/" data-tour="2">
        Back Home 2
      </button>{' '}
      <button onClick={() => setIsOpen(true)}>Open</button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet. Nullam elementum fermentum
        neque a placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum,
        accumsan eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus
        vitae urna at congue. Vivamus lectus nisi, pellentesque at orci a,
        tempor lobortis orci. Praesent non lorem erat. Ut augue massa, aliquam
        in bibendum sed, euismod vitae magna. Nulla sit amet sodales augue.
        Curabitur in nulla in magna luctus porta et sit amet dolor. Pellentesque
        a magna enim. Pellentesque malesuada{' '}
        <button data-tour="3">Back Home 3</button>
        egestas urna, et pulvinar lorem viverra suscipit. Duis sit amet mauris ante.
        Fusce at ante nunc. Maecenas ut leo eu erat porta fermentum.
      </p>
    </div>
  )
}

const AppDemo = () => {
 return (
  <TourProvider steps={steps}>
    <ModalProvider
      modals={modals}
      styles={{
        contentInner: base => ({ ...base, margin: 50 }),
      }}
      className="modaaals-modal"
      skipMotion
    >
      <DemoHome />
    </ModalProvider>
  </TourProvider>
  )
}

<AppDemo />
```

### Disable Actions

Disable all actions (next, prev, close) until unlocked in some way

```jsx
import { useEffect, useState } from 'react'
import { useTour } from '@reactour/tour'

const steps = [
  {
    selector: '[data-tour="disabled-1"]',
    content: 'Lorem ipsum dolor sit amet',
  },
  {
    selector: '[data-tour="disabled-2"]',
    content: 'You are the only one that could let the Tour continue.',
    disableActions: true,
    highlightedSelectors: ['.step-wrapper'],
    mutationObservables: ['.to-observe'],
  },
  { selector: '[data-tour="disabled-3"]', content: 'Etiam in leo urna.' },
]

function DemoHome() {
  const { setIsOpen, setCurrentStep, setDisabledActions } = useTour()
  const [showMore, setShowMore] = useState(false)

  return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet. Nullam elementum fermentum
        neque a placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum,
        accumsan eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus
        vitae urna at congue.{' '}
        <button data-tour="disabled-1">Lorem Ipsum</button>
        Vivamus lectus nisi, pellentesque at orci a, tempor lobortis orci. Praesent
        non lorem erat. Ut augue massa, aliquam in bibendum sed, euismod vitae magna.
        Nulla sit amet sodales augue. Curabitur in nulla in magna luctus porta et
        sit amet dolor. Pellentesque a magna enim. Pellentesque malesuada egestas
        urna, et pulvinar lorem viverra suscipit. Duis sit amet mauris ante. Fusce
        at ante nunc. Maecenas ut leo eu erat porta fermentum.
      </p>{' '}
      <p className="step-wrapper">
        At this point you need to make an action to continue the Tour. Please
        <button
          to="/"
          data-tour="disabled-2"
          onClick={() => {
            setShowMore(s => !s)
            setDisabledActions(false)
          }}
        >
          Enable actions
        </button> {showMore && (
          <>
            <br />
            <strong className="to-observe">
              Great! Now you could continue the Tour.
            </strong>
          </>
        )}
      </p>
      <button onClick={() => setIsOpen(true)}>Open Tour</button>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        volutpat quam eu mauris euismod imperdiet. Nullam elementum fermentum
        neque a placerat. Vivamus sed dui nisi. Phasellus vel dolor interdum,
        accumsan eros ut, rutrum dolor. Etiam in leo urna. Vestibulum maximus
        vitae urna at congue. Vivamus lectus nisi, pellentesque at orci a,
        tempor lobortis orci. Praesent non lorem erat. Ut augue massa, aliquam
        in bibendum sed, euismod vitae magna. Nulla sit amet sodales augue.
        Curabitur in nulla in magna luctus porta et sit amet dolor. Pellentesque
        a magna enim. Pellentesque malesuada{' '}
        <button data-tour="disabled-3" onClick={() => setCurrentStep(0)}>
          Back To Fisrt Step{' '}
        </button>
        egestas urna, et pulvinar lorem viverra suscipit. Duis sit amet mauris ante.
        Fusce at ante nunc. Maecenas ut leo eu erat porta fermentum.
      </p>
    </div>
  )
}

const AppDemo = () => {
 return (
  <TourProvider steps={steps}>
    <div className="disabled-wrapper">
      <DemoHome />
    </div>
  </TourProvider>
  )
}

<AppDemo />
```

### Autoplay

This demo change step every 3 seconds

```jsx
import { useEffect } from 'react'
import { useTour } from '@reactour/tour'
import {
  doSteps,
  BeachIcon,
  BoatIcon,
  BallIcon,
  GuideIcon,
  IcecreamIcon,
} from '../utils'

const demoId = 'autoplay'
const steps = doSteps(demoId)

function Placeholder({ demoId = 'basic', children, className, style }) {
  const { steps, setIsOpen, isOpen, currentStep, setCurrentStep } = useTour()

  useEffect(() => {
    const delay = 3000
    let timer
    if (isOpen) {
      timer = setTimeout(
        () => setCurrentStep(s => (s === steps.length - 1 ? 0 : s + 1)),
        delay
      )
    }
    return () => {
      clearTimeout(timer)
    }
  }, [isOpen, currentStep])

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="open-button">
        Start Tour
      </button>
      {children}
      <div className={`${className} wrapper`} style={style}>
        <BeachIcon className="icon" data-tour={`step-1-${demoId}`} />
        <BoatIcon className="icon" data-tour={`step-4-${demoId}`} />
        <BallIcon className="icon" data-tour={`step-2-${demoId}`} />
        <GuideIcon className="icon" data-tour={`step-5-${demoId}`} />
        <IcecreamIcon className="icon" data-tour={`step-3-${demoId}`} />
      </div>
    </>
  )
}

const AppDemo = () => {
 return (
  <TourProvider steps={steps}>
    <Placeholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### Higher Order Component

This demo uses `withTour` HoC in case you are using Class Component

```jsx
import { Component } from 'react'
import { withTour } from '@reactour/tour'
import {
  doSteps,
  BeachIcon,
  BoatIcon,
  BallIcon,
  GuideIcon,
  IcecreamIcon,
} from '../utils'

const demoId = 'withTour'
const steps = doSteps(demoId)

class Placeholder extends Component {
  render() {
    const { demoId = 'basic', children, className, style } = this.props
    return (
      <>
        <button
          onClick={() => this.props.setIsOpen(true)}
          className="open-button"
        >
          Start Tour
        </button>
        <div className={`${className} wrapper`} style={style}>
          <BeachIcon className="icon" data-tour={`step-1-${demoId}`} />
          <BoatIcon className="icon" data-tour={`step-4-${demoId}`} />
          <BallIcon className="icon" data-tour={`step-2-${demoId}`} />
          <GuideIcon className="icon" data-tour={`step-5-${demoId}`} />
          <IcecreamIcon className="icon" data-tour={`step-3-${demoId}`} />
        </div>
      </>
    )
  }
}

const PlaceholderWithTour = withTour(Placeholder)

const AppDemo = () => {
 return (
  <TourProvider steps={steps}>
    <PlaceholderWithTour demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```

### Highlighted Selectors

```jsx
import { useState } from 'react'
import { useTour } from '@reactour/tour'
import {
  doSteps,
  BeachIcon,
  BoatIcon,
  BallIcon,
  GuideIcon,
  IcecreamIcon,
} from '../utils'

const demoId = 'highlighted-selectors'

function ExampleComp() {
  const [isOn, setIsOn] = useState(false)
  return (
    <>
      <button onClick={() => setIsOn(o => !o)}>
        Set {isOn ? 'off' : 'on'}
      </button>
      <br />
      <p>Lorem ipsum {isOn ? 'ON' : 'OFF'}</p>
    </>
  )
}

const steps = [
  {
    highlightedSelectors: [
      `[data-tour="step-1-${demoId}"]`,
      `[data-tour="step-2-${demoId}"]`,
    ],
    content: <p>Vamos a la playa!</p>,
  },
  {
    selector: `[data-tour="step-2-${demoId}"]`,
    content: <p>Play beach ball all day long!</p>,
  },
  {
    selector: `[data-tour="step-3-${demoId}"]`,
    content: <ExampleComp />,
  },
]

function Placeholder({ demoId = 'basic', children, className, style }) {
  const { steps, setIsOpen, isOpen, currentStep, setCurrentStep } = useTour()

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="open-button">
        Start Tour
      </button>
      {children}
      <div className={`${className} wrapper`} style={style}>
        <BeachIcon className="icon" data-tour={`step-1-${demoId}`} />
        <BoatIcon className="icon" data-tour={`step-4-${demoId}`} />
        <BallIcon className="icon" data-tour={`step-2-${demoId}`} />
        <GuideIcon className="icon" data-tour={`step-5-${demoId}`} />
        <IcecreamIcon className="icon" data-tour={`step-3-${demoId}`} />
      </div>
    </>
  )
}

const AppDemo = () => {
 return (
  <TourProvider steps={steps}>
    <Placeholder demoId={demoId} />
  </TourProvider>
  )
}

<AppDemo />
```
