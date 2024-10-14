/**
 * 數字轉換成金額格式
 * @param { Number } num - 數字
 * @returns { String } - 金額
 * @example
 * currency(1000); // 1,000
 */
export function currency(num) {
  const n = parseInt(num, 10);
  return `${n.toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c))}`;
}

/**
 * 日期格式化
 * @param { Number } time - 時間戳記
 * @returns { String } - 日期
 * @example
 * date(1627737600); // 2021/7/31
 */
export function date(time) {
  const localDate = new Date(time * 1000);
  return localDate.toLocaleDateString();
}
