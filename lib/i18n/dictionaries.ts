export type Lang = "ru" | "kk";

export const LANG_COOKIE = "lang";
export const DEFAULT_LANG: Lang = "ru";

// Переводы организованы по разделам сайта — так проще найти нужную
// строку и не потерять контекст при добавлении новых страниц. Казахский
// перевод выполнен машинным способом (грамматически корректный), стоит
// попросить носителя языка сверить формулировки перед официальным
// запуском казахской версии.
const dictionaries = {
  ru: {
    common: {
      priceCurrency: "₸",
      loading: "Загрузка…",
      more: "Показать ещё",
      reset: "Сбросить",
      apply: "Применить",
      close: "Закрыть",
      back: "Назад",
      home: "Главная",
    },
    header: {
      catalog: "Каталог",
      cabinet: "Кабинет",
      login: "Войти",
    },
    footer: {
      tagline: "Аксессуары из натуральной кожи, изготовленные вручную, небольшими партиями и на заказ.",
      catalog: "Каталог",
      shop: "Магазин",
      cabinet: "Личный кабинет",
      cart: "Корзина",
      about: "О бренде",
      contact: "Контакты",
      madeToOrder: "Изготовление под заказ",
      country: "Казахстан",
    },
    home: {
      heroEyebrow: "Ручная работа · Под заказ · Казахстан",
      heroTitleLine1: "Кожа, которая",
      heroTitleLine2: "служит десятилетиями",
      heroText:
        "TATANKA — кошельки, портмоне, сумки и другие аксессуары из натуральной кожи растительного дубления. Каждое изделие вырезано, прошито и собрано вручную под ваш заказ.",
      viewCatalog: "Смотреть каталог",
      aboutBrand: "О бренде",
      approachEyebrow: "Наш подход",
      brandTitle:
        "Татанка — древнее слово для бизона: сила, выносливость, материал, который веками служил людям.",
      brandText:
        "Мы работаем с кожей растительного дубления небольшими партиями и по индивидуальным размерам. Никакого конвейера — каждое изделие проходит через руки одного мастера, от раскроя до финальной прошивки.",
      viewItems: "Смотреть изделия",
      assortmentEyebrow: "Каталог",
      assortmentTitle: "Ассортимент",
      newArrivals: "Новинки",
      emptySection: "В этом разделе пока нет товаров.",
      wholeCatalog: "Весь каталог",
      allInSection: (name: string) => `Все товары раздела «${name}»`,
    },
    catalog: {
      eyebrow: "Каталог",
      title: "Все изделия",
      typeFilter: "Тип",
      allTypes: "Все типы",
      genderFilter: "Для кого",
      anyGender: "Для него/неё — любой",
      men: "Для него",
      women: "Для неё",
      unisex: "Унисекс",
      materialFilter: "Материал",
      anyMaterial: "Любой материал",
      colorFilter: "Цвет",
      anyColor: "Любой цвет",
      priceFrom: "Цена, ₸:",
      from: "от",
      to: "до",
      resetFilters: "Сбросить фильтры",
      empty: "По этому фильтру пока ничего не нашлось.",
      categoryEmpty: "В этом разделе пока нет товаров — загляните позже.",
    },
    product: {
      madeToOrder: "Под заказ",
      leadTimeDays: (days: number) => `~${days} дней`,
      material: "Материал",
      color: "Цвет",
      forWhom: "Для кого",
      quantity: "Количество",
      addToCart: "В корзину",
      buy: "Купить",
      added: "В корзине",
      customizationLabel: "Пожелания к заказу",
      customizationPlaceholder: "Например: размер, цвет, гравировка на изделии",
      photoSoon: "Фото скоро",
      removeFromFavorites: "Убрать из избранного",
      addToFavorites: "Добавить в избранное",
      customizationFullLabel: "Пожелания к изделию (размер, цвет, гравировка)",
      decreaseQty: "Уменьшить количество",
      increaseQty: "Увеличить количество",
      addToCartFull: "Добавить в корзину",
      goToCart: "Перейти в корзину",
      favoritesTitle: "Избранное",
      favoritesEmpty: "В избранном пока пусто",
      favoritesEmptyHint: "Нажмите на сердечко на карточке товара, чтобы сохранить его сюда.",
      remove: "Убрать",
    },
    cart: {
      title: "Корзина",
      empty: "Корзина пуста",
      toCatalog: "В каталог",
      remove: "Удалить",
      total: "Итого",
      checkout: "Оформить заказ",
      customization: "Пожелания",
    },
    checkout: {
      title: "Оформление заказа",
      contactName: "Имя получателя",
      contactPhone: "Телефон",
      contactEmail: "Email",
      deliveryCity: "Город",
      deliveryAddress: "Адрес доставки",
      comment: "Комментарий к заказу",
      commentPlaceholder: "Необязательно",
      orderSummary: "Ваш заказ",
      submit: "Оформить и перейти к оплате",
      submitting: "Оформляем…",
      loginRequired: "Требуется авторизация",
      payTitle: "Оплата заказа",
      payButton: "Оплатить через Robokassa",
      redirecting: "Переходим к оплате…",
      successTitle: "Оплата прошла успешно",
      successOrder: (num: string, sum: string) => `Заказ №${num} на сумму ${sum} ₸ оплачен.`,
      successFallback:
        "Спасибо! Как только оплата будет подтверждена, статус заказа обновится в личном кабинете.",
      successNote: "Мы начнём изготовление вашего изделия и свяжемся с вами по указанным контактам.",
      myOrders: "Мои заказы",
      failTitle: "Оплата не прошла",
      failText: "Платёж не был завершён. Попробуйте ещё раз или свяжитесь с нами, если проблема повторяется.",
      tryAgain: "Попробовать снова",
      alreadyPaid: "Заказ уже оплачен.",
      orderSum: (num: string) => `Заказ №${num} на сумму`,
    },
    contact: {
      eyebrow: "Связаться с нами",
      title: "Контакты",
      phone: "Телефон",
      whatsapp: "WhatsApp",
      email: "Email",
      address: "Адрес",
      workingHours: "Часы работы",
      comingSoon: "Контактные данные скоро появятся здесь.",
      questionTitle: "Есть вопрос по заказу?",
      questionText:
        "Быстрее всего мы ответим в переписке в личном кабинете — там же видна вся история по вашим заказам.",
      writeInCabinet: "Написать в личном кабинете",
      loginAndWrite: "Войти и написать",
    },
    account: {
      title: "Личный кабинет",
      signOut: "Выйти",
      tabProfile: "Профиль",
      tabOrders: "Последние заказы",
      tabFeedback: "Обратная связь",
      tabAdmin: "Управление магазином",
      name: "Имя",
      phone: "Телефон",
      email: "Email",
      recentOrders: "Последние заказы",
      allOrders: "Все заказы",
      noOrders: "У вас пока нет заказов.",
      orderNumber: (num: number) => `Заказ №${num}`,
      feedbackTitle: "Обратная связь",
      feedbackText: "Есть вопрос по заказу или изделию? Напишите нам — отвечаем обычно в течение дня.",
    },
    install: {
      button: "Установить приложение",
      iosHint: "Установить на телефон: в Safari нажмите «Поделиться» → «На экран «Домой»»",
    },
    auth: {
      loginTitle: "Вход в кабинет",
      registerTitle: "Регистрация",
      name: "Имя",
      phone: "Телефон",
      phonePlaceholder: "+7 7__ ___ __ __",
      email: "Email",
      password: "Пароль",
      forgotPassword: "Забыли пароль?",
      pleaseWait: "Подождите…",
      login: "Войти",
      register: "Зарегистрироваться",
      noAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      forgotTitle: "Восстановление пароля",
      forgotHint: "Укажите email — пришлём ссылку для сброса пароля.",
      sendLink: "Отправить ссылку",
      sending: "Отправляем…",
      rememberedPassword: "Вспомнили пароль?",
      checkEmailTitle: "Проверьте почту",
      resetTitle: "Новый пароль",
      newPassword: "Новый пароль",
      savePassword: "Сохранить пароль",
      saving: "Сохраняем…",
      passwordChangedTitle: "Пароль изменён",
      redirecting: "Переносим вас в личный кабинет…",
      checkingLinkTitle: "Проверяем ссылку…",
      checkingLinkText: "Если страница долго не открывается — возможно, ссылка из письма устарела.",
      requestNew: "Запросить новую",
      checkEmailText: (email: string) =>
        `Если аккаунт с адресом ${email} существует — мы отправили на него ссылку для восстановления пароля. Перейдите по ней, чтобы задать новый пароль.`,
    },
    langToggle: {
      label: "Язык",
    },
  },
  kk: {
    common: {
      priceCurrency: "₸",
      loading: "Жүктелуде…",
      more: "Тағы көрсету",
      reset: "Тазарту",
      apply: "Қолдану",
      close: "Жабу",
      back: "Артқа",
      home: "Басты бет",
    },
    header: {
      catalog: "Каталог",
      cabinet: "Жеке кабинет",
      login: "Кіру",
    },
    footer: {
      tagline: "Қолдан жасалған табиғи былғарыдан жасалған аксессуарлар, шағын топтамалармен және тапсырыспен.",
      catalog: "Каталог",
      shop: "Дүкен",
      cabinet: "Жеке кабинет",
      cart: "Себет",
      about: "Бренд туралы",
      contact: "Байланыс",
      madeToOrder: "Тапсырыс бойынша дайындау",
      country: "Қазақстан",
    },
    home: {
      heroEyebrow: "Қолдан жасалған · Тапсырыспен · Қазақстан",
      heroTitleLine1: "Ондаған жыл",
      heroTitleLine2: "қызмет ететін былғары",
      heroText:
        "TATANKA — өсімдік илеуінен жасалған табиғи былғарыдан жасалған әмияндар, портмоне, сөмкелер және басқа аксессуарлар. Әр бұйым сіздің тапсырысыңыз бойынша қолмен кесіліп, тігіліп, жиналады.",
      viewCatalog: "Каталогты қарау",
      aboutBrand: "Бренд туралы",
      approachEyebrow: "Біздің тәсіліміз",
      brandTitle:
        "Татанка — бизон дегенді білдіретін көне сөз: күш, төзімділік, ғасырлар бойы адамдарға қызмет еткен материал.",
      brandText:
        "Біз өсімдік илеуінен жасалған былғарымен шағын топтамалармен және жеке өлшемдер бойынша жұмыс істейміз. Конвейер жоқ — әр бұйым бір шебердің қолынан өтеді, кесуден бастап соңғы тігіске дейін.",
      viewItems: "Бұйымдарды қарау",
      assortmentEyebrow: "Каталог",
      assortmentTitle: "Ассортимент",
      newArrivals: "Жаңалықтар",
      emptySection: "Бұл бөлімде әзірге тауарлар жоқ.",
      wholeCatalog: "Барлық каталог",
      allInSection: (name: string) => `«${name}» бөлімінің барлық тауарлары`,
    },
    catalog: {
      eyebrow: "Каталог",
      title: "Барлық бұйымдар",
      typeFilter: "Түрі",
      allTypes: "Барлық түрлері",
      genderFilter: "Кімге арналған",
      anyGender: "Ер/әйел — кез келген",
      men: "Ер адамға",
      women: "Әйел адамға",
      unisex: "Унисекс",
      materialFilter: "Материал",
      anyMaterial: "Кез келген материал",
      colorFilter: "Түс",
      anyColor: "Кез келген түс",
      priceFrom: "Баға, ₸:",
      from: "бастап",
      to: "дейін",
      resetFilters: "Сүзгілерді тазарту",
      empty: "Бұл сүзгі бойынша ештеңе табылмады.",
      categoryEmpty: "Бұл бөлімде әзірге тауарлар жоқ — кейінірек қараңыз.",
    },
    product: {
      madeToOrder: "Тапсырыс бойынша",
      leadTimeDays: (days: number) => `~${days} күн`,
      material: "Материал",
      color: "Түс",
      forWhom: "Кімге арналған",
      quantity: "Саны",
      addToCart: "Себетке",
      buy: "Сатып алу",
      added: "Себетте",
      customizationLabel: "Тапсырысқа тілектер",
      customizationPlaceholder: "Мысалы: өлшем, түс, бұйымдағы гравировка",
      photoSoon: "Фото жақында",
      removeFromFavorites: "Таңдаулылардан алып тастау",
      addToFavorites: "Таңдаулыларға қосу",
      customizationFullLabel: "Бұйымға тілектер (өлшем, түс, гравировка)",
      decreaseQty: "Санды азайту",
      increaseQty: "Санды көбейту",
      addToCartFull: "Себетке қосу",
      goToCart: "Себетке өту",
      favoritesTitle: "Таңдаулылар",
      favoritesEmpty: "Таңдаулылар әзірге бос",
      favoritesEmptyHint: "Оны осында сақтау үшін тауар карточкасындағы жүрекшені басыңыз.",
      remove: "Алып тастау",
    },
    cart: {
      title: "Себет",
      empty: "Себет бос",
      toCatalog: "Каталогқа",
      remove: "Жою",
      total: "Барлығы",
      checkout: "Тапсырыс беру",
      customization: "Тілектер",
    },
    checkout: {
      title: "Тапсырысты рәсімдеу",
      contactName: "Алушының аты",
      contactPhone: "Телефон",
      contactEmail: "Email",
      deliveryCity: "Қала",
      deliveryAddress: "Жеткізу мекенжайы",
      comment: "Тапсырысқа түсініктеме",
      commentPlaceholder: "Міндетті емес",
      orderSummary: "Сіздің тапсырысыңыз",
      submit: "Рәсімдеу және төлеуге өту",
      submitting: "Рәсімделуде…",
      loginRequired: "Кіру қажет",
      payTitle: "Тапсырысты төлеу",
      payButton: "Robokassa арқылы төлеу",
      redirecting: "Төлеуге өтуде…",
      successTitle: "Төлем сәтті өтті",
      successOrder: (num: string, sum: string) => `№${num} тапсырыс, ${sum} ₸ сомасына төленді.`,
      successFallback:
        "Рахмет! Төлем расталған бойда тапсырыс мәртебесі жеке кабинетте жаңартылады.",
      successNote: "Біз бұйымыңызды дайындауды бастаймыз және көрсетілген байланыстар бойынша хабарласамыз.",
      myOrders: "Менің тапсырыстарым",
      failTitle: "Төлем өтпеді",
      failText: "Төлем аяқталмады. Қайта көріңіз немесе мәселе қайталанса, бізбен хабарласыңыз.",
      tryAgain: "Қайта көру",
      alreadyPaid: "Тапсырыс төленген.",
      orderSum: (num: string) => `№${num} тапсырыс, сомасы`,
    },
    contact: {
      eyebrow: "Бізбен байланысыңыз",
      title: "Байланыс",
      phone: "Телефон",
      whatsapp: "WhatsApp",
      email: "Email",
      address: "Мекенжай",
      workingHours: "Жұмыс уақыты",
      comingSoon: "Байланыс деректері жақында осында пайда болады.",
      questionTitle: "Тапсырыс бойынша сұрағыңыз бар ма?",
      questionText:
        "Ең жылдам жауапты жеке кабинеттегі хат алмасудан аласыз — онда тапсырыстарыңыздың барлық тарихы да көрінеді.",
      writeInCabinet: "Жеке кабинетте жазу",
      loginAndWrite: "Кіру және жазу",
    },
    account: {
      title: "Жеке кабинет",
      signOut: "Шығу",
      tabProfile: "Профиль",
      tabOrders: "Соңғы тапсырыстар",
      tabFeedback: "Кері байланыс",
      tabAdmin: "Дүкенді басқару",
      name: "Аты",
      phone: "Телефон",
      email: "Email",
      recentOrders: "Соңғы тапсырыстар",
      allOrders: "Барлық тапсырыстар",
      noOrders: "Сізде әзірге тапсырыстар жоқ.",
      orderNumber: (num: number) => `№${num} тапсырыс`,
      feedbackTitle: "Кері байланыс",
      feedbackText: "Тапсырыс немесе бұйым бойынша сұрағыңыз бар ма? Бізге жазыңыз — әдетте бір күн ішінде жауап береміз.",
    },
    install: {
      button: "Қолданбаны орнату",
      iosHint: "Телефонға орнату: Safari-де «Бөлісу» → «Негізгі экранға қосу» түймесін басыңыз",
    },
    auth: {
      loginTitle: "Кабинетке кіру",
      registerTitle: "Тіркелу",
      name: "Аты",
      phone: "Телефон",
      phonePlaceholder: "+7 7__ ___ __ __",
      email: "Email",
      password: "Құпия сөз",
      forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
      pleaseWait: "Күте тұрыңыз…",
      login: "Кіру",
      register: "Тіркелу",
      noAccount: "Аккаунтыңыз жоқ па?",
      haveAccount: "Аккаунтыңыз бар ма?",
      forgotTitle: "Құпия сөзді қалпына келтіру",
      forgotHint: "Email көрсетіңіз — оған құпия сөзді қалпына келтіру сілтемесін жібереміз.",
      sendLink: "Сілтемені жіберу",
      sending: "Жіберілуде…",
      rememberedPassword: "Құпия сөзді есіңізге түсірдіңіз бе?",
      checkEmailTitle: "Поштаны тексеріңіз",
      resetTitle: "Жаңа құпия сөз",
      newPassword: "Жаңа құпия сөз",
      savePassword: "Құпия сөзді сақтау",
      saving: "Сақталуда…",
      passwordChangedTitle: "Құпия сөз өзгертілді",
      redirecting: "Сізді жеке кабинетке бағыттаудамыз…",
      checkingLinkTitle: "Сілтеме тексерілуде…",
      checkingLinkText: "Егер бет ұзақ уақыт ашылмаса — хаттағы сілтеменің мерзімі өтіп кеткен болуы мүмкін.",
      requestNew: "Жаңасын сұрау",
      checkEmailText: (email: string) =>
        `Егер ${email} мекенжайымен аккаунт бар болса — оған құпия сөзді қалпына келтіру сілтемесін жібердік. Жаңа құпия сөз орнату үшін сілтеме бойынша өтіңіз.`,
    },
    langToggle: {
      label: "Тіл",
    },
  },
};

export type Dictionary = {
  common: Record<"priceCurrency" | "loading" | "more" | "reset" | "apply" | "close" | "back" | "home", string>;
  header: Record<"catalog" | "cabinet" | "login", string>;
  footer: Record<
    "tagline" | "catalog" | "shop" | "cabinet" | "cart" | "about" | "contact" | "madeToOrder" | "country",
    string
  >;
  home: Record<
    | "heroEyebrow"
    | "heroTitleLine1"
    | "heroTitleLine2"
    | "heroText"
    | "viewCatalog"
    | "aboutBrand"
    | "approachEyebrow"
    | "brandTitle"
    | "brandText"
    | "viewItems"
    | "assortmentEyebrow"
    | "assortmentTitle"
    | "newArrivals"
    | "emptySection"
    | "wholeCatalog",
    string
  > & { allInSection: (name: string) => string };
  catalog: Record<
    | "eyebrow"
    | "title"
    | "typeFilter"
    | "allTypes"
    | "genderFilter"
    | "anyGender"
    | "men"
    | "women"
    | "unisex"
    | "materialFilter"
    | "anyMaterial"
    | "colorFilter"
    | "anyColor"
    | "priceFrom"
    | "from"
    | "to"
    | "resetFilters"
    | "empty"
    | "categoryEmpty",
    string
  >;
  product: Record<
    | "madeToOrder"
    | "material"
    | "color"
    | "forWhom"
    | "quantity"
    | "addToCart"
    | "buy"
    | "added"
    | "customizationLabel"
    | "customizationPlaceholder"
    | "photoSoon"
    | "removeFromFavorites"
    | "addToFavorites"
    | "customizationFullLabel"
    | "decreaseQty"
    | "increaseQty"
    | "addToCartFull"
    | "goToCart"
    | "favoritesTitle"
    | "favoritesEmpty"
    | "favoritesEmptyHint"
    | "remove",
    string
  > & { leadTimeDays: (days: number) => string };
  cart: Record<"title" | "empty" | "toCatalog" | "remove" | "total" | "checkout" | "customization", string>;
  checkout: Record<
    | "title"
    | "contactName"
    | "contactPhone"
    | "contactEmail"
    | "deliveryCity"
    | "deliveryAddress"
    | "comment"
    | "commentPlaceholder"
    | "orderSummary"
    | "submit"
    | "submitting"
    | "loginRequired"
    | "payTitle"
    | "payButton"
    | "redirecting"
    | "successTitle"
    | "successFallback"
    | "successNote"
    | "myOrders"
    | "failTitle"
    | "failText"
    | "tryAgain"
    | "alreadyPaid",
    string
  > & { successOrder: (num: string, sum: string) => string; orderSum: (num: string) => string };
  contact: Record<
    | "eyebrow"
    | "title"
    | "phone"
    | "whatsapp"
    | "email"
    | "address"
    | "workingHours"
    | "comingSoon"
    | "questionTitle"
    | "questionText"
    | "writeInCabinet"
    | "loginAndWrite",
    string
  >;
  account: Record<
    | "title"
    | "signOut"
    | "tabProfile"
    | "tabOrders"
    | "tabFeedback"
    | "tabAdmin"
    | "name"
    | "phone"
    | "email"
    | "recentOrders"
    | "allOrders"
    | "noOrders"
    | "feedbackTitle"
    | "feedbackText",
    string
  > & { orderNumber: (num: number) => string };
  install: Record<"button" | "iosHint", string>;
  auth: Record<
    | "loginTitle"
    | "registerTitle"
    | "name"
    | "phone"
    | "phonePlaceholder"
    | "email"
    | "password"
    | "forgotPassword"
    | "pleaseWait"
    | "login"
    | "register"
    | "noAccount"
    | "haveAccount"
    | "forgotTitle"
    | "forgotHint"
    | "sendLink"
    | "sending"
    | "rememberedPassword"
    | "checkEmailTitle"
    | "resetTitle"
    | "newPassword"
    | "savePassword"
    | "saving"
    | "passwordChangedTitle"
    | "redirecting"
    | "checkingLinkTitle"
    | "checkingLinkText"
    | "requestNew",
    string
  > & { checkEmailText: (email: string) => string };
  langToggle: Record<"label", string>;
};

const typedDictionaries: Record<Lang, Dictionary> = dictionaries;

export function getDictionary(lang: Lang): Dictionary {
  return typedDictionaries[lang] ?? typedDictionaries[DEFAULT_LANG];
}
