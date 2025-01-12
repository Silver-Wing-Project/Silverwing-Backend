export const errorMessages = {
    // StockPrice CRUD operations
    FAILED_TO_CREATE_STOCK_PRICE: 'Failed to create stock price',
    FAILED_TO_CREATE_MANY_STOCK_PRICES: 'Failed to create many stock prices',
    FAILED_TO_GET_ALL_STOCK_PRICES: 'Error getting all stock prices',
    FAILED_TO_GET_MANY_STOCK_PRICES: 'Error getting many stock prices',
    FAILED_TO_GET_STOCK_PRICE_BY_ID: 'Error getting stock price by id',
    FAILED_TO_UPDATE_STOCK_PRICE: 'Error updating stock price',
    FAILED_TO_DELETE_STOCK_PRICE: 'Error deleting stock price',
    FAILED_TO_DELETE_MANY_STOCK_PRICES: 'Error deleting many stock prices',

    // StockPrice Parameters
    MISSING_QUERY_PARAMS_PRICE: 'Missing required query parameters: ticker, startDate, endDate',
    MISSING_CREATE_STOCK_PRICE_DTO: 'Missing required body parameter: createStockPriceDto',
    MISSING_UPDATE_STOCK_PRICE_DTO: 'Missing required body parameter: updateStockPriceDto or _id',
    
    // ID parameters
    MISSING_ID_PARAM: 'Missing required parameter: _id',
    MISSING_IDS_PARAM: 'Missing required parameter: ids',

    // StockReport CRUD operations
    FAILED_TO_CREATE_STOCK_REPORT: 'Failed to create stock report',
    FAILED_TO_CREATE_MANY_STOCK_REPORTS: 'Failed to create many stock reports',
    FAILED_TO_GET_ALL_STOCK_REPORTS: 'Error getting all stock reports',
    FAILED_TO_GET_MANY_STOCK_REPORTS: 'Error getting many stock reports',
    FAILED_TO_GET_STOCK_REPORT_BY_ID: 'Error getting stock report by id',
    FAILED_TO_UPDATE_STOCK_REPORT: 'Error updating stock report',
    FAILED_TO_DELETE_STOCK_REPORT: 'Error deleting stock report',
    FAILED_TO_DELETE_MANY_STOCK_REPORTS: 'Error deleting many stock reports',

    // StockReport Parameters
    MISSING_QUERY_PARAMS_REPORT: 'Missing required query parameters: ticker, reportType',
    MISSING_CREATE_STOCK_REPORT_DTO: 'Missing required body parameter: createStockReportDto',
    MISSING_UPDATE_STOCK_REPORT_DTO: 'Missing required body parameter: updateStockReportDto or _id',
};