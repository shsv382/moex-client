export interface ImoexTableProps {
    data: any[],
    methods?: any,
    removeFromPortfolio: (ticker: string) => void,
    addToPortfolio: (ticker: string) => void,
};
