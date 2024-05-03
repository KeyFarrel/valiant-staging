export default class GlobalFormat {
  formatEnergy(amount: any): string {
    const formattedAmount = Number(amount).toFixed(2);
    return formattedAmount.replace(/\./g, ',');
  }
  formatPercent(amount: any): string {
    const formattedAmount = Number(amount).toFixed(2);
    return formattedAmount.replace(',', '.');
  }
  formatCurrency(amount: any): string {
    const formattedAmount = Number(amount).toFixed(2);
    const parts = formattedAmount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  }
  formatCurrencyNotFixed(amount: any): string {
    const splitComma = amount.toString().split('.');
    if (splitComma.length > 1) {
      const formattedAmount = Number(amount).toLocaleString('id-ID', { minimumFractionDigits: splitComma[1].length });
      return formattedAmount;
    } else {
      const formattedAmount = Number(amount).toLocaleString('id-ID', { minimumFractionDigits: 2 });
      return formattedAmount;
    }
  }
  formatRupiah(amount: any): string {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    });
      const formattedAmount = formatter.format(amount);
      return formattedAmount.replace('Rp', '');
  }
  formatInputDecimalRupiah (inputValue: any) {  
    const commaIndex = inputValue.indexOf(',');
    const dotIndex = inputValue.indexOf('.');
    let inputValues;
    console.log(commaIndex);
    console.log('dot', dotIndex);
    if(commaIndex < dotIndex){
      console.log('masuk ke sini')
      const filteredValue = inputValue.replace(/[^\d.]/g, '');
      inputValues = filteredValue.replace(/\./g, ',');
    } else {
      console.log('luar')
      inputValues = inputValue.replace(/[^\d,]/g, '');
    }
    const commaCount = (inputValues.match(/,/g) || []).length;
    if (commaCount > 1) {
      const commaSplit = inputValues.split(',');
      commaSplit.pop();
      inputValues = commaSplit.join(',');
    }
    const commaSplit = inputValues.split(',');
    commaSplit[0] = commaSplit[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    console.log(commaSplit)
    inputValues = commaSplit.join(',');
    return inputValues;
  };
  formatInputDecimal (inputValue: any) {
    let inputValues = inputValue.replace(/[^\d]/g, '');
    if (inputValues.length > 2) {
      const integerPart = inputValues.slice(0, -2);
      const decimalPart = inputValues.slice(-2);
      inputValues = integerPart + ',' + decimalPart;
    } else if (inputValues.length == 2){
      const integerPart = inputValues.slice(0, -1);
      const decimalPart = inputValues.slice(-1);
      inputValues = integerPart + ',' + decimalPart;
    }
    return inputValues;
  };
  formatInputNumberOnly (inputValue: any) {
    let inputValues = inputValue.replace(/[^\d]/g, '');
    return inputValues;
  };

  formatNumberFiveDigits(numberToFormat: number){
    let numString = String(numberToFormat);
    let numZerosToAdd = 5 - numString.length;
    for (let i = 0; i < numZerosToAdd; i++) {
        numString = '0' + numString;
    }
    return numString;
  }
}