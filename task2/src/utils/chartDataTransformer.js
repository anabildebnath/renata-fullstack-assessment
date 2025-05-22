export const transformChartData = (rawData = []) => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return {
      pieData: [{ name: 'No Data', value: 100 }],
      lineData: {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data',
          data: [0],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      divisionData: new Map(),
      rawData: []
    };
  }

  // Process divisions
  const divisionData = rawData.reduce((acc, item) => {
    const division = item.Division || 'Unknown';
    acc.set(division, (acc.get(division) || 0) + 1);
    return acc;
  }, new Map());

  // Transform for pie chart
  const pieData = Array.from(divisionData, ([name, value]) => ({ name, value }));

  // Transform for line chart
  const lineData = {
    labels: Array.from(divisionData.keys()),
    datasets: [{
      label: 'Distribution by Division',
      data: Array.from(divisionData.values()),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return {
    pieData,
    lineData,
    divisionData,
    rawData
  };
};
