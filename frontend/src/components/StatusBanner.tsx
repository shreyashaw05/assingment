type StatusBannerProps = {
  message: string
}

export function StatusBanner({ message }: StatusBannerProps) {
  if (!message.trim()) {
    return null
  }

  return <p className="status">{message}</p>
}