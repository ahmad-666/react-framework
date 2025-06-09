//* Regex ----------------------------------------
//* Regex ----------------------------------------
export const emailRegex = new RegExp(/.{1,}@.{1,}\..{1,}/);
export const minLength8Regex = new RegExp(/.{8,}/);
export const oneNumberRegex = new RegExp(/\d+/);
export const oneUpperCaseRegex = new RegExp(/[A-Z]+/);
export const oneLowerCaseRegex = new RegExp(/[a-z]+/);
export const creditCardRegex = new RegExp(/^\d{4}-\d{4}-\d{4}-\d{2,4}$/); //credit card can be between 14,16 characters ... e.g 1234-1234-1234-1234
export const creditCardExpirationDateRegex = new RegExp(/^\d{2}\s\/\s\d{2}$/); //credit card can be between 14,16 characters ... e.g 1234-1234-1234-1234
