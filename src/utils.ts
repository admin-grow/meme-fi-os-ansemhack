/**
 * Utility functions for formatting strings and UI elements
 */

/**
 * Formats snake_case / SCREAMING_SNAKE_CASE status codes into clean,
 * readable human text without underscores.
 * 
 * Example:
 * "PENDING_HUMAN_REVIEW" -> "Pending Human Review"
 * "HUMAN_APPROVED" -> "Human Approved"
 * "TOKEN_LAUNCH" -> "Token Launch"
 */
export function formatStatusText(status?: string, format: 'title' | 'upper' = 'title'): string {
  if (!status || typeof status !== 'string') {
    return format === 'upper' ? 'PENDING HUMAN REVIEW' : 'Pending Human Review';
  }

  // Replace all underscores and hyphens with spaces
  const cleaned = status.replace(/[_-]+/g, ' ').trim();

  if (format === 'upper') {
    return cleaned.toUpperCase();
  }

  // Capitalize first letter of each word (Title Case)
  return cleaned
    .toLowerCase()
    .split(' ')
    .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ');
}

/**
 * Returns color styling classes based on approval status
 */
export function getStatusColorClasses(status?: string, isApproved?: boolean) {
  const normalized = (status || '').toUpperCase();
  if (isApproved || normalized.includes('APPROVED') || normalized.includes('CONFIRMED')) {
    return {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      icon: '✓',
    };
  }

  if (normalized.includes('PENDING') || normalized.includes('REVIEW')) {
    return {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      dot: 'bg-amber-400 animate-pulse',
      icon: '⏳',
    };
  }

  return {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400',
    icon: '⚡',
  };
}
