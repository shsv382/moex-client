import React, { useState, useEffect } from 'react';
import { ImoexTable } from '../../components/ImoexTable/ImoexTable';
import { Container } from '../../components/Container';
import styles from './Index.module.scss';
import { IMOEX_URL, STOCK_URL } from '../../constants';
import { LocalStorage as LS } from '../../helpers/localStorage';
import TextField from '@mui/material/TextField';
import { Stock } from './Index.types';

interface PortfolioStocks {
    [ticker: string]: number,
    total: number
}

function Index() {
    const [imoex, setImoex] = useState<Stock<null>[]>([]);
    const [myMoex, setMyMoex] = useState<Stock<boolean>[]>([]);
    const [amount, setAmount] = useState<number>(LS.getItem("amount") || 250000);
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
        const amount_cached = LS.getItem("amount")
        if (amount_cached) {
            setAmount(amount_cached)
        }
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
                .catch(error => {
                    setImoex(LS.getItem("imoex"));
                    console.log(error.toString())
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

    const makeNote = (ticker: string, text: string): void => {
        setMyMoex(myMoex.map(stock => stock.ticker === ticker ? {...stock, note: text} : stock))
    }

    const setCapitalAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        LS.setItem("amount", Number(e.target.value))
        setAmount(Number(e.target.value))
    }

    return (
        <div className={styles.app}>
            <Container>
                <div className={styles.service}>
                    <TextField id="capitalSize" label="Размер капитала" variant="standard" type="number" onChange={setCapitalAmount} defaultValue={amount} />
                    <div>Total portfolio: {Math.round(portfolio.total * 100)/100} %</div>
                    <div>Total index: {
                        Math.round(imoex.reduce((total, item) => total + item.weight, 0) * 100)/100
                    } %</div>
                </div>
                <ImoexTable data={
                    myMoex.sort((a, b) => {
                            if (a.ticker < b.ticker) {
                                return -1;
                            }
                            if (a.ticker > b.ticker) {
                                return 1;
                            }
                            return 0;
                    })
                    .map(stock => {
                        stock.countTarget = portfolio[stock.ticker] ? Math.floor((amount / portfolio.total * stock.weight) / stock.marketPrice) : 0;
                        stock.lotsTarget = Math.floor(stock.countTarget / stock.lotSize)
                        stock.finalTarget = stock.lotsTarget * stock.lotSize
                        return stock
                    })
                } removeFromPortfolio={removeFromPortfolio} 
                addToPortfolio={addToPortfolio}
                makeNote={makeNote} />
            </Container>
        </div>
    );
}

export default Index;
