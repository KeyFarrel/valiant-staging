export default class DateFormat{
  formatDate(dateString: string) {
    const date = new Date(dateString);

    const datePart = `${date.getUTCDate()} ${date.toLocaleString('id-ID', { month: 'long' })} ${date.getUTCFullYear()}`;
  const timePart = `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;

  return `${datePart}<br>${timePart} WIB`;
  }
}