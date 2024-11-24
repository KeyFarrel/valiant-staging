import DOMPurify from 'dompurify';

export default class DateFormat {
  formatDate(dateString: string) {
    const date = new Date(dateString);

    const datePart = `${date.getUTCDate()} ${date.toLocaleString('id-ID', { month: 'long' })} ${date.getUTCFullYear()}`;
    const timePart = `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;

    // Sanitasi output untuk menghindari XSS
    const rawHtml = `${datePart}<br>${timePart} WIB`;
    return DOMPurify.sanitize(rawHtml);
  }
}