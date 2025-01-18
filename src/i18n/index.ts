import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      navigation: {
        menu: {
          pos: 'Point of Sale',
          inventory: 'Inventory',
          orders: 'Orders',
          categories: 'Categories',
          brands: 'Brands',
          suppliers: 'Suppliers'
        }
      },
      common: {
        search: 'Search',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        actions: 'Actions',
        name: 'Name',
        error: 'Error',
        confirmDelete: 'Are you sure you want to delete this item?'
      },
      cart: {
        title: 'Current Order',
        empty: 'Cart is empty',
        remove: 'Remove item',
        subtotal: 'Subtotal',
        discount: 'Discount',
        total: 'Total',
        addDiscount: 'Add Discount',
        hideDiscount: 'Hide Discount',
        percentage: 'Percentage',
        fixed: 'Fixed Amount',
        processCheckout: 'Process Payment',
        confirmCheckout: 'Confirm checkout?',
        priceEach: 'each'
      },
      inventory: {
        title: 'Inventory Management',
        addProduct: 'Add Product',
        editProduct: 'Edit Product',
        productName: 'Product Name',
        productDescription: 'Description',
        brand: 'Brand',
        modelNumber: 'Model Number',
        supplier: 'Supplier',
        category: 'Category',
        buyingPrice: 'Buying Price',
        sellingPrice: 'Selling Price',
        stock: 'Current Stock',
        selectBrand: 'Select Brand',
        selectSupplier: 'Select Supplier',
        selectCategory: 'Select Category',
        requiredFields: 'Please fill in all required fields',
        saveFailed: 'Failed to save product',
        deleteFailed: 'Failed to delete product',
        confirmDelete: 'Are you sure you want to delete this product?',
        searchProducts: 'Search products...',
        noProductsFound: 'No products found'
      }
    }
  },
  ta: {
    translation: {
      navigation: {
        menu: {
          pos: 'விற்பனை முனையம்',
          inventory: 'சரக்கு',
          orders: 'ஆர்டர்கள்',
          categories: 'வகைகள்',
          brands: 'பிராண்டுகள்',
          suppliers: 'விநியோகஸ்தர்கள்'
        }
      },
      common: {
        search: 'தேடு',
        add: 'சேர்',
        edit: 'திருத்து',
        delete: 'அழி',
        save: 'சேமி',
        cancel: 'ரத்து செய்',
        actions: 'செயல்கள்',
        name: 'பெயர்',
        error: 'பிழை',
        confirmDelete: 'இதை நிச்சயமாக நீக்க வேண்டுமா?'
      },
      cart: {
        title: 'தற்போதைய ஆர்டர்',
        empty: 'கார்ட் காலியாக உள்ளது',
        remove: 'பொருளை நீக்கு',
        subtotal: 'மொத்தம்',
        discount: 'தள்ளுபடி',
        total: 'இறுதி தொகை',
        addDiscount: 'தள்ளுபடி சேர்',
        hideDiscount: 'தள்ளுபடியை மறை',
        percentage: 'சதவீதம்',
        fixed: 'நிலையான தொகை',
        processCheckout: 'பணம் செலுத்து',
        confirmCheckout: 'பணம் செலுத்துவதை உறுதி செய்யவா?',
        priceEach: 'ஒன்றுக்கு'
      },
      inventory: {
        title: 'சரக்கு மேலாண்மை',
        addProduct: 'புதிய பொருள் சேர்',
        editProduct: 'பொருளை திருத்து',
        productName: 'பொருளின் பெயர்',
        productDescription: 'விளக்கம்',
        brand: 'பிராண்ட்',
        modelNumber: 'மாடல் எண்',
        supplier: 'விநியோகஸ்தர்',
        category: 'வகை',
        buyingPrice: 'வாங்கும் விலை',
        sellingPrice: 'விற்கும் விலை',
        stock: 'கையிருப்பு',
        selectBrand: 'பிராண்டைத் தேர்ந்தெடுக்கவும்',
        selectSupplier: 'விநியோகஸ்தரைத் தேர்ந்தெடுக்கவும்',
        selectCategory: 'வகையைத் தேர்ந்தெடுக்கவும்',
        requiredFields: 'அனைத்து தேவையான தகவல்களையும் பூர்த்தி செய்யவும்',
        saveFailed: 'பொருளை சேமிக்க முடியவில்லை',
        deleteFailed: 'பொருளை நீக்க முடியவில்லை',
        confirmDelete: 'இந்த பொருளை நிச்சயமாக நீக்க வேண்டுமா?',
        searchProducts: 'பொருட்களைத் தேடுங்கள்...',
        noProductsFound: 'பொருட்கள் எதுவும் கிடைக்கவில்லை'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ta'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;