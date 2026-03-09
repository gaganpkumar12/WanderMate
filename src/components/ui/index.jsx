import clsx from "clsx";
import "../../styles/components.css";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <button
      className={clsx("btn", `btn-${variant}`, `btn-${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className, ...props }) {
  return (
    <div className={clsx("card", className)} {...props}>
      {children}
    </div>
  );
}

export function Input({ className, ...props }) {
  return <input className={clsx("input", className)} {...props} />;
}

export function Badge({ children, variant = "default", className, ...props }) {
  return (
    <span className={clsx("badge", `badge-${variant}`, className)} {...props}>
      {children}
    </span>
  );
}

export function Avatar({
  src,
  alt = "User",
  size = "md",
  className,
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx("avatar", `avatar-${size}`, className)}
      {...props}
    />
  );
}
