import "./Badge.css";
import { ReactNode, CSSProperties } from "react";

export interface BadgePropType {
  children?: ReactNode;
  content?: ReactNode;
  popup_content?: ReactNode;
  style?: CSSProperties;
  popup_style?: CSSProperties;
  className?: string;
  popup_className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  isActive?: boolean;
}

export default function Badge({
  children,
  content,
  popup_content,
  style,
  popup_style,
  className,
  popup_className,
  isActive = true,
  onClick,
}: BadgePropType) {
  return (
    <div
      className={`badge ${className} ${!isActive ? "badge-inactive" : ""}`}
      style={style}
      onClick={onClick}
    >
      {children ? children : content}
      {popup_content && (
        <div className={`badge_popup ${popup_className}`} style={popup_style}>
          {popup_content}
        </div>
      )}
    </div>
  );
}
