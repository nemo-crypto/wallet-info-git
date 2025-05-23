// 定义支持的货币列表接口
export interface CurrencyResponse {
    currencies: Currency[];
    total: number;
    ok: boolean;
}

export interface Currency {
    coin_id: string;
    name: string;
    symbol: string;
    token_decimal: number;
    contract_address: string;
    withdrawal_eta: string[];
    colorful_image_url: string;
    gray_image_url: string;
    has_deposit_address_tag: boolean;
    min_balance: number;
    blockchain_symbol: string;
    trading_symbol: string;
    code: string;
    explorer: string;
    is_erc20: boolean;
    gas_limit: number;
    token_decimal_value: string;
    display_decimal: number;
    supports_legacy_address: boolean;
    deposit_address_tag_name: string;
    deposit_address_tag_type: string;
    num_confirmation_required: number;
}

// 定义汇率接口
export interface ExchangeRateResponse {
    ok: boolean;
    warning: string;
    tiers: ExchangeRate[];
}

export interface ExchangeRate {
    from_currency: string;
    to_currency: string;
    rates: {
        amount: string;
        rate: string;
    }[];
    time_stamp: number;
}

// 定义钱包余额接口
export interface WalletResponse {
    ok: boolean;
    warning: string;
    wallet: WalletBalance[];
}

export interface WalletBalance {
    currency: string;
    amount: number;
}