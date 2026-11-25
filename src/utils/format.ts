/**
 * 금액을 `$1,234.56` 형태로 표시합니다.
 * Vue 2의 `{{ value | currency }}` 필터를 대체합니다 (Vue 3에서 필터는 제거됨).
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}
