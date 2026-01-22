## Remove StockPriceModule from FinanceModule

`StockPriceModule` is not part of the core flow of the project, now at this stage.
Stock prices are intentionally out of the core domain at this stage. They’ll be introduced later when valuation and trend analysis become part of the product.

Is `StockPriceModule / Controller / Service / Repository` really needed right now?
Short answer: **No**. _Not right now_.

Professional answer:
Currently the Core Value of your system is:
Created by an external pipeline (Python). Python scripts fetch yfinance data.
Based on financial reports. StockReportService save it to MongoDB.
Calculating Big Five
in **future** - use the BigFive to calculate _real intrinstic value_ of a stock.

📌 StockPrice is not part of the core flow right now
It is:
Does not feed the analysis
Does not affect Big Five
Not part of decision making

**Action**:
Removing `StockPriceModule` from `FinanceModule` (by extension, from `AppModule`).

## Stock Price (Future Scope)

This module is intentionally not part of the runtime application.
It will be activated once price-based valuation and trend analysis
become part of the core domain.
