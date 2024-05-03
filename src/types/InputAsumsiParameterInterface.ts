export interface Error{
  asumsi: AsumsiError,
  parameter: ParameterError,
}

type AsumsiError = {
  interestRate: boolean,
  umurTeknis: boolean,
  loanTenor: boolean,
  loanPortion: boolean
}

type ParameterError = {
  nphr:boolean,
  auxiliary: boolean,
  susutTrafo: boolean,
  pemakaianSendiri: boolean,
  electricityA: boolean,
  electricityB: boolean,
  electricityC: boolean,
  electricityD: boolean,
  bahanBakar: boolean
}
