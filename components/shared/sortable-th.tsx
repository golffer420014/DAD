import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

export function SortableTh({
  label,
  align = 'left',
  active,
  direction,
  onClick,
  className,
}: {
  label: string
  align?: 'left' | 'right'
  active: boolean
  direction: 'asc' | 'desc'
  onClick: () => void
  className?: string
}) {
  const Icon = active ? (direction === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown
  return (
    <th className={className}>
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 font-medium hover:text-foreground ${active ? 'text-foreground' : ''} ${align === 'right' ? 'flex-row-reverse' : ''}`}
      >
        {label}
        <Icon className={`size-3.5 ${active ? '' : 'opacity-40'}`} />
      </button>
    </th>
  )
}
