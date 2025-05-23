import currenciesData from '@/mock/currencies.json';
import ratesData from '@/mock/rates.json';
import walletData from '@/mock/wallet.json';

// 环境变量控制是否使用模拟数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
import {
    type CurrencyResponse,
    type ExchangeRateResponse,
    type WalletResponse
} from '@/types';

function mockReturnValue<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 200);
    });
}
// 获取支持的货币列表
export const getSupportedCurrencies = async (): Promise<CurrencyResponse> => {
    if (USE_MOCK) {
        return mockReturnValue(currenciesData as CurrencyResponse)
    }
    try {
        const response = await fetch('/api/currencies');
        const data = await response.json() as CurrencyResponse;
        return data;
    } catch (error) {
        console.error('获取支持货币列表失败:', error);
        return {
            currencies: [],
            total: 0,
            ok: false
        };
    }
};

// 获取实时汇率
export const getExchangeRates = async (): Promise<ExchangeRateResponse> => {
    if (USE_MOCK) {
        return mockReturnValue(ratesData as ExchangeRateResponse)
    }
    try {
        const response = await fetch('/api/live-rates');
        const data = await response.json() as ExchangeRateResponse;
        return data;
    } catch (error) {
        console.error('获取汇率信息失败:', error);
        return {
            ok: false,
            warning: '获取汇率信息失败',
            tiers: []
        };;
    }
};

// 获取钱包余额
export const getWalletBalances = async (): Promise<WalletResponse> => {
    if (USE_MOCK) {
        return mockReturnValue(walletData as WalletResponse)
    }
    try {
        const response = await fetch('/api/wallet-balance');
        const data = await response.json() as WalletResponse;
        return data;
    } catch (error) {
        console.error('获取钱包余额失败:', error);
        return {
            ok: false,
            warning: '获取钱包余额失败',
            wallet: []
        };
    }
};