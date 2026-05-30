import { getScanClassification } from '../utils/scanClassification.js'

function ScanClassificationPill({ classification, className = '' }) {
  const item = getScanClassification(classification)

  return (
    <span className={`inline-flex rounded-full px-4 py-2 text-sm font-black ${item.softClass} ${className}`}>
      {item.label}
    </span>
  )
}

export default ScanClassificationPill
