import React from "react";
import styles from "./trafficsign.module.scss";
import { clsx } from "clsx";

export type TrafficSignColor = "blue" | "red" | "yellow" | "white";

interface TrafficSignProps {
  children?: React.ReactNode;
  arrow?: boolean;
  noEdges?: boolean;
  color?: TrafficSignColor;
}

const getContainerClass = (
  arrow: boolean,
  noEdges: boolean,
  color: TrafficSignColor
): string => {
  const classList = [styles.container];

  if (arrow) classList.push(styles.arrow);
  if (noEdges) classList.push(styles.noEdges);

  return clsx([...classList, styles[color]]);
};

const TrafficSign = ({
  arrow = false,
  color = "blue",
  noEdges = false,
  children,
}: TrafficSignProps) => {
  return (
    <div className={getContainerClass(arrow, noEdges, color)}>
      <div className={styles.border}>{children}</div>
    </div>
  );
};

export default TrafficSign;
