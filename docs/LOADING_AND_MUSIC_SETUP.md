# Настройка загрузчика и кнопки управления музыкой

## Решенные задачи

### 1. Умный загрузчик (HomePageLoadingWrapper)

#### Проблема
Загрузчик показывался при любой навигации, включая внутреннюю навигацию по сайту.

#### Решение
Добавлена проверка `sessionStorage` для определения типа навигации:

```javascript
// Проверяем на стороне клиента, была ли внутренняя навигация
const [showLoading, setShowLoading] = useState(() => {
  if (typeof window !== "undefined") {
    const isInternal = window.sessionStorage.getItem("internalNavigation") === "true";
    return !isInternal;
  }
  return true;
});
```

#### Когда показывается загрузчик:
- При обновлении страницы (F5)
- При переходе по прямой ссылке из браузера
- При первом заходе на сайт

#### Когда НЕ показывается загрузчик:
- При клике на любую навигационную кнопку внутри сайта
- При переходах через хедер, меню и другие внутренние ссылки

### 2. Кнопка управления музыкой в хедере

#### Добавленный функционал

1. **Кнопка ON/OFF рядом с корзиной**
   ```jsx
   <button
     className={styles.musicToggle}
     onClick={toggleMusic}
     data-music-toggle
     aria-label={musicEnabled ? "Turn off music" : "Turn on music"}
   >
     <span>{musicEnabled ? "ON" : "OFF"}</span>
   </button>
   ```

2. **Глобальное управление аудио**
   ```javascript
   // Сохранение аудио глобально
   window.globalAudio = audioRef.current;
   
   // Доступ из хедера
   if (window.globalAudio) {
     audioRef.current = window.globalAudio;
   }
   ```

3. **GSAP анимации для кнопки**
   - Кнопка включена в список элементов для анимации при скролле
   - Добавлен волновой эффект при наведении
   - Синхронизирована с остальными элементами навигации

#### Стили кнопки

```css
.musicToggle {
    position: relative;
    background: transparent;
    border: 1px solid #ffffff;
    color: #ffffff;
    cursor: pointer;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    font-family: "NyghtSerif", sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    margin-left: 1rem;
}

.musicToggle:hover {
    color: #d4af37;
    border-color: #d4af37;
    transform: translateY(-2px);
}
```

## Интеграция с существующими системами

### 1. Сохранение состояния музыки
```javascript
// Сохранение в localStorage
localStorage.setItem("musicEnabled", musicEnabled ? "true" : "false");

// Восстановление при загрузке
const savedMusicState = localStorage.getItem("musicEnabled") === "true";
setMusicEnabled(savedMusicState);
```

### 2. Синхронизация между компонентами
- HomePageLoadingWrapper создает аудио объект
- Сохраняет его в `window.globalAudio`
- Header подхватывает существующий объект
- Состояние синхронизируется через localStorage

### 3. GSAP анимации
Кнопка музыки интегрирована в существующую систему анимаций:

```javascript
const navElements = [
  containerEl.querySelector("[data-cart-icon]"),
  containerEl.querySelector("[data-music-toggle]"), // Добавлена кнопка музыки
  containerEl.querySelector("[data-lang-switcher]"),
  containerEl.querySelector(`.${styles.logoText}`),
  containerEl.querySelector(`.${styles.desktopNav}`),
  containerEl.querySelector(`.${styles.hamburger}`),
].filter(Boolean);
```

## Обработка edge cases

### 1. Автоплей браузера
```javascript
audioRef.current.play().catch(() => {
  console.log("Autoplay prevented");
});
```

### 2. Видимость вкладки
```javascript
const handleVisibilityChange = () => {
  if (document.hidden && audioRef.current && !audioRef.current.paused) {
    audioRef.current.pause();
  } else if (!document.hidden && musicEnabled && audioRef.current) {
    audioRef.current.play().catch(() => {});
  }
};
```

### 3. Очистка ресурсов
```javascript
return () => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.src = "";
    window.globalAudio = null;
  }
};
```

## Мобильная адаптация

```css
@media (max-width: 768px) {
  .musicToggle {
    padding: 6px 12px;
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
}
```

## Результат

1. ✅ Загрузчик показывается только при внешней навигации
2. ✅ Кнопка музыки интегрирована в хедер с полным функционалом
3. ✅ GSAP анимации работают для всех элементов включая кнопку музыки
4. ✅ Состояние музыки сохраняется между сессиями
5. ✅ Корректная работа на мобильных устройствах