const styleSheet = (() => {
  var style = document.createElement("style");
  document.head.appendChild(style);
  return style.sheet;
})();

function tickerTape(nodes, config = {}) {
  const ID = Math.random().toString(36).substr(2, 5)
  const selector = 'ticker-' + ID

  const defaultOptions = {
    speed: 30,
    invert: false,
    alternate: true,
    pauseOnHover: false,
  }

  const options = {
    ...defaultOptions,
    ...config
  }

  makeTickerStyles()
  nodes.forEach(makeTicker)

  function makeTickerStyles() {
    const animationName = 'a-' + selector
    const animationNameReverse = animationName + '-reverse'

    const trasnformFrom = `{ transform: translate3d(${options.invert ? '-100%' : '0%'}, 0, 0 ); }`
    const transformTo = `{ transform: translate3d(${options.invert ? '0%' : '-100%'}, 0, 0 ); }`

    styleSheet.insertRule(`@keyframes ${animationName} {
      from ${trasnformFrom}
      to ${transformTo}
    }`)

    styleSheet.insertRule(`.${selector} {
      display: flex;
    }`)

    styleSheet.insertRule(`.${selector} > * {
      display: flex;
      animation-name: ${animationName};
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }`)

    if (options.alternate) {
      styleSheet.insertRule(`@keyframes ${animationNameReverse} {
        from ${transformTo}
        to ${trasnformFrom}
      }`)

      styleSheet.insertRule(`.${selector}:nth-of-type(even) > * {
        animation-name: ${animationNameReverse};
      }`)
    }

    if (options.pauseOnHover) {
      styleSheet.insertRule(`.${selector}:hover > * {
        animation-play-state: paused;
      }`)
    }
  }

  function makeTicker(ticker) {
    let cachedWidth = 0
    ticker.className += ' ' + selector

    // Query the first node. This is what we'll clone.
    const tickerList = ticker.querySelector(':first-child')

    // Get the scrollWidth of the node to calculate how many elements to create.
    const { scrollWidth: width } = tickerList

    // This function gets called on resize.
    function makeTickerItems() {
      const { innerWidth: browserWidth } = window

      if (cachedWidth !== browserWidth) {
        const tickerItems = Math.ceil(browserWidth / width)
        const calculatedSpeed = Math.ceil((browserWidth + width) / tickerItems) * options.speed

        ticker.innerHTML = ''

        for (let i = 0; i <= tickerItems; i += 1) {
          const tickerListClone = tickerList.cloneNode(true)
          tickerListClone.style.animationDuration = calculatedSpeed + 'ms'
          ticker.append(tickerListClone)
        }

        cachedWidth = browserWidth
      }
    }

    window.addEventListener('resize', makeTickerItems)
    makeTickerItems()
  }
}

function waveText(nodes, speed = 60) {

  styleSheet.insertRule(`.hola span {
    animation-play-state: running;
  }`)

  styleSheet.insertRule(`@keyframes wave-text {
    0% {
      transform: translateY(0%);
    } 25% {
      transform: translateY(-25%);
    } 50% {
      transform: translateY(0%);
    } 75% {
      transform: translateY(-25%);
    } 100% {
      transform: translateY(0%);
    }
  }`)

  styleSheet.insertRule(`a {
    white-space: nowrap;
  }`)

  styleSheet.insertRule(`a span {
    display: inline-block;
    white-space: pre-wrap;
    transform-origin: 50%;
    transform: translateY(0%);
    animation: wave-text ${speed * (speed / 2)}ms ease-in-out infinite;
    animation-play-state: paused;
  }`)

  styleSheet.insertRule(`@media (hover: hover) { a:hover span {
    animation-play-state: running;
  }}`)

  function splitSpan(node) {
    const textString = node.innerText
    const characters = textString.split('')
    let key = 0

    node.innerHTML = ''

    characters.forEach(char => {
      key += 1

      const animationDelay = `animation-delay: ${key * speed}ms`

      const span = document.createElement('span')
      span.innerText = char
      span.setAttribute('style', `${animationDelay};`)

      node.appendChild(span)
    })
  }

  nodes.forEach(splitSpan)
}

waveText(document.querySelectorAll('a'))
tickerTape(document.querySelectorAll('.ticker'))
