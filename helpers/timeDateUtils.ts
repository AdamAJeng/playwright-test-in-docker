//─ Set start date, set range in days for end date  ─────//
export function getDateRangePlusDays(base: string, daysToAdd: number) {
  const startDate = new Date(base);
  const endDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedEndDate = endDate.toISOString().split('T')[0];

  return {
    startDate,
    endDate,
    formattedStartDate,
    formattedEndDate,
  };
}
