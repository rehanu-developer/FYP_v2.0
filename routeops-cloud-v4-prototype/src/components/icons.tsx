/**
 * Hand-rolled inline SVG icon set (Heroicons-style 24x24 outline geometry).
 * Kept local so the prototype has zero icon-library dependencies.
 * Every icon inherits `currentColor` and takes an optional size.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/* --- Navigation ---------------------------------------------------------- */

export const SquaresIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </Svg>
)

export const InboxArrowIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 13.5h4l1.2 2.2h7.6L17 13.5h4" />
    <path d="M4.5 13.5 6 5.2A1.6 1.6 0 0 1 7.6 4h8.8a1.6 1.6 0 0 1 1.6 1.2l1.5 8.3v4.1A1.4 1.4 0 0 1 18.1 19H5.9a1.4 1.4 0 0 1-1.4-1.4z" />
  </Svg>
)

export const CircleStackIcon = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
  </Svg>
)

export const RectangleStackIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="10" width="18" height="10" rx="2" />
    <path d="M5.5 7.5h13M7.5 4.5h9" />
  </Svg>
)

export const MapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z" />
    <path d="M9 4v14M15 6v14" />
  </Svg>
)

export const UserGroupIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
    <path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19.5a5.4 5.4 0 0 0-1.8-4" />
  </Svg>
)

export const CurrencyDollarIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v10M14.5 9.4A2.4 2.4 0 0 0 12.2 8h-.5a2.1 2.1 0 0 0-.4 4.2h1.4a2.1 2.1 0 0 1 .3 4.2h-.6a2.4 2.4 0 0 1-2.3-1.4" />
  </Svg>
)

export const BookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 6.5C10.5 5.2 8.4 4.5 6 4.5c-.9 0-1.8.1-2.5.3v13.4c.7-.2 1.6-.3 2.5-.3 2.4 0 4.5.7 6 2 1.5-1.3 3.6-2 6-2 .9 0 1.8.1 2.5.3V4.8c-.7-.2-1.6-.3-2.5-.3-2.4 0-4.5.7-6 2z" />
    <path d="M12 6.5v13.7" />
  </Svg>
)

export const PulseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h3.5l2-5 3 10 2.5-5H21" />
  </Svg>
)

export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4 16.5v2A2 2 0 0 0 6 20.5h12a2 2 0 0 0 2-2v-2" />
  </Svg>
)

export const CogIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2.8" />
    <path d="M12 3.5v2.2M12 18.3v2.2M4.9 7.8l1.9 1.1M17.2 15.1l1.9 1.1M4.9 16.2l1.9-1.1M17.2 8.9l1.9-1.1" />
  </Svg>
)

export const ShareIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.2 10.8 15.8 7.2M8.2 13.2l7.6 3.6" />
  </Svg>
)

export const TableIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="M3 9.5h18M9 9.5v10M15 9.5v10" />
  </Svg>
)

export const ClipboardCheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4.5H7.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-11a2 2 0 0 0-2-2H15" />
    <rect x="9" y="3" width="6" height="3.2" rx="1" />
    <path d="M9.5 13l1.8 1.8 3.5-3.8" />
  </Svg>
)

export const ScaleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v16M7 20h10" />
    <path d="M12 6.5 5 9l-2 5a3.6 3.6 0 0 0 4 0zM12 6.5 19 9l2 5a3.6 3.6 0 0 1-4 0z" />
  </Svg>
)

export const QuestionIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.8 9.4a2.3 2.3 0 0 1 4.4.8c0 1.5-2.2 1.8-2.2 3.3" />
    <path d="M12 17.1h.01" strokeWidth={2.2} />
  </Svg>
)

/* --- UI / actions -------------------------------------------------------- */

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="m15.5 15.5 4 4" />
  </Svg>
)

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </Svg>
)

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 6l-6 6 6 6" />
  </Svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Svg>
)

export const XIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </Svg>
)

export const CheckIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={2.2}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.3 2.4 2.4 4.6-5" />
  </Svg>
)

export const WarningIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.6 4.3 2.9 17.6A1.6 1.6 0 0 0 4.3 20h15.4a1.6 1.6 0 0 0 1.4-2.4L13.4 4.3a1.6 1.6 0 0 0-2.8 0z" />
    <path d="M12 9.5v4M12 16.5h.01" strokeWidth={2} />
  </Svg>
)

export const ErrorCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v4.5M12 15.8h.01" strokeWidth={2} />
  </Svg>
)

export const InfoCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8.2h.01" strokeWidth={2} />
  </Svg>
)

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4.8" y="10.5" width="14.4" height="9.5" rx="2" />
    <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
  </Svg>
)

export const UndoIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5h9.5a5 5 0 0 1 0 10H8" />
    <path d="M7.5 5.5 3.5 9.5l4 4" />
  </Svg>
)

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3.2 2" />
  </Svg>
)

export const BoltIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.2 3 5.5 13.5h5l-.7 7.5 7.7-10.5h-5z" />
  </Svg>
)

export const PlusIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
)

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 7h15M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
    <path d="M6.5 7l.8 12a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5L17.5 7" />
  </Svg>
)

export const SaveIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 4.5h9.8L19.5 8.7v10.8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1z" />
    <path d="M8.5 4.5v5h7v-5M8.5 20.3v-5.8h7v5.8" />
  </Svg>
)

export const CopyIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2" />
    <path d="M15.5 8.5v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2" />
  </Svg>
)

export const FlagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 20.5V4.2M5.5 5.2c4.3-2 8.7 2 13 0v8.6c-4.3 2-8.7-2-13 0z" />
  </Svg>
)

export const LassoIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4.5c4.7 0 8.5 2.5 8.5 5.6 0 3.1-3.8 5.6-8.5 5.6-1.5 0-2.9-.2-4.1-.7" />
    <path d="M7.9 15c-2.1-1-3.4-2.6-3.4-4.9 0-3.1 3.8-5.6 8.5-5.6" />
    <path d="M7.4 15.3a1.9 1.9 0 1 0 1.6 2.9c.5.9.3 1.9-.7 2.3" />
  </Svg>
)

export const ColumnsIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="M9.2 4.5v15M14.8 4.5v15" />
  </Svg>
)

export const DensityIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </Svg>
)

export const SortIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.5 4.5v15M4 8l3.5-3.5L11 8" />
    <path d="M16.5 19.5v-15M13 16l3.5 3.5L20 16" />
  </Svg>
)

export const FileIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 3.5H7a1.8 1.8 0 0 0-1.8 1.8v13.4A1.8 1.8 0 0 0 7 20.5h10a1.8 1.8 0 0 0 1.8-1.8V8.8z" />
    <path d="M13.5 3.5v5.3h5.3" />
  </Svg>
)

export const UploadCloudIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 16.5a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6.9A3.6 3.6 0 0 1 17.5 16.5" />
    <path d="M12 20.5v-8M9 15l3-3 3 3" />
  </Svg>
)

export const EyeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </Svg>
)

export const PencilIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16.5 4.6l2.9 2.9M4.5 16.6 15.4 5.7a1.6 1.6 0 0 1 2.3 0l.6.6a1.6 1.6 0 0 1 0 2.3L7.4 19.5l-3.9.9z" />
  </Svg>
)

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 4.5H19.5v6M19.5 4.5 11 13" />
    <path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
  </Svg>
)

export const MinusCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.2 12h7.6" />
  </Svg>
)

export const TargetIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" strokeWidth={2} />
  </Svg>
)

export const RouteIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="6.5" r="2.5" />
    <circle cx="18" cy="17.5" r="2.5" />
    <path d="M6 9v4.5a4 4 0 0 0 4 4h5.5" />
  </Svg>
)

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
  </Svg>
)
