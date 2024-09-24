export interface Stock<T> {
    indexid: string,
    tradeDate: string,
    ticker: string,
    shortnames: string,
    secid: string,
    weight: number,
    tradingsession: number,
    marketPrice: number,
    countTarget: number,
    lotsTarget: number,
    finalTarget: number,
    lotSize: number,
    includedToPortfolio?: T,
    note?: string
  }