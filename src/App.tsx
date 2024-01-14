import React, { useState, useEffect } from 'react';
import BasicTable from './components/BasicTable/BasicTable';
import { Container } from './components/Container';
import styles from './App.module.scss';
import { IMOEX_URL, STOCK_URL } from './constants';
import { LocalStorage } from './helpers/localStorage';
import TextField from '@mui/material/TextField';

interface Stock {
  indexid: string,
  tradeDate: string,
  ticker: string,
  shortnames: string,
  secid: string,
  weight: number,
  tradingsession: number,
  marketPrice: number,
  countTarget: number
}

function App() {
    const [imoex, setImoex] = useState<Stock[]>([]);
    const [amount, setAmount] = useState<number>(100000);

    function createData(
        indexid: string,
        tradeDate: string,
        ticker: string,
        shortnames: string,
        secid: string,
        weight: number,
        tradingsession: number,
        marketPrice: number
    ) {
        return { 
        indexid,
        tradeDate,
        ticker,
        shortnames,
        secid,
        weight,
        tradingsession,
        marketPrice 
        };
    }

    useEffect(() => {
        const imoex_cached = LocalStorage.getTemporaryItem("imoex");
        async function fetchIMOEXData() {
            const response = await fetch(IMOEX_URL());
            const data = await response.json();
            const stockPromises = data.analytics.data.map(async (item: any[]) => {
                let response = await fetch(STOCK_URL(item[4]));
                let data = await response.json();
                let j=0;
                let marketPrice = 0;
                while (j < data.marketdata.data.length) {
                    if(data.marketdata.data[j][1] === 'TQBR') {
                        marketPrice = data.marketdata.data[j][36]
                    }
                    j++
                }
                return createData(
                    item[0], 
                    item[1], 
                    item[2], 
                    item[3], 
                    item[4], 
                    item[5], 
                    item[6],
                    marketPrice 
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
                    LocalStorage.setTemporaryItem("imoex", stocks, 1);
                })
        }
    }, [])

    return (
        <div className={styles.app}>
            <Container>
                <TextField id="capitalSize" label="Размер капитала" variant="standard" type="number" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} />
                <BasicTable data={
                    imoex.sort((s1, s2) => s2.weight - s1.weight).map(stock => {
                        stock.countTarget = Math.floor((amount / 100 * stock.weight) / stock.marketPrice)
                        return stock
                    })
                } />
            </Container>
        </div>
    );
}

export default App;
