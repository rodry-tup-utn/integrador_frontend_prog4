export const toDateString = (dateString: string) => {
  const time = new Date(dateString);
  const date = time.toLocaleDateString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
  const hour = time.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });
  return `${date} ${hour}`;
};
