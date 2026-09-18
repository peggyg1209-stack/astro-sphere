/**
 * Cursor-follow micro-glow.
 *
 * Writes the pointer position (relative to the hovered element) into --mx/--my
 * so `.cursor-glow::after` can paint a soft pine→lake bloom that tracks the
 * cursor. This is one of only three places the KV gradient is allowed to
 * surface, alongside border micro-glow and hover transitions.
 *
 * Skipped entirely for reduced-motion users and non-hover (touch) pointers.
 */
;(function () {
  const SELECTOR = ".cursor-glow"

  let frame = 0
  let pending = null

  function flush() {
    frame = 0
    if (!pending) return
    const { element, x, y } = pending
    element.style.setProperty("--mx", x + "px")
    element.style.setProperty("--my", y + "px")
    pending = null
  }

  function onPointerMove(event) {
    const target = event.target
    if (!(target instanceof Element)) return

    const element = target.closest(SELECTOR)
    if (!element) return

    const rect = element.getBoundingClientRect()
    pending = {
      element: element,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    if (!frame) frame = requestAnimationFrame(flush)
  }

  function initialize() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(hover: hover)").matches) return

    document.removeEventListener("pointermove", onPointerMove)
    document.addEventListener("pointermove", onPointerMove, { passive: true })
  }

  document.addEventListener("astro:after-swap", initialize)
  initialize()
})()
