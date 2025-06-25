export class WrongTaskStatusException extends Error {
  constructor() {
    super('Wrong Task Status Exceptions!');
    this.name = 'WrongTaskStatusException';
  }
}
