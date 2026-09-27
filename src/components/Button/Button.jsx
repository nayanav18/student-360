/* ============================================================
   Button Component — Reusable styled button
   
   Variants: primary, secondary, ghost, danger
   Sizes: sm, md, lg
   ============================================================ */
import './Button.css';

function Button({
  children,
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size = 'md',           // 'sm' | 'md' | 'lg'
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon,                  // optional icon element (left side)
  iconRight,             // optional icon element (right side)
  fullWidth = false,
  loading = false,
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full' : '',
        loading ? 'btn-loading' : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        <>
          {icon && <span className="btn-icon-left">{icon}</span>}
          <span>{children}</span>
          {iconRight && <span className="btn-icon-right">{iconRight}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
