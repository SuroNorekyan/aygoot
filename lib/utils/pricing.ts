const MS_PER_DAY = 1000 * 60 * 60 * 24;

type HouseRates = {
  priceWorkdaysAmd: number;
  priceWeekdaysAmd: number;
};

const isWeekendNight = (date: Date) => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

export const getNightlyRateAmd = (date: Date, rates: HouseRates) =>
  isWeekendNight(date) ? rates.priceWeekdaysAmd : rates.priceWorkdaysAmd;

export const calculateStayTotalAmd = (
  checkIn: Date,
  checkOut: Date,
  rates: HouseRates,
) => {
  const nights = Math.max(
    1,
    Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY),
  );
  let total = 0;

  for (let offset = 0; offset < nights; offset += 1) {
    total += getNightlyRateAmd(
      new Date(checkIn.getTime() + offset * MS_PER_DAY),
      rates,
    );
  }

  return total;
};
