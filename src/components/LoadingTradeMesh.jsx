import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  display: ${({ loading }) => (loading ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  position: relative;
  padding: 4px 16px;
  border-radius: 12px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
  min-width: 200px;
  min-height: 80px;
  
  @media (min-width: 640px) {
    margin: 0;
    min-width: auto;
    min-height: auto;
  }
`;

const TradeMeshText = styled.span`
  font-family: "Montserrat", "Arial", sans-serif;
  font-weight: 900;
  font-size: 2rem;
  letter-spacing: 1px;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  
  @media (min-width: 640px) {
    font-size: 3.5rem;
    letter-spacing: 2px;
  }
`;

const BorderSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export default function TradeMeshLoader({ loading }) {
  const boxRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [dashOffset, setDashOffset] = useState(0);

  useEffect(() => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setDims({ w: rect.width, h: rect.height });
    }
  }, [loading]);

  const { w, h } = dims;
  const r = 12;

  // Path definition
  const path = `
    M ${r} 0
    H ${w - r}
    A ${r} ${r} 0 0 1 ${w} ${r}
    V ${h - r}
    A ${r} ${r} 0 0 1 ${w - r} ${h}
    H ${r}
    A ${r} ${r} 0 0 1 0 ${h - r}
    V ${r}
    A ${r} ${r} 0 0 1 ${r} 0 Z
  `;

  const circumference = 2 * (w + h - 4 * r) + 2 * Math.PI * r;
  const dashLength = 60;
  const duration = 3; // seconds for full rotation

  // Animate dashOffset for synchronized, opposite positions
  useEffect(() => {
    if (!w || !h) return;
    let animFrame;
    let start = performance.now();
    const loop = (now) => {
      const elapsed = (now - start) / 1000; // seconds
      const progress = (elapsed % duration) / duration;
      setDashOffset(-progress * circumference);
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
    // eslint-disable-next-line
  }, [circumference, w, h]);

  // Prevent body scroll when loading is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);

  if (!w || !h) {
    return (
      <Overlay loading={loading}>
        <ModalContainer ref={boxRef}>
          <TradeMeshText>TradeMesh</TradeMeshText>
        </ModalContainer>
      </Overlay>
    );
  }

  return (
    <Overlay loading={loading}>
      <ModalContainer ref={boxRef}>
        <TradeMeshText>
          Trade<span style={{ color: "#17b9bd" }}>Mesh</span>
        </TradeMeshText>
        <BorderSvg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
          {/* White falling star (solid) */}
          <path
            d={path}
            stroke="#fff"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: `${dashLength} ${circumference - dashLength}`,
              strokeDashoffset: dashOffset,
              filter: "drop-shadow(0 0 12px #FFF)"
            }}
          />
          {/* Teal (blue) falling star (solid), always opposite */}
          <path
            d={path}
            stroke="#17b9bd"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: `${dashLength} ${circumference - dashLength}`,
              strokeDashoffset: dashOffset - circumference / 2,
              filter: "drop-shadow(0 0 12px #17b9bd)"
            }}
          />
        </BorderSvg>
      </ModalContainer>
    </Overlay>
  );
}
