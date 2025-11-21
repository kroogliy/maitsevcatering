# Исправление проблемы с GSAP анимациями при загрузке с чистым кэшем

## Описание проблемы

При перезапуске сервера Next.js и первом заходе на сайт с чистым кэшем, анимации GSAP в компоненте `chefs-mastery.js` не работали. Анимации начинали работать только после обновления страницы (F5) или при последующих заходах.

### Симптомы:
- После остановки и перезапуска сервера (`npm run dev`) анимации не работают при первом заходе
- После обновления страницы (F5) анимации начинают работать
- При закрытии и повторном открытии браузера анимации продолжают работать

### Причина:

1. **GlobalLoadingWrapper** показывает загрузочный экран при первом заходе с чистым кэшем
2. Весь контент сайта скрывается через `opacity: 0` и `visibility: hidden`
3. Компонент `chefs-mastery.js` инициализируется и создает GSAP анимации
4. ScrollTrigger срабатывает на **невидимых** элементах
5. Когда загрузчик исчезает и контент становится видимым, анимации уже "отработали"

## Решение

### 1. Ожидание события закрытия загрузчика

В `chefs-mastery.js` добавлена проверка состояния загрузчика и ожидание события `loadingWrapperClosed`:

```javascript
const checkLoadingWrapper = () => {
  // Проверяем, скрыт ли контент загрузчиком
  const contentWrapper = section.closest('[style*="opacity"]');
  const isHidden = contentWrapper && (
    window.getComputedStyle(contentWrapper).opacity === '0' ||
    window.getComputedStyle(contentWrapper).visibility === 'hidden'
  );

  if (isHidden) {
    // Ждем закрытия загрузчика
    const handleLoadingWrapperClosed = (event) => {
      window.removeEventListener('loadingWrapperClosed', handleLoadingWrapperClosed);
      
      // Инициализируем анимации после небольшой задержки
      setTimeout(() => {
        setupAnimations();
      }, 100);
    };

    window.addEventListener('loadingWrapperClosed', handleLoadingWrapperClosed);
  } else {
    // Загрузчик не активен, инициализируем сразу
    setupAnimations();
  }
};
```

### 2. Очистка GSAP стилей перед инициализацией

Добавлен сброс всех GSAP стилей перед созданием новых анимаций:

```javascript
gsap.set([
  ".mastery-number",
  ".mastery-title-first",
  ".mastery-title-second",
  ".chef-main-image",
  ".chef-name-large",
  ".chef-role-large",
  ".parallax-card",
  ".section-title-overlay"
], {
  clearProps: "all"
});
```

### 3. Улучшенный ScrollTrigger.refresh()

В `GlobalLoadingWrapper.js` улучшен механизм обновления ScrollTrigger после скрытия загрузчика:

```javascript
setTimeout(() => {
  if (typeof window !== "undefined" && window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
    
    // Дополнительная очистка transform стилей
    if (window.gsap) {
      window.gsap.set("*", { clearProps: "transform" });
      window.ScrollTrigger.refresh();
    }
  }
}, 600);
```

## Ключевые моменты

1. **Не инициализировать анимации на скрытых элементах** - всегда проверять видимость контейнера
2. **Использовать события для синхронизации** - загрузчик диспатчит событие когда закрывается
3. **Очищать предыдущие стили** - использовать `clearProps` для сброса GSAP стилей
4. **Давать время на рендер** - использовать setTimeout для гарантии, что DOM обновился

## Дополнительные рекомендации

1. При использовании загрузочных экранов всегда учитывать их влияние на GSAP анимации
2. Использовать `console.log` для отладки последовательности событий
3. Проверять состояние элементов через `window.getComputedStyle()` вместо прямого чтения стилей
4. Всегда добавлять cleanup в useEffect для удаления слушателей событий

## Связанные файлы

- `/components/chefs-mastery/chefs-mastery.js` - компонент с анимациями
- `/components/global-loading/GlobalLoadingWrapper.js` - глобальный загрузчик
- `/components/gsap/GSAPProvider.js` - провайдер GSAP