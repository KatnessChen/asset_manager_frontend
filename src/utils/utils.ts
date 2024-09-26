import { ValueType } from "recharts/types/component/DefaultTooltipContent";

export const formatNumberWithComma = (value: ValueType) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
