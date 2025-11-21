# Исправление проблемы с исчезновением футера при навигации

## Описание проблемы

При навигации между страницами футер исчезал и не появлялся обратно. Проблема была связана с несколькими факторами:

1. GSAP анимации не переинициализировались при смене страниц
2. ScrollTrigger'ы не очищались корректно
3. GlobalLoadingWrapper мог скрывать футер через CSS
4. Отсутствовала защита от скрытия элементов

## Внесенные исправления

### 1. Переинициализация анимаций при навигации

```javascript
// Добавлен pathname в зависимости useEffect
useEffect(() => {
  // ... код инициализации анимаций
}, [pathname]); // Теперь анимации переинициализируются при навигации
```

### 2. Правильная очистка ScrollTrigger'ов

```javascript
// Добавлен ref для хранения ScrollTrigger'ов
const scrollTriggerRef = useRef([]);

// Очистка перед созданием новых
scrollTriggerRef.current.forEach(trigger => {
  if (trigger) trigger.kill();
});
scrollTriggerRef.current = [];

// Сохранение ссылок на новые триггеры
const parallaxTrigger = ScrollTrigger.create({
  id: "footer-parallax",
  // ... настройки
});
scrollTriggerRef.current.push(parallaxTrigger);
```

### 3. Гарантия видимости футера

```javascript
// Принудительная установка видимости
gsap.set(footer, {
  opacity: 1,
  visibility: "visible",
  display: "block"
});

// Сброс стилей с сохранением видимости
gsap.set(footer, {
  clearProps: "transform,y,scale",
  opacity: 1,
  visibility: "visible"
});
```

### 4. Дополнительная проверка видимости

```javascript
// Проверка и исправление скрытого состояния
useEffect(() => {
  const checkVisibility = () => {
    const footer = footerRef.current;
    if (footer) {
      const styles = window.getComputedStyle(footer);
      if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
        console.warn("[Footer] Footer is hidden! Fixing...");
        gsap.set(footer, {
          display: "block",
          visibility: "visible",
          opacity: 1
        });
      }
    }
  };

  checkVisibility();
  const timer = setTimeout(checkVisibility, 500);
  return () => clearTimeout(timer);
}, [pathname]);
```

### 5. Исправление GlobalLoadingWrapper

```javascript
// Улучшенное управление видимостью children
<div
  style={{
    opacity: showLoading ? 0 : 1,
    visibility: showLoading ? "hidden" : "visible",
    pointerEvents: showLoading ? "none" : "auto",
    transition: showLoading ? "none" : "opacity 0.5s ease, visibility 0.5s ease",
    position: "relative",
    minHeight: showLoading ? "100vh" : "auto",
  }}
>
  {children}
</div>
```

### 6. CSS защита

```css
.footer {
    /* ... другие стили */
    opacity: 1;
    visibility: visible;
}

.container {
    /* ... другие стили */
    opacity: 1;
    visibility: visible;
}
```

## Результат

- ✅ Футер остается видимым при любой навигации
- ✅ Анимации корректно переинициализируются
- ✅ ScrollTrigger'ы правильно очищаются
- ✅ Есть защита от случайного скрытия
- ✅ Логирование помогает отслеживать проблемы

## Отладка

Если проблема повторится, проверьте консоль для сообщений:
- `[Footer] Initializing for pathname:` - инициализация
- `[Footer] Footer is hidden! Fixing...` - автоматическое исправление
- `[Footer] ScrollTriggers created` - создание анимаций
- `[Footer] Cleaning up` - очистка при навигации

## Рекомендации

1. **Всегда используйте pathname в зависимостях** для компонентов с GSAP анимациями
2. **Сохраняйте ссылки на ScrollTrigger'ы** для правильной очистки
3. **Добавляйте защиту видимости** для критичных элементов
4. **Используйте clearProps выборочно** - не очищайте opacity/visibility если элемент должен быть виден
5. **Добавляйте логирование** для отладки проблем с видимостью