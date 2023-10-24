export function sleep(ms = 2000): Promise<void> {
  console.log("Kindly remember to remove `sleep`");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getKeyByValue<
  KeyType extends string | number | symbol,
  ValueType
>(object: Record<KeyType, ValueType>, value: ValueType): KeyType | undefined {
  return (Object.keys(object) as (keyof typeof object)[]).find(
    (key) => object[key] === value
  );
}

export function addHttpsToURL(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url.trim();
  }
  return `https://${url.trim()}`;
}
