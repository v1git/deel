export default class NotFoundException extends Error {
  constructor() {
    super('Not Found');
    this.name = 'NotFoundException';
    this.status = 404;
  }
}
