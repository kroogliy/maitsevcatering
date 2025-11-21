# Настройка глобального загрузчика

## Что было сделано

### 1. Создан GlobalLoadingWrapper
Переместили `HomePageLoadingWrapper` в компоненты и переименовали в `GlobalLoadingWrapper`:
- Путь: `components/global-loading/GlobalLoadingWrapper.js`
- Стили: `components/global-loading/GlobalLoadingWrapper.module.css`

### 2. Интеграция в layout
Загрузчик теперь обертывает ВСЕ страницы сайта:

```javascript
// app/[locale]/layout.js
import GlobalLoadingWrapper from "../../components/global-loading/GlobalLoadingWrapper";

export default async function LocaleLayout({ children, params }) {
  // ...
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ProductsProvider>
        <GSAPProvider>
          <LenisProvider>
            <CartProvider>
              <GlobalLoadingWrapper>
                <ScrollController />
                <ModalInit />
                <Header locale={locale} />
                {children}
                <Footer locale={locale} />
                <GlobalCartModals />
              </GlobalLoadingWrapper>
            </CartProvider>
          </LenisProvider>
        </GSAPProvider>
      </ProductsProvider>
    </NextIntlClientProvider>
  );
}
```

## Как это работает

### Когда показывается загрузчик:
1. **При обновлении страницы (F5)** - sessionStorage очищается
2. **При прямом переходе по URL** - нет флага внутренней навигации
3. **При первом заходе на сайт** - нет сохраненного состояния

### Когда НЕ показывается загрузчик:
1. **При клике на любую ссылку внутри сайта** - устанавливается флаг `internalNavigation`
2. **При навигации через хедер/меню** - все ссылки обрабатывают внутреннюю навигацию

## Проверка работы

### 1. Обновление страницы
- Нажмите F5 на любой странице
- Должен появиться загрузчик с прогрессом и выбором музыки

### 2. Внутренняя навигация
- Кликните на любую ссылку в хедере или меню
- Загрузчик НЕ должен появляться
- Переход должен быть мгновенным

### 3. Прямой переход по URL
- Скопируйте URL любой страницы
- Откройте новую вкладку и вставьте URL
- Должен появиться загрузчик

## Управление музыкой

### Глобальное аудио
```javascript
// Аудио сохраняется глобально
window.globalAudio = audioRef.current;

// Доступ из любого компонента
if (window.globalAudio) {
  // Использовать существующее аудио
}
```

### Кнопка в хедере
- Расположена рядом с корзиной
- Показывает состояние ON/OFF
- Синхронизирована с выбором в загрузчике
- Сохраняет состояние в localStorage

## Возможные проблемы и решения

### Проблема: Загрузчик показывается при внутренней навигации
**Решение**: Проверьте, что все ссылки вызывают `handleInternalNavigation()`:
```javascript
const handleInternalNavigation = () => {
  sessionStorage.setItem("internalNavigation", "true");
};
```

### Проблема: Музыка не воспроизводится
**Решение**: Браузеры блокируют автовоспроизведение. Пользователь должен сначала взаимодействовать со страницей.

### Проблема: Загрузчик не исчезает
**Решение**: Проверьте консоль на ошибки. Есть резервный таймер на 6 секунд.

## Кастомизация

### Изменение времени показа
```javascript
const SHOW_TIME = 2000; // 2 секунды
```

### Изменение текстов
Тексты находятся в компоненте `GlobalLoadingWrapper.js`:
- Заголовок: "Your Journey Begins"
- Подзаголовок: "Immerse yourself in authentic Georgian atmosphere"
- Кнопки: "Enter with Music" / "Continue in Silence"

### Изменение стилей
Стили в файле `GlobalLoadingWrapper.module.css`:
- `.loadingOverlay` - фон загрузчика
- `.logo` - логотип
- `.progressNumber` - счетчик прогресса
- `.musicChoiceContainer` - контейнер выбора музыки

## Отключение для разработки

Для быстрой разработки можно временно отключить:
```javascript
// В GlobalLoadingWrapper.js
const [showLoading, setShowLoading] = useState(false); // Всегда false
```

Или установить быструю скорость:
```javascript
<GlobalLoadingWrapper speed="dev">
```
