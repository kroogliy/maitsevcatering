# Loading Screen Component

Премиальный загрузочный экран в стиле минимализм для Maitsev Sushi.

## Особенности

- 🎨 **Минималистичный дизайн** - Чистый и элегантный интерфейс
- ⚡ **GSAP анимации** - Плавные премиальные переходы
- 📱 **Адаптивный** - Работает на всех устройствах
- 🌙 **Dark mode** - Автоматическая поддержка темной темы
- 🔄 **Прогресс-бар** - Реалистичная симуляция загрузки
- ✨ **Анимированные элементы** - Floating circles и glow эффекты

## Использование

### Базовое использование

```jsx
import LoadingScreen from '../components/loadingscreen/loadingscreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      {/* Ваш основной контент */}
      <main>
        {/* ... */}
      </main>
    </>
  );
}
```

### В layout.js или _app.js

```jsx
"use client";

import { useState, useEffect } from 'react';
import LoadingScreen from '../components/loadingscreen/loadingscreen';

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <html>
      <body>
        {isLoading && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
        {!isLoading && children}
      </body>
    </html>
  );
}
```

### С условием первого визита

```jsx
"use client";

import { useState, useEffect } from 'react';
import LoadingScreen from '../components/loadingscreen/loadingscreen';

export default function App() {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Показывать загрузочный экран только при первом визите
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowLoading(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <>
      {showLoading && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      {/* Ваш контент */}
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLoadingComplete` | `function` | `undefined` | Callback функция, вызывается после завершения загрузки |

## Кастомизация

### Изменение логотипа

Замените файл `/public/images/logo2.png` на ваш логотип или обновите путь в компоненте:

```jsx
<Image
  src="/images/your-logo.png"
  alt="Your Brand"
  width={120}
  height={120}
  className={styles.logoImage}
  priority
/>
```

### Изменение времени загрузки

Отредактируйте массив `loadingSteps` в компоненте:

```jsx
const loadingSteps = [
  { progress: 20, delay: 500 },  // Увеличьте delay для более медленной загрузки
  { progress: 45, delay: 800 },
  { progress: 70, delay: 600 },
  { progress: 85, delay: 400 },
  { progress: 100, delay: 300 },
];
```

### Изменение цветовой схемы

Обновите CSS переменные в `loadingscreen.module.css`:

```css
.loadingScreen {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

.progressBar {
  background: linear-gradient(90deg, #your-accent-color 0%, #your-accent-color-2 100%);
}
```

## Структура файлов

```
components/loadingscreen/
├── loadingscreen.js          # Основной компонент
├── loadingscreen.module.css  # Стили
└── README.md                 # Документация
```

## Зависимости

- React 18+
- Next.js 13+
- GSAP 3+
- next/image

## Анимации

Компонент использует GSAP для следующих анимаций:

1. **Появление логотипа** - 3D rotation + scale + fade in
2. **Появление прогресс-бара** - Slide up + fade in
3. **Обновление прогресса** - Smooth width animation
4. **Исчезновение** - Последовательное fade out всех элементов
5. **Background elements** - Floating circles с infinite animation

## Производительность

- Компонент оптимизирован для производительности
- Использует `priority` для логотипа
- GSAP анимации аппаратно ускорены (GPU)
- Lazy loading для фоновых элементов

## Поддержка браузеров

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Лицензия

Компонент создан специально для Maitsev Sushi.