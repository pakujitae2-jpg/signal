import type { Lang } from "./i18n";
import type { PulseText } from "./pulse";

// GENERATED - do not edit by hand. Written and edited so the prose never
// contains a price, rate or index level: those come from the live feed.

export const PULSE_CONTENT: Record<Lang, Record<string, PulseText>> = {
  "en": {
    "bitcoin-price-today": {
      "query": "Bitcoin price today",
      "kicker": "Crypto prices",
      "lead": "The figure above is what one bitcoin is worth in US dollars right now, drawn from live exchange data rather than any daily settlement. Because crypto markets never close, the 24-hour change beneath it compares the current price with the price exactly 24 hours ago — a rolling window, not the gap from yesterday's close. The page also shows how Korean exchange prices compare once converted back into dollars, which is where the kimchi premium turns up.",
      "faqs": [
        {
          "q": "Why doesn't Bitcoin have a closing price?",
          "a": "Bitcoin trades continuously on exchanges around the world, so there is no bell to ring and no official close. Anything labeled a daily open or close is a convention chosen by whoever drew the chart, usually midnight UTC."
        },
        {
          "q": "Why do exchanges show slightly different Bitcoin prices?",
          "a": "Each exchange is its own order book with its own buyers, sellers and settlement currency, so quotes drift apart by small amounts. Aggregated figures like the one above blend major venues into a representative global price, and arbitrage traders keep the gaps narrow in most markets."
        },
        {
          "q": "Why is Bitcoin more expensive in Korea?",
          "a": "Korean exchanges are walled off from easy cross-border arbitrage by capital controls and banking rules, so local demand can push the won price above the global price. That gap is called the kimchi premium; it widens and narrows over time and can also turn negative."
        }
      ]
    },
    "usd-to-krw-today": {
      "query": "USD to KRW today",
      "kicker": "Currency rates",
      "lead": "The rate shown here is the mid-market dollar-won rate — the midpoint between the bid and the ask that large banks quote each other in the interbank market at this moment. It is the rate news outlets cite and the most neutral single reference point, but it is not one a retail customer is offered. Whether you buy won at a bank counter, an airport booth or with a card, the rate you get sits some distance from this midpoint, because the provider's margin is built into it.",
      "faqs": [
        {
          "q": "What does mid-market rate mean?",
          "a": "It is the exact middle of the buy and sell prices quoted between banks trading with each other. Retail customers are not offered the midpoint; it exists as a neutral reference against which other quotes can be measured."
        },
        {
          "q": "Why is my bank's rate worse than this one?",
          "a": "Banks and exchange counters quote a spread around the mid-market rate, and that spread is how they are paid, alongside any explicit fee. The wider the spread, the further your rate sits from the figure above."
        },
        {
          "q": "When does the Korean won actually trade?",
          "a": "The onshore won market trades on Korean weekdays, and its hours now extend well beyond the traditional Seoul business day following reforms in recent years. Offshore trading in the won, largely through non-deliverable forwards, runs nearly around the clock, so rates quoted while Korea is closed come from that market and can move before domestic trading resumes."
        }
      ]
    },
    "what-is-kimchi-premium": {
      "query": "What is the kimchi premium?",
      "kicker": "Crypto in Korea",
      "lead": "The kimchi premium is the gap between the price of a cryptocurrency on Korean exchanges and its price on global exchanges, once the Korean won price has been converted into dollars. When Korean buyers are paying more than the rest of the world the premium is positive; the reading above shows where it stands at the moment. It can persist because Korea's capital controls and banking rules make it hard for arbitrage traders to move money in and out quickly enough to close the gap.",
      "faqs": [
        {
          "q": "How is the kimchi premium calculated?",
          "a": "Take the Korean exchange price in won, divide by the dollar-won exchange rate to get a dollar figure, then express the difference from the global dollar price as a percentage. The exchange rate used matters, which is why different sites can show slightly different premiums."
        },
        {
          "q": "Why doesn't arbitrage close the gap?",
          "a": "Closing it means buying cheap abroad, selling in Korea and sending the won back out again — but foreigners cannot easily open Korean exchange accounts, and residents face reporting requirements and limits on moving funds overseas. That friction and delay leaves room for the premium to survive."
        },
        {
          "q": "Can the kimchi premium be negative?",
          "a": "Yes. When Korean sentiment is weaker than the rest of the market, local prices trade below the global price, which traders call a reverse or negative premium. Both directions have appeared repeatedly across past cycles."
        }
      ]
    },
    "crypto-fear-and-greed-today": {
      "query": "Crypto Fear and Greed Index",
      "kicker": "Market sentiment",
      "lead": "The reading above places crypto market sentiment on a scale from 0 to 100, where the low end is labeled extreme fear and the high end extreme greed. It is assembled from market data — recent volatility, trading momentum and volume, social media activity, Bitcoin's share of total crypto market value and search interest — blended into a single headline number. Treat it as a temperature check on the crowd's mood, most often read as a contrarian signal, rather than as a reason to act.",
      "faqs": [
        {
          "q": "What goes into the Fear and Greed Index?",
          "a": "The main ingredients are price volatility measured against recent averages, market momentum and trading volume, social media chatter, Bitcoin dominance and search trends. Each input is scored and weighted, then combined into one figure between 0 and 100."
        },
        {
          "q": "Why is it read as a contrarian indicator?",
          "a": "The reasoning is that crowds are most fearful after prices have already fallen and most greedy after they have already risen, so an extreme reading describes what has happened rather than what comes next. It measures mood, not value, and it has sat at an extreme for long stretches before."
        },
        {
          "q": "How often does the index update?",
          "a": "It is republished at least once a day, so it moves in steps rather than ticking continuously like a price. The value above is the most recent published reading."
        }
      ]
    },
    "usd-to-jpy-today": {
      "query": "USD to JPY today",
      "kicker": "Currency rates",
      "lead": "The rate above shows how many Japanese yen one US dollar buys right now, quoted at the mid-market rate — the midpoint between the bid and ask banks quote each other. Dollar-yen is driven more than most pairs by the gap between US and Japanese interest rates: when US yields sit well above Japanese ones, holding dollars pays more and the yen tends to soften. A weaker yen also flatters Japan's big exporters, whose overseas earnings translate into more yen, which is why Tokyo's stock market often rises as the currency falls.",
      "faqs": [
        {
          "q": "Does a higher USD/JPY number mean a stronger yen?",
          "a": "No — the quote is yen per dollar, so a higher number means each dollar buys more yen and the yen is weaker. A falling number means the yen is strengthening."
        },
        {
          "q": "Why do interest rates move the yen so much?",
          "a": "The yen has long been a low-yielding currency, so investors borrow in it to buy higher-yielding assets elsewhere. When rate differentials widen that trade grows and the yen softens; when they narrow it can unwind quickly."
        },
        {
          "q": "Why do Japanese exporters benefit from a weak yen?",
          "a": "Carmakers, machinery and electronics firms sell in dollars and euros but report in yen, so the same overseas sale converts into a larger yen figure. A weaker yen also makes their goods cheaper against foreign competitors."
        }
      ]
    },
    "nikkei-225-today": {
      "query": "Nikkei 225 today",
      "kicker": "Japan markets",
      "lead": "The level above is where the Nikkei 225, Japan's best-known stock index, is trading. Unlike most modern benchmarks it is price-weighted: the constituents with the highest share prices move the index most, regardless of how large those companies actually are. It also carries a strong currency link, because a weaker yen lifts the exporters that make up much of the index — which is why the Nikkei and the yen so often move in opposite directions.",
      "faqs": [
        {
          "q": "What is the difference between the Nikkei 225 and TOPIX?",
          "a": "The Nikkei tracks 225 selected companies and weights them by share price, while TOPIX covers a far broader slice of the Tokyo market and weights by market value. TOPIX gives the better picture of the whole market; the Nikkei is the more quoted headline."
        },
        {
          "q": "What does price-weighted mean?",
          "a": "Each stock's influence comes from its share price rather than its size, so a high-priced share can sway the index more than a much larger company with a low share price. The Dow Jones Industrial Average is built the same way."
        },
        {
          "q": "When is the Tokyo Stock Exchange open?",
          "a": "It trades on weekday mornings and afternoons Japan time with a midday break, and closes for Japanese public holidays. Outside those hours the level shown reflects the last traded print or the futures market, depending on the source."
        }
      ]
    },
    "kospi-today": {
      "query": "KOSPI today",
      "kicker": "Korea markets",
      "lead": "The figures above show where the KOSPI, the main board of the Korea Exchange, and the KOSDAQ, its smaller growth-company market, are trading. Korean equities are unusually sensitive to the global semiconductor cycle, because a handful of memory and chip-related names dominate the market's value and their earnings swing with chip prices. That is why the KOSPI often reacts to overseas tech demand and export data rather than purely domestic news.",
      "faqs": [
        {
          "q": "What is the difference between KOSPI and KOSDAQ?",
          "a": "KOSPI is the main board, home to Korea's largest listed companies, while KOSDAQ lists smaller, younger firms weighted toward technology and biotech. KOSDAQ is generally the more volatile of the two."
        },
        {
          "q": "Why do semiconductors matter so much to the KOSPI?",
          "a": "Memory chipmakers and their suppliers account for a very large share of the index by market value, so their profits and the price of memory chips move the whole benchmark. Korea is also a major exporter, tying the market to global demand."
        },
        {
          "q": "When does the Korean stock market trade?",
          "a": "The Korea Exchange runs on weekdays during Seoul hours, with an opening auction before the regular session and a closing auction at the end. It is shut for Korean public holidays."
        }
      ]
    },
    "sp500-today": {
      "query": "S&P 500 today",
      "kicker": "US markets",
      "lead": "The levels above cover the three US benchmarks quoted most often: the S&P 500, the Nasdaq Composite and the Dow Jones Industrial Average. The S&P 500 tracks around five hundred large US companies weighted by market value, making it the broadest read on big-company America. The Nasdaq Composite includes everything listed on the Nasdaq exchange and leans heavily toward technology, while the Dow follows just thirty blue-chip names and weights them by share price — the narrowest and the most idiosyncratic of the three.",
      "faqs": [
        {
          "q": "What is the difference between the S&P 500 and the Dow?",
          "a": "The S&P 500 holds around five hundred companies weighted by market value; the Dow holds thirty and weights them by share price. Because of that, a single high-priced stock can push the Dow around, while the S&P better reflects the overall market."
        },
        {
          "q": "Is the Nasdaq Composite the same as the Nasdaq 100?",
          "a": "No. The Composite includes every common stock listed on the Nasdaq exchange, which runs into the thousands, while the Nasdaq 100 holds only the largest non-financial names. They move similarly but are not interchangeable."
        },
        {
          "q": "Can you invest in an index directly?",
          "a": "An index is a calculation, not a security, so it cannot be bought as such. Exposure comes through funds and derivatives designed to track it, which carry their own costs and tracking differences."
        }
      ]
    },
    "gold-price-today": {
      "query": "Gold price today",
      "kicker": "Precious metals",
      "lead": "The figure above is the dollar price of one troy ounce of gold, taken from the most actively traded front-month futures contract, which moves closely in step with the spot market. A troy ounce is the traditional precious-metals unit and is heavier than the ordinary ounce used in a kitchen — a little over 31 grams. Gold is quoted in US dollars by global convention, so the number you see reflects what the dollar is doing as well as what gold is doing.",
      "faqs": [
        {
          "q": "What is a troy ounce?",
          "a": "It is the standard weight unit for precious metals, roughly 31.1 grams, against about 28.3 grams for a standard avoirdupois ounce. Every gold quote given in dollars per ounce means troy ounces."
        },
        {
          "q": "What is the difference between spot and futures gold?",
          "a": "Spot is the price for immediate delivery, while a futures contract fixes a price for delivery on a set future date. The front-month contract usually trades close to spot — typically a little above it, reflecting financing and storage costs — which is why it works as a live stand-in."
        },
        {
          "q": "Why does gold move when the dollar moves?",
          "a": "Because gold is priced in dollars, a stronger dollar makes the metal more expensive for buyers using other currencies and tends to weigh on the dollar price, and the reverse when the dollar weakens. It is a tendency rather than a rule, and it breaks down regularly."
        }
      ]
    },
    "samsung-electronics-stock-price": {
      "query": "Samsung Electronics stock price",
      "kicker": "Korea stocks",
      "lead": "The price above is one Samsung Electronics common share in Korean won, as traded on the Korea Exchange under code 005930. It is by a wide margin the largest company in the KOSPI, so its weight in the index means a big move in the stock pulls the whole Korean market with it. Much of that movement traces back to the memory cycle: Samsung's profits rise and fall with the price of DRAM and NAND chips, which swing between shortage and glut.",
      "faqs": [
        {
          "q": "What is the difference between Samsung's common and preferred shares?",
          "a": "The common share, listed as 005930, carries voting rights, while the preferred share, 005935, has no vote but a slightly higher dividend entitlement. The preferred line normally trades at a discount to the common."
        },
        {
          "q": "Why does Samsung matter so much to the KOSPI?",
          "a": "The KOSPI weights companies by market value and Samsung Electronics is the heaviest constituent by a long way. On a quiet day, much of the index's move is simply Samsung's move."
        },
        {
          "q": "What is the memory chip cycle?",
          "a": "Memory behaves like a commodity: tight supply sends prices and margins sharply higher, which draws in new capacity until there is a glut and prices fall again. Samsung's earnings track that cycle closely, which is why its shares are usually discussed in terms of where the cycle stands."
        }
      ]
    },
    "nvidia-stock-price-today": {
      "query": "Nvidia stock price today",
      "kicker": "US stocks",
      "lead": "The price above is one Nvidia share in US dollars, listed on Nasdaq under the ticker NVDA. Nvidia has split its stock several times over its history, and the chart on this page is split-adjusted — every price before a split has been rescaled so the line reads continuously instead of showing a cliff on the split date. That means the historic prices plotted here look lower than the figures investors actually paid at the time.",
      "faqs": [
        {
          "q": "Has Nvidia split its stock?",
          "a": "Yes, several times over its life as a listed company, including a four-for-one split in 2021 and a ten-for-one split in 2024. A split multiplies the number of shares outstanding and divides the price proportionally, leaving the value of an existing holding unchanged."
        },
        {
          "q": "Why doesn't the chart show a drop on the split date?",
          "a": "Charts are adjusted retroactively, dividing every pre-split price by the split ratio. Without that adjustment each split would appear as a crash that never actually happened."
        },
        {
          "q": "Where is Nvidia listed and when does it trade?",
          "a": "Nvidia trades on Nasdaq under NVDA during US market hours on weekdays, with pre-market and after-hours sessions either side. Prices quoted outside regular hours come from thinner trading and can jump more sharply."
        }
      ]
    },
    "ethereum-price-today": {
      "query": "Ethereum price today",
      "kicker": "Crypto prices",
      "lead": "The figure above is the dollar price of one ether, the native token of the Ethereum network. Where Bitcoin was designed as fixed-supply digital money and a store of value, Ethereum was built as a programmable platform: ether is the fuel that pays for running contracts, applications and token transfers on it. The two often move together with overall crypto sentiment, but the reason people hold them differs, and so does the way their supply works.",
      "faqs": [
        {
          "q": "What is the difference between Bitcoin and Ethereum?",
          "a": "Bitcoin is a payment and store-of-value network with a hard cap on supply and deliberately limited scripting. Ethereum runs general-purpose smart contracts, which has made it a base layer for much of the stablecoin, DeFi and token market, with ether paying for that computation."
        },
        {
          "q": "What are gas fees?",
          "a": "Gas is the charge for the computation and storage a transaction consumes on Ethereum, paid in ether. Busy periods push fees higher because users are bidding for limited block space."
        },
        {
          "q": "Is there a limit on how much ether can exist?",
          "a": "There is no fixed cap like Bitcoin's. New ether is issued to those who stake and secure the network, while a portion of transaction fees is destroyed, so the total supply can grow or shrink depending on network activity."
        }
      ]
    },
    "bitcoin-vs-gold": {
      "query": "Bitcoin vs gold",
      "kicker": "Compare assets",
      "lead": "Both bitcoin and gold get described as hedges against currency debasement, but they have behaved very differently. Across bitcoin's short history its gains have far outstripped gold's — and so have its losses, with drawdowns deep enough to halve the price or worse occurring repeatedly, while gold's swings have been a fraction of that. The comparison above shows how the two have moved against each other; read it as a record of what has happened, not a guide to what comes next.",
      "faqs": [
        {
          "q": "Is Bitcoin really digital gold?",
          "a": "The analogy rests on scarcity — bitcoin's supply is capped by code, gold's by geology — and on neither having a central issuer. It breaks down on behavior: gold has centuries of price history and comparatively low volatility, while bitcoin has traded more like a high-beta risk asset."
        },
        {
          "q": "Which is more volatile?",
          "a": "Bitcoin, by a wide margin. Its daily and annual price swings have consistently been several times larger than gold's throughout its trading history."
        },
        {
          "q": "Do gold and Bitcoin move together?",
          "a": "Not reliably. The correlation between them drifts, sometimes turning positive during bouts of currency worry and often sitting near zero or negative when markets are simply risk-on or risk-off."
        }
      ]
    },
    "how-much-is-100-dollars-in-won": {
      "query": "How much is $100 in Korean won?",
      "kicker": "Currency converter",
      "lead": "The amount above is what 100 US dollars is worth in Korean won at the current mid-market exchange rate — the midpoint between the buy and sell quotes banks trade at with each other. It updates as the rate moves, so it is a live conversion rather than a fixed figure. To check any other amount, change the input on the converter and the won total recalculates against the same rate.",
      "faqs": [
        {
          "q": "Will I actually receive this many won?",
          "a": "Almost certainly not. Banks, exchange booths, ATMs and card networks each quote a rate set away from the mid-market midpoint and may add a fee on top, so the won you walk away with is lower."
        },
        {
          "q": "How do I convert a different amount?",
          "a": "Enter the dollar figure you want and the converter applies the same live mid-market rate. Conversion is a straight multiplication, so doubling the dollars doubles the won and you can scale any figure the same way."
        },
        {
          "q": "What are the Korean won denominations?",
          "a": "Banknotes are issued in 1,000, 5,000, 10,000 and 50,000 won, with coins for smaller amounts, and the currency symbol is ₩. Prices in Korea are written in plain won, so everyday figures run into the thousands."
        }
      ]
    }
  },
  "ko": {
    "bitcoin-price-today": {
      "query": "비트코인 실시간 시세",
      "kicker": "암호화폐 시세",
      "lead": "위에 표시된 숫자가 지금 이 순간 글로벌 거래소에서 거래되는 비트코인의 달러 가격입니다. 비트코인 시장은 주말과 야간을 가리지 않고 24시간 열려 있어 주식 같은 '종가'가 없기 때문에, 전일 대비 대신 정확히 24시간 전 가격과 비교한 변동률을 함께 보여 줍니다. 국내 원화 거래소 가격은 같은 시각에도 해외 시세와 다르게 형성되는데, 그 차이가 바로 김치프리미엄입니다.",
      "faqs": [
        {
          "q": "비트코인 시세는 왜 거래소마다 다릅니까?",
          "a": "거래소마다 호가창이 따로 운영되어 매수·매도 물량이 다르게 쌓이기 때문입니다. 위 가격은 주요 글로벌 거래소의 달러 거래를 기준으로 하며, 국내 원화 거래소 호가와는 차이가 날 수 있습니다."
        },
        {
          "q": "24시간 변동률은 무엇을 기준으로 계산합니까?",
          "a": "현재 가격을 정확히 24시간 전 같은 시각의 가격과 비교해 계산합니다. 주식의 전일 대비와 달리 기준 시점이 계속 이동하므로, 같은 하루 안에서도 볼 때마다 수치가 달라집니다."
        },
        {
          "q": "원화로 환산한 비트코인 가격은 어떻게 구합니까?",
          "a": "달러 가격에 원달러 환율을 곱하면 이론상의 원화 가격이 나옵니다. 실제 국내 거래소 가격은 여기서 김치프리미엄만큼 위나 아래로 벌어져 있는 경우가 많습니다."
        }
      ]
    },
    "usd-to-krw-today": {
      "query": "원달러 환율 오늘",
      "kicker": "외환 시세",
      "lead": "위에 표시된 값은 은행 간 외환시장에서 형성된 원달러 중간 환율, 즉 매수 호가와 매도 호가의 한가운데 값입니다. 뉴스와 차트에서 말하는 '환율'은 대개 이 값이며, 개인이 실제로 사고파는 가격은 아닙니다. 은행이나 환전소에서는 여기에 수수료 성격의 스프레드가 붙어 살 때는 더 비싸게, 팔 때는 더 싸게 적용됩니다.",
      "faqs": [
        {
          "q": "중간 환율과 은행 고시 환율은 무엇이 다릅니까?",
          "a": "중간 환율은 매수·매도 호가의 중간값이고, 은행 고시 환율은 여기에 마진을 얹은 '살 때 / 팔 때' 환율입니다. 그래서 현찰 환전은 화면에 보이는 환율보다 불리하게 체결됩니다."
        },
        {
          "q": "원달러 환율은 왜 오르내립니까?",
          "a": "한미 금리차, 무역수지와 배당·외국인 자금 흐름, 달러 지수 같은 대외 변수, 위험자산 선호 정도가 함께 작용합니다. 방향을 미리 알려 주는 공식은 없으며, 이 페이지는 지금 형성된 값만 보여 줍니다."
        },
        {
          "q": "환율은 하루 중 언제 움직입니까?",
          "a": "국내 외환시장 정규 거래 시간이 따로 있지만, 달러·원은 역외 시장에서도 거래되어 사실상 거의 온종일 값이 바뀝니다. 그래서 국내 장이 닫힌 밤사이에 환율이 크게 이동해 있는 경우도 흔합니다."
        }
      ]
    },
    "what-is-kimchi-premium": {
      "query": "김치프리미엄 뜻",
      "kicker": "가상자산 지표",
      "lead": "김치프리미엄은 국내 원화 거래소의 코인 가격이 해외 달러 시세를 환율로 환산한 값보다 얼마나 비싼지를 백분율로 나타낸 지표입니다. 계산식은 (국내 원화 가격 ÷ (해외 달러 가격 × 원달러 환율) − 1) × 100 이며, 값이 마이너스면 국내가 더 싸다는 뜻으로 흔히 역프라고 부릅니다. 위 수치는 지금 시점의 격차를 보여 주며, 과거 과열 국면에서는 프리미엄이 50%를 넘긴 적도 있었습니다.",
      "faqs": [
        {
          "q": "김치프리미엄은 왜 사라지지 않습니까?",
          "a": "해외에서 싸게 사서 국내에서 비싸게 파는 차익거래를 하려면 자금을 자유롭게 옮겨야 하는데, 외국환거래 규정과 거래소의 입출금 제한이 이를 막고 있습니다. 그래서 격차가 벌어져도 즉시 메워지지 않고 한동안 유지됩니다."
        },
        {
          "q": "역프는 무엇입니까?",
          "a": "역프리미엄의 줄임말로, 국내 가격이 해외보다 오히려 싼 상태를 말합니다. 국내 투자 심리가 식거나 원화 매도 압력이 클 때 나타나는 경우가 많습니다."
        },
        {
          "q": "김치프리미엄은 코인마다 다릅니까?",
          "a": "네, 종목별로 국내 수요와 유동성이 달라 프리미엄 폭도 제각각입니다. 보통 비트코인 기준으로 이야기하지만 알트코인은 더 크게 벌어지기도 합니다."
        }
      ]
    },
    "crypto-fear-and-greed-today": {
      "query": "공포탐욕지수 오늘",
      "kicker": "투자 심리",
      "lead": "위에 표시된 0에서 100 사이의 값은 암호화폐 시장의 투자 심리를 하나의 숫자로 압축한 공포탐욕지수입니다. 0에 가까울수록 극단적 공포, 100에 가까울수록 극단적 탐욕으로 분류하며, 가격 변동성과 거래 모멘텀, 소셜미디어 언급량, 비트코인 도미넌스, 검색 트렌드 등을 섞어 산출합니다. 시장 분위기의 온도를 재는 참고 지표일 뿐 매매 신호가 아니며, 이 페이지에서는 지금 값과 구간별 의미를 확인할 수 있습니다.",
      "faqs": [
        {
          "q": "지수가 낮으면 사야 한다는 뜻입니까?",
          "a": "아닙니다. 극단적 공포 구간이 오래 이어진 사례도 많아 특정 값이 매수나 매도 시점을 알려 주지는 않습니다. 시장 심리가 어느 쪽으로 치우쳤는지 확인하는 용도의 지표입니다."
        },
        {
          "q": "어떤 데이터로 계산합니까?",
          "a": "가격 변동성, 거래량과 시장 모멘텀, 소셜미디어 언급량, 비트코인 도미넌스, 검색어 트렌드 같은 항목을 가중 평균해 하나의 점수로 만듭니다. 세부 가중치와 반영 항목은 지수를 산출하는 기관이 정해 둔 방식을 따릅니다."
        },
        {
          "q": "얼마나 자주 갱신됩니까?",
          "a": "하루 단위로 새 값이 계산되어 갱신되는 것이 일반적입니다. 그래서 장중에 가격이 크게 움직여도 지수가 곧바로 따라 움직이지는 않을 수 있습니다."
        }
      ]
    },
    "usd-to-jpy-today": {
      "query": "엔달러 환율 오늘",
      "kicker": "외환 시세",
      "lead": "위 숫자는 1달러를 사는 데 필요한 엔화 금액으로, 국내에서는 흔히 엔달러(달러엔) 환율이라고 부릅니다. 값이 올라가면 엔화가 약해졌다는 뜻이고, 내려가면 엔화가 강해졌다는 뜻입니다. 이 환율은 미국과 일본의 금리차에 특히 민감하게 반응하며, 엔 약세는 해외에서 번 돈을 엔으로 환산할 때 유리해 자동차·전자 같은 일본 수출 기업 실적을 뒷받침하는 요인으로 꼽혀 왔습니다.",
      "faqs": [
        {
          "q": "엔달러 환율이 오르면 엔화 가치는 어떻게 됩니까?",
          "a": "숫자가 커질수록 같은 1달러를 사는 데 엔이 더 많이 필요하다는 뜻이므로 엔화 가치는 떨어진 것입니다. 흔히 말하는 엔저가 바로 이 상태입니다."
        },
        {
          "q": "금리차가 왜 중요합니까?",
          "a": "금리가 높은 통화를 들고 있으면 이자 수익이 커지기 때문에 자금이 그쪽으로 몰립니다. 미일 금리차가 벌어질수록 엔을 팔고 달러를 사려는 수요가 늘어나 환율이 움직이는 배경이 됩니다."
        },
        {
          "q": "원엔 환율은 어떻게 계산합니까?",
          "a": "원달러 환율을 엔달러 환율로 나눈 뒤 100을 곱하면 100엔당 원화 값이 나옵니다. 국내에서 쓰는 엔화 환율 표기가 바로 이 100엔 기준입니다."
        }
      ]
    },
    "nikkei-225-today": {
      "query": "닛케이 지수 오늘",
      "kicker": "일본 증시",
      "lead": "위에 보이는 값은 도쿄증권거래소 상장 종목 가운데 대표 종목 225개로 산출하는 닛케이225 지수와 전일 대비 등락입니다. 시가총액이 아니라 주가를 평균하는 주가평균식 지수여서, 주가가 높은 소수 종목의 등락이 지수 전체를 크게 흔드는 구조입니다. 엔화와의 관계도 밀접해, 수출 기업 비중이 큰 지수 특성상 엔화가 약해진 국면에서 지수가 오르는 흐름이 자주 나타났습니다.",
      "faqs": [
        {
          "q": "닛케이225와 토픽스는 무엇이 다릅니까?",
          "a": "닛케이225는 대표 종목 225개의 주가를 평균한 주가 가중 지수이고, 토픽스는 도쿄증권거래소 상장 종목을 시가총액으로 가중해 폭넓게 담은 지수입니다. 시장 전체 규모를 보려면 토픽스, 대표 종목 흐름을 보려면 닛케이가 흔히 쓰입니다."
        },
        {
          "q": "일본 증시는 한국 시간으로 언제 열립니까?",
          "a": "한국과 시차가 없어 한국 시간으로도 오전 9시에 개장합니다. 오전장은 오전 11시 30분에 끝나고 점심 휴장을 거쳐 낮 12시 30분에 다시 열려 오후 3시 30분에 마감하므로, 국내 장과 거의 같은 시간대에 움직입니다."
        },
        {
          "q": "원화로 일본 주식에 투자하면 무엇을 더 봐야 합니까?",
          "a": "지수 등락 외에 원엔 환율 변동이 수익률에 그대로 더해집니다. 지수가 올라도 엔화가 약해지면 원화로 환산한 성과는 줄어들 수 있습니다."
        }
      ]
    },
    "kospi-today": {
      "query": "코스피 지수 오늘",
      "kicker": "국내 증시",
      "lead": "위에는 코스피와 코스닥의 현재 지수, 그리고 전일 대비 등락이 함께 표시됩니다. 코스피는 유가증권시장 상장 종목을 시가총액으로 가중한 지수라 대형주 비중이 크고, 코스닥은 기술·바이오 중심의 중소형 종목이 주를 이룹니다. 국내 지수는 시가총액 상위를 반도체 대형주가 차지하고 있어 글로벌 메모리 업황과 미국 기술주 흐름에 함께 흔들리는 특징이 있습니다.",
      "faqs": [
        {
          "q": "코스피와 코스닥은 어떻게 다릅니까?",
          "a": "코스피는 규모와 실적 요건이 엄격한 유가증권시장이고, 코스닥은 성장성 중심의 중소·벤처 기업이 상장하는 시장입니다. 그래서 코스닥이 대체로 변동성이 더 큽니다."
        },
        {
          "q": "코스피는 왜 반도체 업황에 민감합니까?",
          "a": "시가총액 상위를 메모리 반도체 기업이 차지하고 있어 이들의 실적과 주가가 지수 전체를 좌우하기 때문입니다. 반도체 가격과 수출 지표가 코스피 방향과 함께 언급되는 이유입니다."
        },
        {
          "q": "국내 증시 거래 시간은 언제입니까?",
          "a": "정규장은 평일 오전 9시부터 오후 3시 30분까지이며, 개장 전과 마감 후에는 시간외 거래가 따로 운영됩니다. 주말과 공휴일에는 열리지 않습니다."
        }
      ]
    },
    "sp500-today": {
      "query": "S&P500 지수 오늘",
      "kicker": "미국 증시",
      "lead": "위에는 S&P 500과 나스닥 종합지수, 다우존스 산업평균지수가 나란히 표시됩니다. S&P 500은 미국 대형주 500개를 시가총액으로 가중해 시장 전체를 대표하고, 나스닥 종합지수는 나스닥에 상장된 수천 개 종목을 담아 기술주 비중이 높으며, 다우는 30개 종목을 주가로 가중하는 지수로 역사가 가장 긴 축에 듭니다. 세 지수가 같은 날 서로 다른 방향으로 움직이는 것도 이런 구성 차이 때문입니다.",
      "faqs": [
        {
          "q": "나스닥 종합지수와 나스닥100은 무엇이 다릅니까?",
          "a": "종합지수는 나스닥 상장 종목 전체를 담고, 나스닥100은 금융업을 제외한 시가총액 상위 100개 종목만 추립니다. 국내에서 흔히 말하는 '나스닥 선물'은 대개 나스닥100 기준입니다."
        },
        {
          "q": "미국 증시는 한국 시간으로 언제 열립니까?",
          "a": "서머타임 기간에는 밤 10시 30분부터 다음 날 새벽 5시, 그 외 기간에는 밤 11시 30분부터 새벽 6시에 정규장이 열립니다. 정규장 앞뒤로 프리마켓과 애프터마켓 거래도 진행됩니다."
        },
        {
          "q": "다우지수는 왜 종목 수가 적습니까?",
          "a": "19세기 말에 만들어져 지금까지 이어져 온 지수로, 미국을 대표하는 우량주 30개만 골라 유지해 왔기 때문입니다. 주가가 높은 종목의 영향이 커서 시장 전체를 대표하는 데는 한계가 있다는 지적도 있습니다."
        }
      ]
    },
    "gold-price-today": {
      "query": "국제 금 시세 오늘",
      "kicker": "원자재 시세",
      "lead": "위 가격은 국제 시장에서 거래되는 금의 트로이온스당 달러 값입니다. 여기서 말하는 온스는 일상적인 무게 단위가 아니라 약 31.1그램인 트로이온스이며, 국제 금 시세는 런던 현물 시장과 뉴욕 선물 시장을 중심으로 형성되어 두 시장 가격이 사실상 같은 수준에서 움직입니다. 금은 국제적으로 달러로 호가되기 때문에 달러가 강해지면 다른 통화권에서는 같은 금이 더 비싸지고, 국내 금값은 여기에 원달러 환율과 세금·유통 비용이 더해져 결정됩니다.",
      "faqs": [
        {
          "q": "국제 금 시세와 국내 금값이 다른 이유는 무엇입니까?",
          "a": "달러 시세를 원화로 환산하는 과정에서 환율이 개입하고, 여기에 부가세와 유통 마진, 세공비가 붙기 때문입니다. 그래서 금은방 가격은 국제 시세를 그대로 환산한 값보다 높게 형성됩니다."
        },
        {
          "q": "금 한 돈은 몇 그램입니까?",
          "a": "한 돈은 3.75그램입니다. 트로이온스가 약 31.1그램이므로 한 온스는 대략 여덟 돈이 조금 넘는 무게입니다."
        },
        {
          "q": "금은 왜 달러로 표시됩니까?",
          "a": "국제 금 거래의 기준 시장과 결제 통화가 달러로 자리 잡았기 때문입니다. 그래서 금 가격 변동에는 금 자체의 수급뿐 아니라 달러 가치의 등락도 함께 반영됩니다."
        }
      ]
    },
    "samsung-electronics-stock-price": {
      "query": "삼성전자 주가",
      "kicker": "국내 종목",
      "lead": "위에 표시된 값은 삼성전자 보통주의 현재 주가와 전일 대비 등락입니다. 삼성전자는 코스피 시가총액에서 가장 큰 비중을 차지하고 있어, 이 종목 하나의 등락이 지수 전체 방향을 바꿔 놓는 일이 흔합니다. 실적의 큰 축이 메모리 반도체이다 보니 D램과 낸드 가격이 오르내리는 업황 사이클에 주가가 함께 반응하는 구조입니다.",
      "faqs": [
        {
          "q": "삼성전자와 삼성전자우는 무엇이 다릅니까?",
          "a": "우선주는 의결권이 없는 대신 배당에서 우대를 받는 주식으로, 보통주와 별도로 거래되어 가격도 다르게 형성됩니다. 위 시세는 보통주 기준입니다."
        },
        {
          "q": "삼성전자 주가는 코스피에 얼마나 영향을 줍니까?",
          "a": "코스피가 시가총액 가중 방식이라 비중이 가장 큰 종목의 등락이 지수에 가장 크게 반영됩니다. 삼성전자가 크게 움직인 날은 코스피 등락률도 그 영향을 상당 부분 받습니다."
        },
        {
          "q": "메모리 사이클은 무엇입니까?",
          "a": "D램과 낸드의 공급과 수요가 어긋나면서 가격이 오르내리는 주기를 말합니다. 가격 상승기에는 실적이 빠르게 개선되고 하락기에는 반대로 나빠지는 흐름이 반복돼 왔습니다."
        }
      ]
    },
    "nvidia-stock-price-today": {
      "query": "엔비디아 주가 오늘",
      "kicker": "미국 종목",
      "lead": "위에는 엔비디아의 현재 달러 주가와 전일 종가 대비 등락이 표시됩니다. 함께 보이는 장기 차트는 과거 액면분할이 이미 소급 반영된 수정주가 기준이라, 분할 시점에 주가가 갑자기 뚝 떨어진 것처럼 보이는 구간이 없습니다. 원화로 환산한 금액이 궁금하다면 표시된 달러 가격에 원달러 환율을 곱하면 됩니다.",
      "faqs": [
        {
          "q": "액면분할이 반영됐다는 것은 무슨 뜻입니까?",
          "a": "분할 이전의 주가를 분할 비율로 나눠 현재 기준에 맞춰 조정했다는 뜻입니다. 덕분에 분할 전후 구간을 끊김 없이 이어서 비교할 수 있습니다."
        },
        {
          "q": "엔비디아는 어느 지수에 포함돼 있습니까?",
          "a": "나스닥에 상장돼 나스닥 종합지수와 나스닥100에 들어가며, S&P 500과 다우존스 산업평균지수에도 편입돼 있습니다. 시가총액이 커서 지수 등락에 미치는 영향도 큽니다."
        },
        {
          "q": "미국 주식은 소수점 단위로도 살 수 있습니까?",
          "a": "국내 증권사 상당수가 소수점 매매를 지원해 한 주 가격이 부담스러워도 일부만 매수할 수 있습니다. 다만 증권사마다 취급 종목과 주문 방식이 다릅니다."
        }
      ]
    },
    "ethereum-price-today": {
      "query": "이더리움 시세 오늘",
      "kicker": "암호화폐 시세",
      "lead": "위 숫자는 글로벌 거래소 기준 이더리움의 달러 시세와 24시간 전 대비 변동률입니다. 비트코인이 발행량이 정해진 가치 저장 수단에 가깝게 쓰인다면, 이더리움은 스마트 컨트랙트를 실행하는 플랫폼의 연료에 가깝습니다. 네트워크에서 거래나 프로그램을 실행할 때마다 가스비를 이더로 내야 하고, 지분증명 방식이라 이더를 맡겨 검증에 참여하는 스테이킹 수요도 함께 존재합니다.",
      "faqs": [
        {
          "q": "이더리움과 비트코인은 무엇이 다릅니까?",
          "a": "비트코인은 공급량 상한이 정해진 화폐성 자산으로 설계됐고, 이더리움은 애플리케이션이 돌아가는 플랫폼으로 설계됐습니다. 목적이 다른 만큼 가격을 움직이는 재료도 서로 다릅니다."
        },
        {
          "q": "가스비는 무엇입니까?",
          "a": "이더리움 네트워크에서 거래를 처리하거나 스마트 컨트랙트를 실행할 때 내는 수수료입니다. 네트워크가 붐빌수록 올라가며, 이더로 결제됩니다."
        },
        {
          "q": "이더리움에도 김치프리미엄이 있습니까?",
          "a": "있습니다. 국내 원화 가격과 해외 달러 가격을 환율로 맞춰 비교하면 종목마다 다른 폭의 프리미엄이나 역프가 나타납니다."
        }
      ]
    },
    "bitcoin-vs-gold": {
      "query": "비트코인 vs 금 수익률",
      "kicker": "자산 비교",
      "lead": "두 자산 모두 화폐 가치 하락을 방어하는 수단으로 언급되지만, 실제로 움직이는 방식은 상당히 다릅니다. 금은 수천 년간 쌓인 실물 수요와 중앙은행 매입이 뒷받침해 등락이 완만한 편이고, 비트코인은 발행량 상한이라는 희소성을 내세우면서도 변동성은 금과 비교하기 어려울 만큼 큽니다. 위에서는 같은 기간 두 자산의 가격 흐름과 상대 성과를 나란히 놓고 비교해 볼 수 있습니다.",
      "faqs": [
        {
          "q": "비트코인을 '디지털 금'이라고 부를 수 있습니까?",
          "a": "공급이 제한된다는 점은 닮았지만, 시장이 위험을 회피하는 국면에서 금은 오르고 비트코인은 주식과 함께 내린 경우가 많았습니다. 성격이 같은 자산으로 보기는 어렵습니다."
        },
        {
          "q": "두 자산의 수익률은 어떻게 비교해야 합니까?",
          "a": "시작 시점을 100으로 맞춘 상대 지수로 그려야 가격 단위가 전혀 다른 두 자산을 같은 화면에서 볼 수 있습니다. 비교 구간을 언제로 잡느냐에 따라 우열이 완전히 뒤집히므로 기간을 반드시 확인해야 합니다."
        },
        {
          "q": "금과 비트코인은 각각 무엇에 반응합니까?",
          "a": "금은 실질금리와 달러 가치, 중앙은행 수요의 영향을 크게 받고, 비트코인은 유동성 환경과 위험자산 선호, 규제 뉴스에 민감합니다. 겹치는 변수도 있지만 반응 방향이 늘 같지는 않습니다."
        }
      ]
    },
    "how-much-is-100-dollars-in-won": {
      "query": "100달러 원화로 얼마",
      "kicker": "환율 계산",
      "lead": "위에는 오늘 중간 환율로 환산한 100달러의 원화 금액이 표시됩니다. 이 값은 은행 간 시장의 매수·매도 호가 중간값을 그대로 적용한 이론값이라, 실제로 창구나 환전소에서 현찰 100달러를 살 때는 스프레드가 붙어 이보다 더 많은 원화가 필요합니다. 다른 금액이 궁금하다면 화면에 표시된 원달러 환율에 원하는 달러 금액을 곱하면 같은 방식으로 계산됩니다.",
      "faqs": [
        {
          "q": "실제 환전할 때도 이 금액을 그대로 받습니까?",
          "a": "아닙니다. 은행은 중간 환율에 마진을 붙여 살 때와 팔 때 환율을 따로 고시하므로, 현찰 환전액은 이 계산값보다 불리합니다. 환전 우대율에 따라 차이는 줄어듭니다."
        },
        {
          "q": "1달러는 원화로 얼마인지 어떻게 봅니까?",
          "a": "화면에 표시된 원달러 환율 자체가 1달러의 원화 값입니다. 여기에 달러 금액을 곱하면 10달러든 1,000달러든 같은 방식으로 환산할 수 있습니다."
        },
        {
          "q": "환전 수수료는 무엇에 따라 달라집니까?",
          "a": "은행 앱의 환전 우대 쿠폰이나 인터넷 환전 예약 여부, 통화와 금액에 따라 현찰 수수료가 달라집니다. 고시 환율과 우대 조건을 함께 확인하면 실제 부담이 얼마인지 가늠할 수 있습니다."
        }
      ]
    }
  },
  "ja": {
    "bitcoin-price-today": {
      "query": "ビットコイン 今いくら",
      "kicker": "暗号資産",
      "lead": "上に表示されているのが、世界の主要取引所で売買されているビットコインの米ドル建て価格です。暗号資産は24時間365日動き続けていて株式のような終値がないため、変化率は「前日比」ではなく、いまからちょうど24時間前の価格と比べた形で示されます。あわせて、韓国の取引所価格が海外よりどれだけ高いかを表す「キムチプレミアム」も確認できます。",
      "faqs": [
        {
          "q": "ビットコインに前日比がないのはなぜですか？",
          "a": "株式市場と違って取引所が閉まる時間がなく、区切りとなる終値が存在しないためです。そのため多くのサイトでは、現在時刻から24時間さかのぼった時点の価格と比べた変化率を表示しています。"
        },
        {
          "q": "取引所によって価格が違うのはなぜですか？",
          "a": "取引所ごとに独立した板（注文の集まり）で売買されているので、需給の差がそのまま価格差として表れます。国をまたぐと送金規制や手数料も加わり、韓国のキムチプレミアムのように差が長く続くこともあります。"
        },
        {
          "q": "円建てだといくらになりますか？",
          "a": "ドル建て価格にそのときのドル円レートを掛ければ、おおよその円換算額になります。国内取引所の円建て価格には、これに各取引所のスプレッドや国内の需給が上乗せされます。"
        }
      ]
    },
    "usd-to-krw-today": {
      "query": "1ドル 何ウォン",
      "kicker": "為替",
      "lead": "上に出ているのが、銀行間で取引されているドルと韓国ウォンの仲値（ミッドマーケットレート）です。仲値は買値と売値のちょうど中間にあたる基準の数値で、ニュースや為替アプリで目にする「今日のレート」はたいていこの水準を指します。実際に両替や送金をすると仲値に手数料分が上乗せされるため、受け取れるウォンは表示より少なくなります。",
      "faqs": [
        {
          "q": "仲値（ミッドマーケットレート）とは何ですか？",
          "a": "金融機関どうしが売買している売値と買値の中間にあたるレートで、為替相場の基準として使われます。個人がこのレートでそのまま両替できるわけではなく、あくまで比較の物差しとなる数値です。"
        },
        {
          "q": "銀行や両替所のレートが仲値より悪いのはなぜですか？",
          "a": "為替の変動リスクや事務コスト、利益分を上乗せしているためで、この差はスプレッドと呼ばれます。同じ日でも銀行、空港、街の両替所で上乗せ幅は変わります。"
        },
        {
          "q": "日本円から韓国ウォンに替えるときはどう見ればいいですか？",
          "a": "日本では韓国ウォンを「100ウォン＝◯円」の形で表示するのが一般的です。円とウォンを直接売買する市場は小さく、実務上はドル円とドルウォンから計算されるクロスレート（合成レート）が基準になります。"
        }
      ]
    },
    "what-is-kimchi-premium": {
      "query": "キムチプレミアムとは",
      "kicker": "暗号資産・韓国",
      "lead": "キムチプレミアムとは、韓国の取引所で売買される暗号資産の価格が海外の取引所より高くなっている状態と、その価格差のことです。韓国国内は個人の売買が活発で需要が強い一方、外貨の持ち出しに関する規制があるため、本来なら裁定取引で埋まるはずの差がすぐには解消しません。上の数値は、韓国価格と海外価格をドルウォンレートで揃えて比べた現在のプレミアム率です。",
      "faqs": [
        {
          "q": "キムチプレミアムはどう計算しますか？",
          "a": "「韓国取引所のウォン建て価格 ÷（海外取引所のドル建て価格 × ドルウォンレート）− 1」で求めます。プラスなら韓国のほうが高く、マイナスなら韓国のほうが安い状態です。"
        },
        {
          "q": "なぜ裁定取引で価格差が消えないのですか？",
          "a": "韓国では外貨送金や暗号資産の取り扱いに規制があり、実名確認済みの銀行口座を通す必要があるなど資金の出入りに制約があるためです。この摩擦があるため、過去の強気相場では50%を超える水準までプレミアムが開いた局面もあったとされます。"
        },
        {
          "q": "マイナスになることもありますか？",
          "a": "あります。韓国価格が海外より安くなる状態は「逆キムチプレミアム」と呼ばれ、相場が急落した局面などで見られます。"
        }
      ]
    },
    "crypto-fear-and-greed-today": {
      "query": "仮想通貨 恐怖・強欲指数 今日",
      "kicker": "市場心理",
      "lead": "暗号資産の恐怖・強欲指数（Fear & Greed Index）は、市場全体のムードを0から100までの一つの数字にまとめた指標です。0に近いほど投資家が恐怖に傾き、100に近いほど強欲、つまり過熱していることを示します。上に出ているのが今日の数値ですが、これは市場の体温を測る目安であって、売買のシグナルではありません。",
      "faqs": [
        {
          "q": "この指数は何をもとに算出されていますか？",
          "a": "一般には価格のボラティリティ、出来高や勢い、SNSでの言及量、ビットコインのドミナンス、検索トレンドなど複数の要素を合成して算出されます。どの要素をどの比重で使うかは提供元によって異なります。"
        },
        {
          "q": "「逆張り指標」と言われるのはなぜですか？",
          "a": "極端な恐怖は売られ過ぎ、極端な強欲は買われ過ぎのサインとして解釈されることが多いためです。ただし極端な水準がそのまま何週間も続くこともあり、水準だけで転換点を当てられるものではありません。"
        },
        {
          "q": "株式のVIX（恐怖指数）とは違うのですか？",
          "a": "違います。VIXはオプション価格から導かれる将来の変動率の予想値ですが、恐怖・強欲指数は複数の市場データを合成した独自のスコアです。"
        }
      ]
    },
    "usd-to-jpy-today": {
      "query": "ドル円 今いくら",
      "kicker": "為替",
      "lead": "上に表示されているのが、いまのドル円レートです。ドル円は日米の金利差に大きく左右され、米国の金利が相対的に高い局面ではドルが買われて円安方向に傾きやすくなります。数字が大きくなるほど円安、小さくなるほど円高で、円安は海外で稼ぐ日本の輸出企業の円換算利益を押し上げる方向に働きます。",
      "faqs": [
        {
          "q": "数字が上がると円安ですか、円高ですか？",
          "a": "円安です。1ドルを買うのに必要な円が増えるということなので、円の価値が下がっている状態を意味します。逆に数字が下がれば円高です。"
        },
        {
          "q": "円安になると日本株が上がりやすいと言われるのはなぜですか？",
          "a": "自動車や電機など海外売上比率の高い企業は、同じドルの売上でも円に換算した金額が増えるため、業績の押し上げ要因になるからです。ただし輸入コストが上がる内需企業には逆に負担となります。"
        },
        {
          "q": "銀行で両替するときのレートと違うのはなぜですか？",
          "a": "銀行は基準となる仲値に手数料を上乗せした売値（TTS）と、仲値から手数料を差し引いた買値（TTB）を提示するためです。ここに表示されているのは、その上乗せや差し引きが入る前の市場実勢のレートです。"
        }
      ]
    },
    "nikkei-225-today": {
      "query": "日経平均 今いくら",
      "kicker": "日本株",
      "lead": "上の数値が、東証プライム上場の主要225銘柄で構成される日経平均株価の現在値です。日経平均は時価総額ではなく株価を足して調整する「株価平均型」の指数なので、会社の規模よりも株価の高い値がさ株の動きが指数全体を大きく揺らします。為替との結び付きも強く、円安は輸出企業の採算改善を通じて日経平均の支えになりやすいとされ、円高では逆方向に働きます。",
      "faqs": [
        {
          "q": "日経平均とTOPIXは何が違いますか？",
          "a": "日経平均は選ばれた225銘柄の株価を平均する株価平均型、TOPIXは東証の広範な銘柄を時価総額で加重した指数です。そのため日経平均は値がさ株、TOPIXは時価総額の大きい銘柄の影響を受けやすくなります。"
        },
        {
          "q": "なぜ一部の銘柄で指数が大きく動くのですか？",
          "a": "株価平均型では、株価が高い銘柄ほど1円の変動が指数に与える影響が大きくなるためです。時価総額が小さくても株価が高ければ、指数への寄与度は大きくなります。"
        },
        {
          "q": "日経平均の取引時間はいつですか？",
          "a": "東京証券取引所の現物取引は平日の前場9時から11時30分、後場12時30分から15時30分です。日経平均先物は夜間も取引されているため、時間外の値動きの目安として見られます。"
        }
      ]
    },
    "kospi-today": {
      "query": "KOSPI 今日の株価",
      "kicker": "韓国株",
      "lead": "上に出ているのが、韓国を代表する株価指数であるKOSPIと、新興企業中心のKOSDAQの現在値です。KOSPIは韓国取引所の主要市場を時価総額で加重した指数で、サムスン電子やSKハイニックスといった半導体大手の比重が大きいのが特徴です。そのため韓国株はメモリ価格や世界のIT需要という半導体サイクルに沿って動きやすく、世界景気の先行指標として見られることもあります。",
      "faqs": [
        {
          "q": "KOSPIとKOSDAQはどう違いますか？",
          "a": "KOSPIは大企業が中心の主要市場、KOSDAQはバイオやゲーム、部品メーカーなど新興企業が中心の市場です。日本でいえばプライム市場とグロース市場のような関係にあたります。"
        },
        {
          "q": "韓国株はなぜ半導体に左右されるのですか？",
          "a": "サムスン電子とSKハイニックスの2社だけで指数に占める比重が非常に大きく、韓国の輸出全体でも半導体が最大の品目だからです。メモリ価格の上下がそのまま指数の方向を決めやすくなります。"
        },
        {
          "q": "韓国市場の取引時間は日本と同じですか？",
          "a": "韓国と日本は同じ時間帯なので、時差を気にせず見られます。取引は現地時間の9時から15時30分までで、日本時間でも同じ時刻です。"
        }
      ]
    },
    "sp500-today": {
      "query": "S&P500 今いくら",
      "kicker": "米国株",
      "lead": "上に並んでいるのが、米国を代表する三つの指数、S&P500、ナスダック総合指数、そしてNYダウの現在値です。S&P500は主要500社を時価総額で加重した指数で、米国株式市場全体の姿を映す物差しとして最も広く使われています。ナスダック総合はナスダック上場の全銘柄を対象とするためハイテク色が濃く、ダウは30銘柄の株価平均型と、それぞれ作りが違う点を押さえておくと読み方が変わります。",
      "faqs": [
        {
          "q": "S&P500、ナスダック、ダウの違いは何ですか？",
          "a": "S&P500は500社を時価総額加重した指数、ナスダック総合はナスダック上場の全銘柄を対象にした指数でハイテク比率が高く、ダウは30銘柄を株価の平均で算出する指数です。作り方が違うため、同じ日でも上げ下げの幅がそろわないことがあります。"
        },
        {
          "q": "米国市場の取引時間は日本時間で何時ですか？",
          "a": "米国東部時間の9時30分から16時が取引時間で、日本時間では夏時間なら22時30分から翌5時、冬時間なら23時30分から翌6時にあたります。この前後には時間外取引もあります。"
        },
        {
          "q": "米国株全体の動きを見るならどの指数ですか？",
          "a": "一般にはS&P500が使われます。500社で米国上場株の時価総額の大部分をカバーしており、30銘柄のダウよりも市場全体の姿に近いとされるためです。"
        }
      ]
    },
    "gold-price-today": {
      "query": "金価格 1オンス いくら",
      "kicker": "コモディティ",
      "lead": "上に表示されている金価格は、国際市場で取引されている金のドル建て価格で、単位は1トロイオンスあたりです。トロイオンスは貴金属に使う専用の重さの単位で約31.1グラムにあたり、日本の店頭でよく見る「1グラムあたり何円」とは基準が違います。金は世界共通の商品として米ドルで値決めされるため、ドルの強弱そのものが価格の見え方に影響します。",
      "faqs": [
        {
          "q": "1トロイオンスは何グラムですか？",
          "a": "約31.1035グラムです。食品などに使う常用オンス（約28.35グラム）とは別の単位なので、グラム換算するときは取り違えないよう注意が必要です。"
        },
        {
          "q": "日本の店頭価格と数字が合わないのはなぜですか？",
          "a": "国内の小売価格は、ドル建ての国際価格を円に換算したうえで、業者の手数料や地金の加工費、消費税を加えた「1グラムあたりの円価格」だからです。そのため為替が動くだけでも国内価格は変わります。"
        },
        {
          "q": "金がドル建てで表示されるのはなぜですか？",
          "a": "国際的な取引の基準通貨がドルで、ロンドンやニューヨークの市場がドル建てで値決めをしているためです。ドルの価値と金の価格は逆方向に動きやすいとされ、ドル建て価格と自国通貨建て価格では見え方が変わります。"
        }
      ]
    },
    "samsung-electronics-stock-price": {
      "query": "サムスン電子 株価",
      "kicker": "韓国株",
      "lead": "上に表示されているのがサムスン電子の株価で、単位は韓国ウォンです。時価総額はKOSPIのなかで最大で、指数に占める比重が非常に高いため、この1銘柄の動きが韓国株式市場全体の方向を左右することも珍しくありません。事業はDRAMやNANDといったメモリ半導体のほかスマートフォンやディスプレーなど幅広く、なかでもメモリ価格が上下する半導体サイクルが業績と株価に強く効きます。",
      "faqs": [
        {
          "q": "サムスン電子の株価がKOSPIと連動しやすいのはなぜですか？",
          "a": "KOSPIは時価総額加重の指数で、サムスン電子1社の比重が突出して大きいためです。指数を買う海外資金の売買もこの銘柄に集中しやすく、両者の動きは似た形になりがちです。"
        },
        {
          "q": "「サムスン電子優先株」とは何ですか？",
          "a": "議決権がない代わりに配当が優遇される株式で、普通株とは別の銘柄として韓国市場に上場しています。同じ会社でも株価水準や値動きは普通株と一致しません。"
        },
        {
          "q": "日本から売買できますか？",
          "a": "韓国株を取り扱っている国内の証券会社を通じて売買できる場合があります。取扱いの有無、手数料、為替の扱いは会社ごとに異なるため、口座を持っている証券会社の条件を確認してください。"
        }
      ]
    },
    "nvidia-stock-price-today": {
      "query": "エヌビディア 株価 今",
      "kicker": "米国株",
      "lead": "上の数値が、エヌビディア（ティッカー: NVDA、ナスダック上場）の米ドル建て株価です。AI向けGPUを手がける半導体メーカーで時価総額が大きく、同社の値動きが米国ハイテク株全体のムードに波及することもあります。過去に実施された株式分割はチャートに遡って調整済みなので、分割の前後で株価が不自然に飛んで見えることはありません。",
      "faqs": [
        {
          "q": "株式分割はチャートにどう反映されていますか？",
          "a": "分割比率に合わせて過去の株価を割り戻した「調整後株価」で表示されるため、線が途切れずにつながります。したがってチャート上の過去の水準は、当時実際に取引されていた価格そのものではありません。"
        },
        {
          "q": "円換算するといくらになりますか？",
          "a": "ドル建て株価にそのときのドル円レートを掛ければ目安が出ます。米国株は株価の変動に加えて為替の変動も円建ての損益に効いてくる点が、日本株との違いです。"
        },
        {
          "q": "決算はいつ発表されますか？",
          "a": "四半期ごとに発表され、1月末を本決算とする決算期のため、例年2月・5月・8月・11月ごろの発表となります。決算の前後は値動きが大きくなりやすい時期です。"
        }
      ]
    },
    "ethereum-price-today": {
      "query": "イーサリアム 今いくら",
      "kicker": "暗号資産",
      "lead": "上に表示されているのがイーサリアム（ETH）の米ドル建て価格です。ビットコインが「デジタルの価値の保存手段」として語られるのに対し、イーサリアムはスマートコントラクトを動かす基盤で、DeFiやNFT、多くのステーブルコインがこのネットワーク上で稼働しています。ETHはその利用料（ガス代）を支払うための燃料でもあり、ネットワークが使われるほど需要が生まれる設計になっています。",
      "faqs": [
        {
          "q": "ビットコインとイーサリアムは何が違いますか？",
          "a": "ビットコインは発行上限のある決済・価値保存を目的としたシンプルな設計ですが、イーサリアムはプログラム（スマートコントラクト）を実行できる基盤として作られています。用途が違うため、同じ暗号資産でも値動きの理由が一致しないことがあります。"
        },
        {
          "q": "ガス代とは何ですか？",
          "a": "イーサリアム上で送金やスマートコントラクトを実行する際に支払う手数料で、ETHで支払います。ネットワークが混雑するほど高くなり、負担を下げるためにレイヤー2と呼ばれる別ネットワークが使われることもあります。"
        },
        {
          "q": "ETHに発行上限はありますか？",
          "a": "ビットコインの2100万枚のような固定の上限はありません。ただし手数料の一部を焼却（バーン）する仕組みがあり、利用が活発な時期には新規発行を上回って供給が減ることもあります。"
        }
      ]
    },
    "bitcoin-vs-gold": {
      "query": "ビットコインと金 比較",
      "kicker": "比較",
      "lead": "ビットコインと金はどちらも「法定通貨の外にある資産」として語られますが、値動きの性格はかなり違います。上では同じ期間の両者の推移を並べて、実際にどちらがどれだけ動いてきたかを比べられます。金は中央銀行も保有する歴史の長い資産で値動きが比較的落ち着いており、ビットコインは供給量に上限がある一方で歴史が浅く値動きが荒い、と整理すると違いが見えやすくなります。",
      "faqs": [
        {
          "q": "どちらがインフレヘッジとして優れていますか？",
          "a": "性格が異なるため一概には言えません。金はインフレ局面での実績が長い一方、ビットコインは登場から日が浅く、株式などのリスク資産と同じ方向に動く場面も繰り返し見られてきました。"
        },
        {
          "q": "値動きの荒さはどれくらい違いますか？",
          "a": "ビットコインは金に比べて変動幅が桁違いに大きく、過去のサイクルでは高値から半分以下の水準まで下げる局面も何度かありました。金にも上下はありますが、同じ期間での振れ幅はずっと小さいのが通例です。"
        },
        {
          "q": "ビットコインが「デジタルゴールド」と呼ばれるのはなぜですか？",
          "a": "発行上限が2100万枚と決まっていて、新規発行が半減期ごとに減っていく希少性の設計が金に例えられるためです。ただし取引時間や流動性、価格の安定度、実物としての用途は大きく異なります。"
        }
      ]
    },
    "how-much-is-100-dollars-in-won": {
      "query": "100ドル 韓国ウォン いくら",
      "kicker": "為替",
      "lead": "上に出ているのが、100米ドルをいまの仲値（ミッドマーケットレート）で韓国ウォンに換算した金額です。仲値は銀行間取引の中間にあたる基準のレートで、実際に空港や両替所でドルをウォンに替えると手数料が差し引かれるため、手元に残る金額はこれより少なくなります。ほかの金額を知りたいときは、表示されているドルウォンレートに換算したいドル額を掛ければ計算できます。",
      "faqs": [
        {
          "q": "実際に両替してもこの金額になりますか？",
          "a": "なりません。銀行や両替所はレートに手数料分を上乗せするため、受け取れるウォンは仲値換算より少なくなります。上乗せ幅は店舗や日によって変わります。"
        },
        {
          "q": "空港と市内、どちらで両替するほうが有利ですか？",
          "a": "一般には市内の両替所のほうが上乗せ幅が小さく、空港は利便性の分だけ条件が不利になりやすいと言われます。実際の条件はその日と店舗で異なるので、提示レートを確認してから両替してください。"
        },
        {
          "q": "100ウォンは日本円でいくらですか？",
          "a": "日本では韓国ウォンを「100ウォン＝◯円」の形で表示するのが一般的です。円とウォンを直接売買する市場は小さく、実務上はドル円とドルウォンから計算されるクロスレートが基準になります。"
        }
      ]
    }
  }
};
