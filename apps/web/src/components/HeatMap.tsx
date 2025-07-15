import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/ui/tooltip';
import { HeatMapType } from '@web/utils/types';
import { useCallback, useMemo, useState } from 'react';
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';

const DATA_TYPES = [
  { value: 'lessons', label: 'Lessons' },
  { value: 'xp', label: 'XP' },
  { value: 'screens', label: 'Screens' }
] as const;

type DataType = (typeof DATA_TYPES)[number]['value'];

const THRESHOLDS = {
  lessons: [1, 3, 5, 10],
  screens: [1, 15, 25, 35],
  xp: [1, 200, 500, 2000]
} as const;

const generateDateRange = (start: Date, end: Date): string[] => {
  const dates: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const HeatMap = ({ heatmap }: { heatmap: HeatMapType }) => {
  const [dataType, setDataType] = useState<DataType>('lessons');

  const endDate = useMemo(() => new Date(), []);

  const startDate = useMemo(() => {
    const d = new Date(endDate);
    d.setDate(d.getDate() - 182);
    return d;
  }, [endDate]);

  const allDates = useMemo(() => generateDateRange(startDate, endDate), [startDate, endDate]);

  const values = useMemo(
    () =>
      allDates.map((date) => ({
        date,
        count: heatmap.heatmapData?.[date]?.[dataType] ?? 0
      })),
    [allDates, heatmap.heatmapData, dataType]
  );

  const getClassForValue = useCallback(
    (value: { date: string; count?: number } | undefined) => {
      if (!value || !value.count) return 'color-scale-0';
      const [t1, t2, t3, t4] = THRESHOLDS[dataType];
      if (value.count >= t4) return 'color-scale-4';
      if (value.count >= t3) return 'color-scale-3';
      if (value.count >= t2) return 'color-scale-2';
      if (value.count >= t1) return 'color-scale-1';
      return 'color-scale-0';
    },
    [dataType]
  );

  if (!heatmap) return null;

  return (
    <>
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl">Recent Activity</h1>
        <Select value={dataType} onValueChange={(value) => setDataType(value as DataType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            {DATA_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={getClassForValue}
        transformDayElement={(element, value, index) => {
          const dateLabel = new Date(value?.date || '').toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long'
          });
          const countLabel =
            value?.count && value.count > 0 ? `${value.count} ${dataType === 'xp' ? 'XP' : dataType}` : 'No activity';
          return (
            <Tooltip key={index} delayDuration={300}>
              <TooltipTrigger asChild>{React.cloneElement(element as React.ReactElement)}</TooltipTrigger>
              <TooltipContent className="text-sm">{`${dateLabel}: ${countLabel}`}</TooltipContent>
            </Tooltip>
          );
        }}
      />
    </>
  );
};

export default HeatMap;
