export function ErrorWithCode(msg = "", code = 500) {
  this.message = msg;
  this.code = code;
}
ErrorWithCode.prototype = new Error();
