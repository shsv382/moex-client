import { getFormattedDate } from "./helpers/date";

export const IMOEX_URL = () => "https://iss.moex.com/iss/statistics/engines/stock/markets/index/analytics/IMOEX.json?iss.meta=off&limit=100";
                                
export const STOCK_URL = (ticker: string) => `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json`;
// export const STOCK_URL = (ticker: string) => `https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}.json`;
                                        //    https://iss.moex.com/iss/engines/stock/markets/shares/securities/AFLT.json
export const STOCK_CANDLES = (ticker: string, from: Date, till: Date, interval: number) => {
    return `http://iss.moex.com/iss/engines/stock/markets/shares/securities/{ticker}/candles.json?from=${getFormattedDate(from)}&till=${getFormattedDate(till)}&interval=${interval}`;
}