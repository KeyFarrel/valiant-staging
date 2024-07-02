export default class GlobalFormat {
  formatEnergy(amount: any): string {
    const formattedAmount = Number(amount).toFixed(2);
    return formattedAmount.replace(/\./g, ',');
  }
  formatPercent(amount: any): string {
    const formattedAmount = Number(amount).toFixed(2);
    return formattedAmount.replace(',', '.');
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
  formatDecimal(amount: any): string {
    const formattedAmount = parseInt(amount).toLocaleString('id-ID')
    return formattedAmount;
  }
  formatRupiah(amount: any): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "0,00";
    }
    let amountStr = amount.toString().replace(/[^0-9.-]/g, '');
    let decimalPart = '';
  
    if (amountStr.includes('.')) {
      decimalPart = amountStr.split('.')[1];
    }
  
    let minimumFractionDigits, maximumFractionDigits;
  
    if (decimalPart.length >= 3) {
      minimumFractionDigits = 3;
      maximumFractionDigits = 3;
    } else {
      minimumFractionDigits = 2;
      maximumFractionDigits = 2;
    }
  
    let amountNum = parseFloat(amountStr);
    
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits
    });
  
    let formattedAmount = formatter.format(amountNum);
  
    formattedAmount = formattedAmount.replace('Rp', '').trim();
  
    if (minimumFractionDigits === 3) {
      const parts = formattedAmount.split(',');
      if (parts.length > 1 && parts[1].length > 3) {
        parts[1] = parts[1].substring(0, 3);
        formattedAmount = parts.join(',');
      }
    }
  
    return formattedAmount;
  }
  formatInputDecimalRupiah (inputValue: any) {  
    const commaIndex = inputValue.indexOf(',');
    const dotIndex = inputValue.indexOf('.');
    let inputValues;

    if (commaIndex < dotIndex && commaIndex !== -1) {
        const filteredValue = inputValue.replace(/[^\d.-]/g, '');
        inputValues = filteredValue.replace(/\./g, ',');
    } else {
        inputValues = inputValue.replace(/[^\d,-]/g, '');
    }

    const commaCount = (inputValues.match(/,/g) || []).length;
    if (commaCount > 1) {
        const commaSplit = inputValues.split(',');
        commaSplit.pop();
        inputValues = commaSplit.join(',');
    }

    const commaSplit = inputValues.split(',');
    commaSplit[0] = commaSplit[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

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