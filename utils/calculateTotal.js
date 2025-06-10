export default function calculateTotal(items) {
  if (!Array.isArray(items)) return 0;

  return items.reduce((sum, item) => {
    return sum + (item.qty * item.price || 0);
  }, 0);
}
