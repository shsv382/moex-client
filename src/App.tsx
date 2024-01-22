import React, { useState, useEffect } from 'react';
import { ImoexTable } from './components/ImoexTable/ImoexTable';
import { Container } from './components/Container';
import styles from './App.module.scss';
import { IMOEX_URL, STOCK_URL } from './constants';
import { LocalStorage as LS } from './helpers/localStorage';
import TextField from '@mui/material/TextField';

interface Stock<T> {
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
  includedToPortfolio?: T
}

interface PortfolioStocks {
    [ticker: string]: number,
    total: number
}

function App() {
    const [imoex, setImoex] = useState<Stock<null>[]>([]);
    const [myMoex, setMyMoex] = useState<Stock<boolean>[]>([]);
    const [amount, setAmount] = useState<number>(250000);
    const [portfolio, setPortfolio] = useState<PortfolioStocks>({total: 0});

    function createData(
        indexid: string,
        tradeDate: string,
        ticker: string,
        shortnames: string,
        secid: string,
        weight: number,
        tradingsession: number,
        marketPrice: number,
        lotSize: number
    ) {
        return { 
        indexid,
        tradeDate,
        ticker,
        shortnames,
        secid,
        weight,
        tradingsession,
        marketPrice,
        lotSize 
        };
    }

    useEffect(() => {
        const imoex_cached = LS.getTemporaryItem("imoex");
        async function fetchIMOEXData() {
            const response = await fetch(IMOEX_URL());
            const data = await response.json();
            const stockPromises = data.analytics.data.map(async (item: any[]) => {
                let response = await fetch(STOCK_URL(item[4]));
                let data = await response.json();
                return createData(
                    item[0], 
                    item[1], 
                    item[2], 
                    item[3], 
                    item[4], 
                    item[5], 
                    item[6],
                    data.marketdata.data[0][24],
                    data.securities.data[0][4]
                )
            });
            const stocks = await Promise.all(stockPromises);
            return stocks;
        }
        
        if (imoex_cached) {
            setImoex(imoex_cached);
        } else {
            fetchIMOEXData()
                .then(stocks => {
                    setImoex(stocks) 
                    LS.setTemporaryItem("imoex", stocks, 1);
                })
        }
    }, [])

    useEffect(() => {
        let portfolio = LS.getItem("portfolio") || {total: 0};
        let myMoex: Stock<boolean>[] = [];
        if (!portfolio || Object.keys(portfolio).length <= 1) {
            imoex.forEach(stock => {
                portfolio[stock.ticker] = stock.weight;
                portfolio.total += stock.weight;
                myMoex.push({...stock, includedToPortfolio: true});
            })
        } else {
            imoex.forEach(stock => {
                if (portfolio[stock.ticker]) {
                    myMoex.push({...stock, includedToPortfolio: true});
                } else {
                    myMoex.push({...stock, includedToPortfolio: false});
                }
            })
        }
        setPortfolio(portfolio);
        LS.setItem("portfolio", portfolio)
        setMyMoex(myMoex);
    }, [imoex])

    const addToPortfolio = (ticker: string): void => {
        const _portfolio = { ...portfolio };
        const elem = imoex.find(item => item.ticker === ticker);
        if (elem) {
            _portfolio[ticker] = elem.weight;
            _portfolio.total += elem.weight;
        }
        setPortfolio(_portfolio);
        LS.setItem("portfolio", _portfolio)
        setMyMoex(myMoex.map(stock => stock.ticker === ticker ? {...stock, includedToPortfolio: true} : stock))
    }

    const removeFromPortfolio = (ticker: string): void => {
        const _portfolio = { ...portfolio };
        _portfolio.total -= _portfolio[ticker];
        delete _portfolio[ticker];
        setPortfolio(_portfolio);
        LS.setItem("portfolio", _portfolio)
        setMyMoex(myMoex.map(stock => stock.ticker === ticker ? {...stock, includedToPortfolio: false} : stock))
    }

    const setCapitalAmount = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))

    return (
        <div className={styles.app}>
            <Container>
                <TextField id="capitalSize" label="Размер капитала" variant="standard" type="number" onChange={setCapitalAmount} defaultValue={amount} />
                <div>Total portfolio: {portfolio.total} %</div>
                <div>Total index: {
                imoex.reduce((total, item) => total + item.weight, 0)
                } %</div>
                <ImoexTable data={
                    myMoex.sort((s1, s2) => s2.weight - s1.weight).map(stock => {
                        stock.countTarget = Math.floor((amount / 100 * stock.weight) / stock.marketPrice)
                        stock.lotsTarget = Math.floor(stock.countTarget / stock.lotSize)
                        stock.finalTarget = stock.lotsTarget * stock.lotSize
                        return stock
                    })
                } removeFromPortfolio={removeFromPortfolio} 
                addToPortfolio={addToPortfolio} />
            </Container>
        </div>
    );
}

export default App;
