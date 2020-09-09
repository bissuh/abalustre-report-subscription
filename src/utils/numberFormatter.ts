/* Currency Filters */
interface FormatterOptions {
  value: number;
  divisor?: number;
  type?: string;
  locale: string;
  digits?: number;
  unit?: string;
  nullValue?: string;
  minFraction?: number;
  maxFraction?: number;
}

interface ConfigFormatter {
  style?: string;
  currency?: string;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

const currency = {
  /**
   * Format Currency
   *
   * @param [value]   Value
   * @param [divisor] Divisor
   * @param [type]    Currency Type
   * @param [local]   Currency Locale
   *
   * @return {string}
   */
  format: ({
    value = 0,
    divisor = 100,
    type,
    unit,
    locale = 'en-US',
    minFraction = 0,
    maxFraction = 20,
    nullValue = '',
  }: FormatterOptions): string => {
    if (!value) return nullValue;

    const config: ConfigFormatter = {};

    config.minimumFractionDigits = minFraction;
    config.maximumFractionDigits = maxFraction;

    if (type) {
      config.style = 'currency';
      config.currency = type;
    }

    if (unit) {
      config.style = unit;
    }

    return new Intl.NumberFormat(locale, config).format(
      (typeof value === 'number' ? value : 0) /
        (typeof divisor === 'number' ? divisor : 100)
    );
  },
};

/* Export filters */
export const numberFilters = {
  format: currency.format,
};
