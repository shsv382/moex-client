import { Stock } from "../../pages/Index/Index.types";

export interface ImoexTableProps {
    data: Stock<boolean>[],
    methods?: any,
    removeFromPortfolio: (ticker: string) => void,
    addToPortfolio: (ticker: string) => void,
    makeNote: (ticker: string, text: string) => void,
};
