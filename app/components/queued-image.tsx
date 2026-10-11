"use client";

import Image, { type ImageProps } from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { holdPageImage, whenHeroSlidesReady } from "./image-schedule";

export default function QueuedImage({ onLoad, onError, alt, ...props }: ImageProps) {
  const image = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);
  const release = useRef<(() => void) | null>(null);

  useLayoutEffect(() => whenHeroSlidesReady(() => setVisible(true)), []);
  useLayoutEffect(() => {
    if (!visible) return;
    const done = holdPageImage();
    release.current = () => done(true);
    if (image.current?.complete) done(true);
    return () => done(false);
  }, [visible]);

  if (!visible) return null;
  return (
    <Image
      ref={image}
      alt={alt}
      {...props}
      loading="eager"
      fetchPriority="low"
      onLoad={(event) => {
        release.current?.();
        onLoad?.(event);
      }}
      onError={(event) => {
        release.current?.();
        onError?.(event);
      }}
    />
  );
}
