interface EtherscanResponse {
  status: string;
  message: string;
  result: any;
}

interface EthPrice {
  ethusd: string;
  ethusd_timestamp: string;
  ethbtc: string;
  ethbtc_timestamp: string;
}

interface GasOracle {
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
}

interface LatestBlock {
  blockNumber: string;
  timeStamp: string;
  blockMiner: string;
  blockReward: string;
  uncles: any[];
  uncleInclusionReward: string;
}

class EtherscanService {
  private apiKey: string;
  private baseUrl = 'https://api.etherscan.io/api';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds

  constructor() {
    this.apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY || 'V32JEMS9TQWJ8IQXRRHVXCJXGVNR85NT32';
  }

  private getCacheKey(method: string, params: Record<string, any> = {}): string {
    return `${method}_${JSON.stringify(params)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async makeRequest(params: Record<string, any>): Promise<any> {
    const cacheKey = this.getCacheKey(params.action, params);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('Using cached data for:', params.action);
      return cached;
    }

    const url = new URL(this.baseUrl);
    url.searchParams.append('apikey', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    try {
      console.log('Making Etherscan API request:', params.action, 'with key:', this.apiKey.substring(0, 10) + '...');
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: EtherscanResponse = await response.json();
      console.log('Etherscan response:', data);
      
      if (data.status === '0' && data.message !== 'No transactions found') {
        console.error('Etherscan API error details:', data);
        throw new Error(`Etherscan API error: ${data.message}`);
      }

      this.setCache(cacheKey, data.result);
      return data.result;
    } catch (error) {
      console.error('Etherscan API error:', error);
      const cachedFallback = this.cache.get(cacheKey);
      if (cachedFallback) {
        console.log('Using stale cached data as fallback');
        return cachedFallback.data;
      }
      throw error;
    }
  }

  // Get current ETH price
  async getEthPrice(): Promise<EthPrice> {
    return this.makeRequest({
      module: 'stats',
      action: 'ethprice'
    });
  }

  // Get gas oracle data
  async getGasOracle(): Promise<GasOracle> {
    return this.makeRequest({
      module: 'gastracker',
      action: 'gasoracle'
    });
  }

  // Get latest block number
  async getLatestBlockNumber(): Promise<string> {
    return this.makeRequest({
      module: 'proxy',
      action: 'eth_blockNumber'
    });
  }

  // Get block by number
  async getBlockByNumber(blockNumber: string): Promise<any> {
    return this.makeRequest({
      module: 'proxy',
      action: 'eth_getBlockByNumber',
      tag: blockNumber,
      boolean: 'true'
    });
  }

  // Get ETH supply
  async getEthSupply(): Promise<string> {
    return this.makeRequest({
      module: 'stats',
      action: 'ethsupply'
    });
  }

  // Get ETH2 supply (staked ETH)
  async getEth2Supply(): Promise<string> {
    return this.makeRequest({
      module: 'stats',
      action: 'eth2supply'
    });
  }

  // Get account balance
  async getAccountBalance(address: string): Promise<string> {
    return this.makeRequest({
      module: 'account',
      action: 'balance',
      address: address,
      tag: 'latest'
    });
  }

  // Get account transactions
  async getAccountTransactions(
    address: string, 
    startblock: number = 0, 
    endblock: number = 99999999,
    sort: 'asc' | 'desc' = 'desc',
    page: number = 1,
    offset: number = 10
  ): Promise<any[]> {
    return this.makeRequest({
      module: 'account',
      action: 'txlist',
      address: address,
      startblock: startblock,
      endblock: endblock,
      page: page,
      offset: offset,
      sort: sort
    });
  }

  // Get internal transactions
  async getInternalTransactions(
    address: string,
    startblock: number = 0,
    endblock: number = 99999999,
    sort: 'asc' | 'desc' = 'desc',
    page: number = 1,
    offset: number = 10
  ): Promise<any[]> {
    return this.makeRequest({
      module: 'account',
      action: 'txlistinternal',
      address: address,
      startblock: startblock,
      endblock: endblock,
      page: page,
      offset: offset,
      sort: sort
    });
  }

  // Get ERC20 token transfers
  async getTokenTransfers(
    address: string,
    contractaddress?: string,
    startblock: number = 0,
    endblock: number = 99999999,
    sort: 'asc' | 'desc' = 'desc',
    page: number = 1,
    offset: number = 10
  ): Promise<any[]> {
    const params: any = {
      module: 'account',
      action: 'tokentx',
      address: address,
      startblock: startblock,
      endblock: endblock,
      page: page,
      offset: offset,
      sort: sort
    };

    if (contractaddress) {
      params.contractaddress = contractaddress;
    }

    return this.makeRequest(params);
  }

  // Get transaction by hash
  async getTransactionByHash(txhash: string): Promise<any> {
    return this.makeRequest({
      module: 'proxy',
      action: 'eth_getTransactionByHash',
      txhash: txhash
    });
  }

  // Get transaction receipt
  async getTransactionReceipt(txhash: string): Promise<any> {
    return this.makeRequest({
      module: 'proxy',
      action: 'eth_getTransactionReceipt',
      txhash: txhash
    });
  }

  // Get network stats
  async getNetworkStats(): Promise<{
    ethPrice: EthPrice;
    gasOracle: GasOracle;
    ethSupply: string;
    eth2Supply: string;
  }> {
    try {
      const [ethPrice, gasOracle, ethSupply, eth2Supply] = await Promise.all([
        this.getEthPrice(),
        this.getGasOracle(),
        this.getEthSupply(),
        this.getEth2Supply()
      ]);

      return {
        ethPrice,
        gasOracle,
        ethSupply,
        eth2Supply
      };
    } catch (error) {
      console.error('Error fetching network stats:', error);
      throw error;
    }
  }

  // Format ETH amount from wei
  formatEthAmount(weiAmount: string | number): string {
    const wei = typeof weiAmount === 'string' ? BigInt(weiAmount) : BigInt(weiAmount);
    const eth = Number(wei) / 1e18;
    return eth.toFixed(6);
  }

  // Format USD value
  formatUsdValue(ethAmount: number, ethPrice: number): string {
    const usdValue = ethAmount * ethPrice;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(usdValue);
  }

  // Get comprehensive account data
  async getAccountData(address: string): Promise<{
    balance: string;
    balanceEth: number;
    balanceUsd: string;
    transactions: any[];
    internalTransactions: any[];
    tokenTransfers: any[];
    ethPrice: number;
  }> {
    try {
      const [balance, transactions, internalTxs, tokenTxs, priceData] = await Promise.all([
        this.getAccountBalance(address),
        this.getAccountTransactions(address, 0, 99999999, 'desc', 1, 10),
        this.getInternalTransactions(address, 0, 99999999, 'desc', 1, 10),
        this.getTokenTransfers(address, undefined, 0, 99999999, 'desc', 1, 10),
        this.getEthPrice()
      ]);

      const balanceEth = Number(this.formatEthAmount(balance));
      const ethPrice = parseFloat(priceData.ethusd);
      const balanceUsd = this.formatUsdValue(balanceEth, ethPrice);

      return {
        balance,
        balanceEth,
        balanceUsd,
        transactions,
        internalTransactions: internalTxs,
        tokenTransfers: tokenTxs,
        ethPrice
      };
    } catch (error) {
      console.error('Error fetching account data:', error);
      throw error;
    }
  }
}

export default new EtherscanService();
