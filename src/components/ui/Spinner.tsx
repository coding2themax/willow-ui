interface Props {
  size?: number
}

export default function Spinner({ size = 18 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-label="Loading"
      style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block', verticalAlign: 'middle' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M16 9A7 7 0 0 0 9 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
