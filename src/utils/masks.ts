//? Usage:
// <Controller control={control} name='creditCard'
//     rules={{required: 'Field is required',pattern: { value: /^\d{4}-\d{4}-\d{4}-\d{2,4}$/, message: 'Enter valid credit card' }}}
//     render={({ field, fieldState }) => (
//         <Textfield type='text' {...field}
//          onChange={(e) => field.onChange(creditCardMask(e.target.value))}
//          onKeyDown={(e) => {
//              const { key, target } = e;
//              const cursor = (target as HTMLInputElement).selectionStart as number;
//              if (key.toLowerCase() === 'backspace' && cursor && cursor % 5 === 0) {
//                  e.preventDefault();
//                   field.onChange(field.value.slice(0, cursor - 1));
//              }
//          }}
//          placeholder='XXXX-XXXX-XXXX-XXXX'
//        />
//     )}
// />
export const creditCardMask = (value: string) => {
    const maxLength = 19; //max credits card length is 19
    const result = value.replace(/[^0-9]/g, '').replace(/(\d{4})/g, '$1-');
    return result.slice(0, maxLength);
    // const valueNum = value.trim().replace(/[^0-9]/g, '');
    // const splitBy4 = valueNum.match(/.{1,4}/g) || [];
    // const result = splitBy4.join('-');
    // return result.slice(0, maxLength);
};

//? Usage:
// <Controller control={control} name='expireDate'
//     rules={{required: 'Field is required',pattern: {value: /^\d{2}\s\/\s\d{2}$/ ,message: 'Enter valid date'}}}
//     render={({ field, fieldState }) => (
//         <Textfield {...field}
//             onChange={(e) => field.onChange(creditCardExpireDateMask(e.target.value))}
//             onKeyDown={(e) => { //we must handle 'backspace' manually
//                 const { key,target } = e;
//                 const cursor = (target as HTMLInputElement).selectionStart;
//                 if (key.toLowerCase() === 'backspace' && cursor === 5) {
//                     e.preventDefault();
//                     field.onChange(field.value.slice(0, 2));
//                 }
//             }}
//             placeholder='MM / YY'
//         />
//     )}
// />
export const creditCardExpireDateMask = (value: string) => {
    //here we consider expiration date should be in MM / YY format
    const valueNum = value.trim().replace(/[^0-9]/g, ''); //remove extra white spaces and any non-numeric characters
    const month = Math.min(+valueNum.slice(0, 2), 12).toString().padStart(2, '0'); //1st,2nd characters are always month date so we cap it to 12 and prepend '0' if its singular character
    const year = valueNum.slice(2, 4); //3rd,4th characters are always year date
    if (!value.length) return ''; //empty value should be ''
    if (valueNum.length === 1 && (+valueNum === 0 || +valueNum === 1))
        return valueNum; //if we enter 0 or 1 we don't do anything and just return them
    else if (valueNum.length === 1 && +valueNum >= 2)
        return `${month} / `; //if we enter 2,3,...,9 we return month
    else {
        return `${month} / ${year}`;
    }
};
