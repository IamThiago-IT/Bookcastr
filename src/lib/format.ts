export function convertDurationToTimeString(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const timeString = [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");

  // Remove leading 00: if no hours
  return hours === 0 ? timeString.slice(3) : timeString;
}

export function formatPublishedAt(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
