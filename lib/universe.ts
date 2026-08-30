import { SYMBOLS } from "./symbols";

// Every symbol that gets an indexable /quote page, with a display name so
// titles and descriptions read well even before (or without) live data.
// Yahoo Finance ticker conventions: ^ for indices, .T Tokyo, .KS/.KQ Korea,
// -USD crypto, =X FX, =F futures.

export type UniverseGroup = "index" | "us-stock" | "etf" | "jp-stock" | "kr-stock" | "crypto" | "fx" | "commodity";

export type UniverseEntry = { symbol: string; name: string; group: UniverseGroup };

const INDICES: [string, string][] = [
  ["^GSPC", "S&P 500"], ["^IXIC", "Nasdaq Composite"], ["^DJI", "Dow Jones Industrial Average"], ["^RUT", "Russell 2000"],
  ["^VIX", "CBOE Volatility Index"], ["^TNX", "US 10-Year Treasury Yield"], ["DX-Y.NYB", "US Dollar Index"],
  ["^N225", "Nikkei 225"], ["^KS11", "KOSPI"], ["^KQ11", "KOSDAQ"], ["^HSI", "Hang Seng"], ["000001.SS", "Shanghai Composite"],
  ["^TWII", "Taiwan Weighted"], ["^BSESN", "BSE Sensex"], ["^NSEI", "Nifty 50"], ["^AXJO", "S&P/ASX 200"],
  ["^FTSE", "FTSE 100"], ["^GDAXI", "DAX"], ["^FCHI", "CAC 40"], ["^STOXX50E", "Euro Stoxx 50"], ["^GSPTSE", "S&P/TSX Composite"],
  ["^BVSP", "Bovespa"],
];

const US: [string, string][] = [
  ["AAPL", "Apple"], ["MSFT", "Microsoft"], ["NVDA", "Nvidia"], ["GOOGL", "Alphabet"], ["GOOG", "Alphabet (Class C)"], ["AMZN", "Amazon"],
  ["META", "Meta Platforms"], ["TSLA", "Tesla"], ["AVGO", "Broadcom"], ["BRK-B", "Berkshire Hathaway"], ["LLY", "Eli Lilly"],
  ["JPM", "JPMorgan Chase"], ["V", "Visa"], ["UNH", "UnitedHealth"], ["XOM", "Exxon Mobil"], ["WMT", "Walmart"], ["MA", "Mastercard"],
  ["JNJ", "Johnson & Johnson"], ["PG", "Procter & Gamble"], ["HD", "Home Depot"], ["COST", "Costco"], ["ORCL", "Oracle"],
  ["ABBV", "AbbVie"], ["BAC", "Bank of America"], ["CRM", "Salesforce"], ["KO", "Coca-Cola"], ["NFLX", "Netflix"],
  ["AMD", "Advanced Micro Devices"], ["PEP", "PepsiCo"], ["TMO", "Thermo Fisher Scientific"], ["CSCO", "Cisco"], ["ADBE", "Adobe"],
  ["MCD", "McDonald's"], ["WFC", "Wells Fargo"], ["ABT", "Abbott Laboratories"], ["QCOM", "Qualcomm"], ["IBM", "IBM"],
  ["GE", "GE Aerospace"], ["CAT", "Caterpillar"], ["VZ", "Verizon"], ["DIS", "Walt Disney"], ["INTC", "Intel"],
  ["GS", "Goldman Sachs"], ["MS", "Morgan Stanley"], ["PFE", "Pfizer"], ["UBER", "Uber"], ["PLTR", "Palantir"],
  ["TXN", "Texas Instruments"], ["AMGN", "Amgen"], ["NKE", "Nike"], ["HON", "Honeywell"], ["SBUX", "Starbucks"], ["BA", "Boeing"],
  ["PYPL", "PayPal"], ["C", "Citigroup"], ["SHOP", "Shopify"], ["COIN", "Coinbase"], ["MSTR", "Strategy (MicroStrategy)"],
  ["HOOD", "Robinhood"], ["SNOW", "Snowflake"], ["ARM", "Arm Holdings"], ["SMCI", "Super Micro Computer"], ["MRK", "Merck"],
  ["CVX", "Chevron"], ["LIN", "Linde"], ["ACN", "Accenture"], ["NOW", "ServiceNow"], ["ISRG", "Intuitive Surgical"],
  ["INTU", "Intuit"], ["AXP", "American Express"], ["T", "AT&T"], ["BKNG", "Booking Holdings"], ["LOW", "Lowe's"],
  ["SPGI", "S&P Global"], ["RTX", "RTX"], ["DHR", "Danaher"], ["NEE", "NextEra Energy"], ["PM", "Philip Morris"],
  ["UNP", "Union Pacific"], ["BLK", "BlackRock"], ["SCHW", "Charles Schwab"], ["TJX", "TJX Companies"], ["LMT", "Lockheed Martin"],
  ["DE", "Deere"], ["ANET", "Arista Networks"], ["MU", "Micron Technology"], ["LRCX", "Lam Research"], ["KLAC", "KLA"],
  ["AMAT", "Applied Materials"], ["ADI", "Analog Devices"], ["PANW", "Palo Alto Networks"], ["CRWD", "CrowdStrike"],
  ["MRVL", "Marvell Technology"], ["VRTX", "Vertex Pharmaceuticals"], ["REGN", "Regeneron"], ["GILD", "Gilead Sciences"],
  ["BMY", "Bristol Myers Squibb"], ["CVS", "CVS Health"], ["MDT", "Medtronic"], ["SYK", "Stryker"], ["ELV", "Elevance Health"],
  ["CMCSA", "Comcast"], ["TMUS", "T-Mobile US"], ["ETN", "Eaton"], ["PGR", "Progressive"], ["CB", "Chubb"], ["ADP", "ADP"],
  ["MDLZ", "Mondelez"], ["CL", "Colgate-Palmolive"], ["MO", "Altria"], ["SO", "Southern Company"], ["DUK", "Duke Energy"],
  ["COP", "ConocoPhillips"], ["SLB", "Schlumberger"], ["EOG", "EOG Resources"], ["OXY", "Occidental Petroleum"], ["FDX", "FedEx"],
  ["UPS", "UPS"], ["GM", "General Motors"], ["F", "Ford"], ["RIVN", "Rivian"], ["LCID", "Lucid"], ["NIO", "NIO"],
  ["ABNB", "Airbnb"], ["DASH", "DoorDash"], ["SOFI", "SoFi"], ["AFRM", "Affirm"], ["RBLX", "Roblox"], ["U", "Unity Software"],
  ["SNAP", "Snap"], ["PINS", "Pinterest"], ["SPOT", "Spotify"], ["ZM", "Zoom"], ["TTD", "Trade Desk"], ["DDOG", "Datadog"],
  ["NET", "Cloudflare"], ["MDB", "MongoDB"], ["ZS", "Zscaler"], ["OKTA", "Okta"], ["TEAM", "Atlassian"], ["WDAY", "Workday"],
  ["ADSK", "Autodesk"], ["EA", "Electronic Arts"], ["TTWO", "Take-Two Interactive"], ["WBD", "Warner Bros. Discovery"],
  ["MRNA", "Moderna"], ["GME", "GameStop"], ["AMC", "AMC Entertainment"], ["BABA", "Alibaba"], ["PDD", "PDD Holdings"],
  ["JD", "JD.com"], ["TSM", "Taiwan Semiconductor"], ["ASML", "ASML"], ["NVO", "Novo Nordisk"], ["SAP", "SAP"], ["TM", "Toyota (ADR)"],
  ["SONY", "Sony (ADR)"], ["LULU", "Lululemon"], ["CMG", "Chipotle"], ["MAR", "Marriott"], ["HLT", "Hilton"], ["DAL", "Delta Air Lines"],
  ["UAL", "United Airlines"], ["AAL", "American Airlines"], ["LUV", "Southwest Airlines"], ["CCL", "Carnival"], ["RCL", "Royal Caribbean"],
  ["FCX", "Freeport-McMoRan"], ["NEM", "Newmont"], ["NUE", "Nucor"], ["WM", "Waste Management"], ["ZTS", "Zoetis"], ["BSX", "Boston Scientific"],
  ["HCA", "HCA Healthcare"], ["CI", "Cigna"], ["HUM", "Humana"], ["ORLY", "O'Reilly Automotive"], ["AZO", "AutoZone"], ["ROST", "Ross Stores"],
  ["DG", "Dollar General"], ["TGT", "Target"], ["KR", "Kroger"], ["EL", "Estée Lauder"], ["KHC", "Kraft Heinz"], ["GIS", "General Mills"],
  ["HSY", "Hershey"], ["STZ", "Constellation Brands"], ["KDP", "Keurig Dr Pepper"], ["MNST", "Monster Beverage"], ["CELH", "Celsius"],
  ["ON", "ON Semiconductor"], ["NXPI", "NXP Semiconductors"], ["MCHP", "Microchip Technology"], ["WDC", "Western Digital"],
  ["STX", "Seagate"], ["DELL", "Dell Technologies"], ["HPQ", "HP"], ["HPE", "Hewlett Packard Enterprise"], ["IONQ", "IonQ"],
  ["RGTI", "Rigetti Computing"], ["SOUN", "SoundHound AI"], ["APP", "AppLovin"], ["VST", "Vistra"], ["CEG", "Constellation Energy"],
  ["GEV", "GE Vernova"], ["OKLO", "Oklo"], ["RKLB", "Rocket Lab"], ["ACHR", "Archer Aviation"], ["JOBY", "Joby Aviation"],
  ["CRCL", "Circle Internet"], ["CVNA", "Carvana"], ["DKNG", "DraftKings"], ["CHWY", "Chewy"], ["ETSY", "Etsy"], ["EBAY", "eBay"],
];

const ETFS: [string, string][] = [
  ["SPY", "SPDR S&P 500 ETF"], ["QQQ", "Invesco QQQ"], ["VOO", "Vanguard S&P 500 ETF"], ["VTI", "Vanguard Total Stock Market ETF"],
  ["IWM", "iShares Russell 2000 ETF"], ["DIA", "SPDR Dow Jones ETF"], ["GLD", "SPDR Gold Shares"], ["SLV", "iShares Silver Trust"],
  ["TLT", "iShares 20+ Year Treasury ETF"], ["ARKK", "ARK Innovation ETF"], ["SOXX", "iShares Semiconductor ETF"],
  ["SMH", "VanEck Semiconductor ETF"], ["XLK", "Technology Select Sector SPDR"], ["XLF", "Financial Select Sector SPDR"],
  ["XLE", "Energy Select Sector SPDR"], ["TQQQ", "ProShares UltraPro QQQ"], ["SQQQ", "ProShares UltraPro Short QQQ"],
  ["SCHD", "Schwab US Dividend Equity ETF"], ["JEPI", "JPMorgan Equity Premium Income ETF"], ["VYM", "Vanguard High Dividend Yield ETF"],
  ["IBIT", "iShares Bitcoin Trust"], ["ETHA", "iShares Ethereum Trust"], ["VEA", "Vanguard FTSE Developed Markets ETF"],
  ["VWO", "Vanguard FTSE Emerging Markets ETF"], ["EWJ", "iShares MSCI Japan ETF"], ["EWY", "iShares MSCI South Korea ETF"],
];

const JP: [string, string][] = [
  ["7203.T", "Toyota Motor"], ["6758.T", "Sony Group"], ["9984.T", "SoftBank Group"], ["8306.T", "Mitsubishi UFJ Financial"],
  ["6861.T", "Keyence"], ["7974.T", "Nintendo"], ["6501.T", "Hitachi"], ["8035.T", "Tokyo Electron"], ["6098.T", "Recruit Holdings"],
  ["9433.T", "KDDI"], ["9432.T", "NTT"], ["8058.T", "Mitsubishi Corporation"], ["8001.T", "Itochu"], ["7267.T", "Honda Motor"],
  ["7011.T", "Mitsubishi Heavy Industries"], ["6902.T", "Denso"], ["4063.T", "Shin-Etsu Chemical"], ["6367.T", "Daikin Industries"],
  ["9983.T", "Fast Retailing (Uniqlo)"], ["8316.T", "Sumitomo Mitsui Financial"], ["6146.T", "Disco"], ["6857.T", "Advantest"],
  ["4502.T", "Takeda Pharmaceutical"], ["4568.T", "Daiichi Sankyo"], ["6954.T", "Fanuc"], ["6503.T", "Mitsubishi Electric"],
  ["6702.T", "Fujitsu"], ["6752.T", "Panasonic"], ["7751.T", "Canon"], ["6971.T", "Kyocera"], ["7741.T", "Hoya"],
  ["6981.T", "Murata Manufacturing"], ["4519.T", "Chugai Pharmaceutical"], ["4503.T", "Astellas Pharma"], ["8411.T", "Mizuho Financial"],
  ["8766.T", "Tokio Marine"], ["8591.T", "ORIX"], ["8031.T", "Mitsui & Co."], ["8053.T", "Sumitomo Corporation"], ["2914.T", "Japan Tobacco"],
  ["4661.T", "Oriental Land"], ["9020.T", "JR East"], ["9022.T", "JR Central"], ["9101.T", "NYK Line"], ["9104.T", "Mitsui O.S.K. Lines"],
  ["7201.T", "Nissan Motor"], ["7270.T", "Subaru"], ["7269.T", "Suzuki Motor"], ["5401.T", "Nippon Steel"], ["3382.T", "Seven & i Holdings"],
  ["2802.T", "Ajinomoto"], ["4452.T", "Kao"], ["4911.T", "Shiseido"], ["6301.T", "Komatsu"], ["7733.T", "Olympus"], ["6594.T", "Nidec"],
  ["4901.T", "Fujifilm"], ["3659.T", "Nexon"], ["9766.T", "Konami"], ["7832.T", "Bandai Namco"], ["9697.T", "Capcom"],
  ["6723.T", "Renesas Electronics"], ["5803.T", "Fujikura"], ["6920.T", "Lasertec"], ["8801.T", "Mitsui Fudosan"],
  ["8802.T", "Mitsubishi Estate"], ["4755.T", "Rakuten Group"], ["4385.T", "Mercari"], ["4689.T", "LY Corporation"],
  ["9434.T", "SoftBank Corp."], ["6178.T", "Japan Post Holdings"], ["5108.T", "Bridgestone"], ["8604.T", "Nomura Holdings"],
  ["8750.T", "Dai-ichi Life"], ["9501.T", "Tokyo Electric Power"], ["1605.T", "Inpex"], ["5020.T", "ENEOS"], ["6526.T", "Socionext"],
  ["7202.T", "Isuzu Motors"], ["7261.T", "Mazda"], ["6448.T", "Brother Industries"], ["2502.T", "Asahi Group"], ["2503.T", "Kirin"],
];

const KR: [string, string][] = [
  ["005930.KS", "Samsung Electronics"], ["000660.KS", "SK Hynix"], ["373220.KS", "LG Energy Solution"], ["005380.KS", "Hyundai Motor"],
  ["035420.KS", "Naver"], ["035720.KS", "Kakao"], ["005490.KS", "POSCO Holdings"], ["051910.KS", "LG Chem"], ["006400.KS", "Samsung SDI"],
  ["000270.KS", "Kia"], ["105560.KS", "KB Financial"], ["055550.KS", "Shinhan Financial"], ["012450.KS", "Hanwha Aerospace"],
  ["042660.KS", "Hanwha Ocean"], ["329180.KS", "HD Hyundai Heavy Industries"], ["009540.KS", "HD Korea Shipbuilding & Offshore"],
  ["068270.KS", "Celltrion"], ["207940.KS", "Samsung Biologics"], ["028260.KS", "Samsung C&T"], ["032830.KS", "Samsung Life"],
  ["015760.KS", "Korea Electric Power"], ["247540.KQ", "Ecopro BM"], ["086520.KQ", "Ecopro"], ["005935.KS", "Samsung Electronics (Pref.)"],
  ["003670.KS", "POSCO Future M"], ["066570.KS", "LG Electronics"], ["003550.KS", "LG Corp"], ["034730.KS", "SK Inc."],
  ["017670.KS", "SK Telecom"], ["030200.KS", "KT"], ["096770.KS", "SK Innovation"], ["010130.KS", "Korea Zinc"], ["011200.KS", "HMM"],
  ["010140.KS", "Samsung Heavy Industries"], ["064350.KS", "Hyundai Rotem"], ["047810.KS", "Korea Aerospace Industries"],
  ["079550.KS", "LIG Nex1"], ["000810.KS", "Samsung Fire & Marine"], ["086790.KS", "Hana Financial"], ["316140.KS", "Woori Financial"],
  ["024110.KS", "Industrial Bank of Korea"], ["138040.KS", "Meritz Financial"], ["000100.KS", "Yuhan"], ["128940.KS", "Hanmi Pharmaceutical"],
  ["196170.KQ", "Alteogen"], ["028300.KQ", "HLB"], ["141080.KQ", "LigaChem Biosciences"], ["263750.KQ", "Pearl Abyss"],
  ["259960.KS", "Krafton"], ["036570.KS", "NCSoft"], ["251270.KS", "Netmarble"], ["352820.KS", "HYBE"], ["041510.KQ", "SM Entertainment"],
  ["035900.KQ", "JYP Entertainment"], ["122870.KQ", "YG Entertainment"], ["090430.KS", "Amorepacific"], ["051900.KS", "LG H&H"],
  ["097950.KS", "CJ CheilJedang"], ["004020.KS", "Hyundai Steel"], ["010950.KS", "S-Oil"], ["267250.KS", "HD Hyundai"],
  ["042700.KS", "Hanmi Semiconductor"], ["000720.KS", "Hyundai E&C"], ["012330.KS", "Hyundai Mobis"], ["018260.KS", "Samsung SDS"],
  ["402340.KS", "SK Square"], ["003490.KS", "Korean Air"], ["034020.KS", "Doosan Enerbility"], ["000150.KS", "Doosan"],
  ["009150.KS", "Samsung Electro-Mechanics"], ["011070.KS", "LG Innotek"], ["006800.KS", "Mirae Asset Securities"],
  ["016360.KS", "Samsung Securities"], ["071050.KS", "Korea Investment Holdings"], ["005940.KS", "NH Investment & Securities"],
  ["021240.KS", "Coway"], ["161390.KS", "Hankook Tire"], ["004370.KS", "Nongshim"], ["271560.KS", "Orion"], ["033780.KS", "KT&G"],
  ["139480.KS", "Emart"], ["023530.KS", "Lotte Shopping"], ["011170.KS", "Lotte Chemical"], ["450080.KS", "Ecopro Materials"],
  ["145020.KQ", "Hugel"], ["214150.KQ", "Classys"], ["039030.KQ", "EO Technics"], ["240810.KQ", "Wonik IPS"], ["403870.KQ", "HPSP"],
  ["058470.KQ", "Leeno Industrial"], ["357780.KQ", "Soulbrain"], ["112040.KQ", "Wemade"], ["293490.KQ", "Kakao Games"],
  ["323410.KS", "KakaoBank"], ["377300.KS", "Kakao Pay"], ["001570.KS", "Kumyang"], ["302440.KS", "SK Bioscience"],
];

const CRYPTO: [string, string][] = [
  ["BTC-USD", "Bitcoin"], ["ETH-USD", "Ethereum"], ["USDT-USD", "Tether"], ["BNB-USD", "BNB"], ["SOL-USD", "Solana"], ["XRP-USD", "XRP"],
  ["USDC-USD", "USD Coin"], ["DOGE-USD", "Dogecoin"], ["ADA-USD", "Cardano"], ["TRX-USD", "TRON"], ["AVAX-USD", "Avalanche"],
  ["LINK-USD", "Chainlink"], ["SHIB-USD", "Shiba Inu"], ["DOT-USD", "Polkadot"], ["LTC-USD", "Litecoin"], ["BCH-USD", "Bitcoin Cash"],
  ["XLM-USD", "Stellar"], ["UNI-USD", "Uniswap"], ["ATOM-USD", "Cosmos"], ["NEAR-USD", "NEAR Protocol"], ["APT-USD", "Aptos"],
  ["ARB-USD", "Arbitrum"], ["OP-USD", "Optimism"], ["HBAR-USD", "Hedera"], ["ICP-USD", "Internet Computer"], ["FIL-USD", "Filecoin"],
  ["ETC-USD", "Ethereum Classic"], ["AAVE-USD", "Aave"], ["INJ-USD", "Injective"], ["GRT-USD", "The Graph"], ["ALGO-USD", "Algorand"],
  ["VET-USD", "VeChain"], ["SAND-USD", "The Sandbox"], ["MANA-USD", "Decentraland"], ["AXS-USD", "Axie Infinity"], ["THETA-USD", "Theta"],
  ["EOS-USD", "EOS"], ["XTZ-USD", "Tezos"], ["NEO-USD", "Neo"], ["TIA-USD", "Celestia"], ["SEI-USD", "Sei"], ["STX-USD", "Stacks"],
  ["CRO-USD", "Cronos"], ["FET-USD", "Artificial Superintelligence Alliance"], ["TAO-USD", "Bittensor"], ["KAS-USD", "Kaspa"],
  ["WLD-USD", "Worldcoin"], ["IMX-USD", "Immutable"], ["RENDER-USD", "Render"], ["ONDO-USD", "Ondo"], ["JUP-USD", "Jupiter"],
  ["WIF-USD", "dogwifhat"], ["BONK-USD", "Bonk"], ["ENA-USD", "Ethena"], ["PENDLE-USD", "Pendle"], ["LDO-USD", "Lido DAO"],
  ["MKR-USD", "Maker"], ["RUNE-USD", "THORChain"], ["FLOKI-USD", "FLOKI"], ["GALA-USD", "Gala"], ["CFX-USD", "Conflux"],
  ["ZEC-USD", "Zcash"], ["XMR-USD", "Monero"], ["DASH-USD", "Dash"], ["IOTA-USD", "IOTA"], ["QNT-USD", "Quant"], ["EGLD-USD", "MultiversX"],
  ["FLOW-USD", "Flow"], ["MINA-USD", "Mina"], ["CHZ-USD", "Chiliz"], ["ENS-USD", "Ethereum Name Service"], ["JASMY-USD", "JasmyCoin"],
];

const FX: [string, string][] = [
  ["JPY=X", "USD/JPY"], ["KRW=X", "USD/KRW"], ["EURUSD=X", "EUR/USD"], ["GBPUSD=X", "GBP/USD"], ["AUDUSD=X", "AUD/USD"],
  ["NZDUSD=X", "NZD/USD"], ["CNY=X", "USD/CNY"], ["INR=X", "USD/INR"], ["CAD=X", "USD/CAD"], ["CHF=X", "USD/CHF"], ["MXN=X", "USD/MXN"],
  ["HKD=X", "USD/HKD"], ["SGD=X", "USD/SGD"], ["TWD=X", "USD/TWD"], ["BRL=X", "USD/BRL"], ["TRY=X", "USD/TRY"], ["EURJPY=X", "EUR/JPY"],
  ["EURGBP=X", "EUR/GBP"], ["EURKRW=X", "EUR/KRW"], ["JPYKRW=X", "JPY/KRW"],
];

const COMMODITIES: [string, string][] = [
  ["GC=F", "Gold"], ["SI=F", "Silver"], ["CL=F", "WTI Crude Oil"], ["BZ=F", "Brent Crude Oil"], ["NG=F", "Natural Gas"], ["HG=F", "Copper"],
  ["PL=F", "Platinum"], ["PA=F", "Palladium"], ["ZC=F", "Corn"], ["ZW=F", "Wheat"], ["ZS=F", "Soybeans"], ["KC=F", "Coffee"],
  ["CC=F", "Cocoa"], ["SB=F", "Sugar"], ["CT=F", "Cotton"],
];

function entries(list: [string, string][], group: UniverseGroup): UniverseEntry[] {
  return list.map(([symbol, name]) => ({ symbol, name, group }));
}

const RAW: UniverseEntry[] = [
  ...entries(INDICES, "index"),
  ...entries(US, "us-stock"),
  ...entries(ETFS, "etf"),
  ...entries(JP, "jp-stock"),
  ...entries(KR, "kr-stock"),
  ...entries(CRYPTO, "crypto"),
  ...entries(FX, "fx"),
  ...entries(COMMODITIES, "commodity"),
];

// Front-page symbols first (they carry the most links), then the rest, deduped.
const seen = new Set<string>();
export const UNIVERSE: UniverseEntry[] = [
  ...SYMBOLS.map((s): UniverseEntry => ({
    symbol: s.symbol,
    name: s.name,
    group: s.group.endsWith("index") ? "index" : (s.group as UniverseGroup),
  })),
  ...RAW,
].filter((e) => (seen.has(e.symbol) ? false : (seen.add(e.symbol), true)));

const BY_SYMBOL = new Map(UNIVERSE.map((e) => [e.symbol, e]));

export function universeEntry(symbol: string): UniverseEntry | undefined {
  return BY_SYMBOL.get(symbol) ?? BY_SYMBOL.get(symbol.toUpperCase());
}

export const GROUP_LABEL: Record<UniverseGroup, string> = {
  index: "Indices",
  "us-stock": "US Stocks",
  etf: "ETFs",
  "jp-stock": "Japan Stocks",
  "kr-stock": "Korea Stocks",
  crypto: "Cryptocurrencies",
  fx: "Currencies",
  commodity: "Commodities",
};

export const GROUPS: UniverseGroup[] = ["index", "us-stock", "etf", "jp-stock", "kr-stock", "crypto", "fx", "commodity"];

export function byGroup(group: UniverseGroup): UniverseEntry[] {
  return UNIVERSE.filter((e) => e.group === group);
}
