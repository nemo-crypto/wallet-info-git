import { useState, useEffect } from "react";
import "./index.css";
import {
    getSupportedCurrencies,
    getExchangeRates,
    getWalletBalances,
} from "@/api";

import { type Currency, type WalletBalance } from "@/types";
import BigNumber from "bignumber.js";

// 定义组合后的代币数据结构
interface TokenInfo {
    currency: Currency;
    balance: number;
    usdtPrice: string;
}

function Wallet() {
    const [amount, setAmount] = useState(0);
    const [tokenList, setTokenList] = useState<TokenInfo[]>([]);
    const fetchData = async () => {
        const currenciesResponse = await getSupportedCurrencies();
        const exchangeRatesResponse = await getExchangeRates();
        const balancesResponse = await getWalletBalances();
        if (
            currenciesResponse.ok &&
            exchangeRatesResponse.ok &&
            balancesResponse.ok
        ) {
            const currencies = currenciesResponse.currencies;
            const exchangeRates = exchangeRatesResponse.tiers;
            const balances = balancesResponse.wallet;
            // 计算总金额
            let totalAmount = 0;

            // 组合数据，取三个数据源的交集
            const combinedTokens: TokenInfo[] = [];

            // 遍历余额列表
            balances.forEach((balance: WalletBalance) => {
                // 查找对应的货币信息
                const currency = currencies.find(
                    (c) => c.symbol === balance.currency
                );
                if (!currency) return; // 如果找不到对应的货币信息，跳过

                // 查找对应的汇率信息
                const exchangeRate = exchangeRates.find(
                    (rate) =>
                        rate.from_currency === balance.currency &&
                        rate.to_currency === "USD"
                );

                // 如果找到了对应的汇率信息，添加到组合列表中
                if (exchangeRate && exchangeRate.rates.length > 0) {
                    const usdtPrice = exchangeRate.rates[0].rate;

                    // 计算该币种的 USDT 价值并累加到总金额
                    const usdtValue = parseFloat(usdtPrice) * balance.amount;
                    totalAmount += usdtValue;

                    combinedTokens.push({
                        currency,
                        balance: balance.amount,
                        usdtPrice,
                    });
                }
            });

            // 更新状态
            setAmount(parseFloat(totalAmount.toFixed(2)));
            setTokenList(combinedTokens);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-4">
                <h1 className="text-xl font-bold text-[20px] ">
                    ${amount || "--"}USD
                </h1>
            </div>
            <div className="flex-1 p-4 bg-gray-100">
                <ul className="list-none">
                    {tokenList?.length > 0
                        ? tokenList.map((item: TokenInfo) => (
                              <li
                                  key={item.currency.symbol}
                                  className="flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm"
                              >
                                  <img
                                      loading="lazy" // 图片按需加载
                                      src={item.currency.colorful_image_url}
                                      alt={item.currency.symbol}
                                      className="w-10 h-10 mr-3"
                                  />
                                  <div className="flex-1 text-left">
                                      <div className="font-medium">
                                          {item.currency.symbol}
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <div className="font-medium">
                                          {new BigNumber(item.balance)
                                              .decimalPlaces(
                                                  8,
                                                  BigNumber.ROUND_HALF_UP
                                              )
                                              .toFixed()}
                                          {item.currency.symbol}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                          $
                                          {Number(item.usdtPrice) > 0 &&
                                          item.balance > 0
                                              ? new BigNumber(
                                                    Number(item.usdtPrice) *
                                                        item.balance
                                                )
                                                    .decimalPlaces(
                                                        8,
                                                        BigNumber.ROUND_HALF_UP
                                                    )
                                                    .toFixed()
                                              : "--"}
                                      </div>
                                  </div>
                              </li>
                          ))
                        : "loading"}
                </ul>
            </div>
        </div>
    );
}

export default Wallet;
