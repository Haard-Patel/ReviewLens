"use client";

import { useEffect, useState } from "react";

export default function LensCursor() {
  const [position, setPosition] = useState({
    x: -100,
    y: -100,
  });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let activeElement: HTMLElement | null = null;

    function getInteractiveElement(
      target: EventTarget | null,
    ) {
      if (!(target instanceof Element)) {
        return null;
      }

      const element = target.closest(
        "a, button, input, select, textarea, [role='button']",
      );

      return element instanceof HTMLElement
        ? element
        : null;
    }

    function handlePointerMove(event: PointerEvent) {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nextElement =
        getInteractiveElement(event.target);

      if (nextElement === activeElement) {
        return;
      }

      if (activeElement) {
        activeElement.classList.remove(
          "lens-hover-target",
        );
      }

      if (nextElement) {
        nextElement.classList.add(
          "lens-hover-target",
        );
      }

      activeElement = nextElement;

      setIsHovering(Boolean(nextElement));
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      if (activeElement) {
        activeElement.classList.remove(
          "lens-hover-target",
        );
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`lens-cursor ${
        isHovering
          ? "lens-cursor-active"
          : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="lens-cursor-dot" />

      <div className="lens-cursor-ring" />
    </div>
  );
}
