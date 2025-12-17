export type Lang = "en" | "ar";
export const defaultLang: Lang = "en";

export function isLang(v: any): v is Lang {
  return v === "en" || v === "ar";
}

export const t = (lang: Lang) => {
  const dict = {
    en: {
      all: "All Products",
      firewoods: "Firewoods",
      other: "Other Products",
      addToCart: "Add to cart",
      orderNow: "Order now",
      checkout: "Checkout",
      cart: "Cart",
      search: "Search",
      inStockOnly: "In stock only",
      outOfStock: "Out of stock",
      deliveryNotes: "Delivery notes (optional)",
      qty: "Qty",
      emptyCart: "Your cart is empty.",
      continueShopping: "Continue shopping",
      admin: "Admin",
      delete: "Delete",
    },
    ar: {
      all: "كل المنتجات",
      firewoods: "حطب",
      other: "منتجات أخرى",
      addToCart: "أضف للسلة",
      orderNow: "اطلب الآن",
      checkout: "إتمام الطلب",
      cart: "السلة",
      search: "بحث",
      inStockOnly: "المتوفر فقط",
      outOfStock: "غير متوفر",
      deliveryNotes: "ملاحظات التوصيل (اختياري)",
      qty: "الكمية",
      emptyCart: "السلة فارغة.",
      continueShopping: "متابعة التسوق",
      admin: "لوحة التحكم",
      delete: "حذف",
    },
  } as const;

  return dict[lang];
};

export function dir(lang: Lang) {
  return lang === "ar" ? "rtl" : "ltr";
}
