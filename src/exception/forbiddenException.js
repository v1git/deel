export default class ForbiddenException extends Error {
  constructor() {
    super('Forbidden');
    this.name = 'ForbiddenException';
    this.status = 403;
  }
}
