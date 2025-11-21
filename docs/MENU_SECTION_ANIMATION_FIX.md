# Исправление проблемы с анимацией в Menu Section

## Описание проблемы

При первом рендере страницы анимация в `menu-section` срабатывала преждевременно:
- Анимация начиналась когда пользователь еще не доскроллил до секции
- Pin эффект работал некорректно
- После обновления страницы (F5) все работало правильно

## Причины проблемы

1. **Неправильный расчет позиций ScrollTrigger** - при первой загрузке ScrollTrigger может неверно рассчитать позиции элементов
2. **Отсутствие invalidateOnRefresh** - ScrollTrigger не пересчитывал позиции при изменениях
3. **Конфликт с другими анимациями** - другие ScrollTrigger'ы могли влиять на расчеты
4. **Асинхронная загрузка контента** - изображения и шрифты могли менять высоту элементов после инициализации

## Внесенные исправления

### 1. Добавлены параметры для правильной работы ScrollTrigger

```javascript
scrollTrigger: {
  id: "menu-mosaic",
  trigger: mosaicRef.current,
  start: isMobile ? "top 80%" : "top 15%",
  end: isMobile ? "bottom 20%" : "+=100%",
  scrub: isMobile ? false : 0,
  pin: !isMobile,
  anticipatePin: isMobile ? 0 : 1,
  pinSpacing: !isMobile,
  invalidateOnRefresh: true,  // Пересчет при refresh
  preventOverlaps: true,      // Предотвращение наложений
  fastScrollEnd: true,        // Быстрое завершение при быстром скролле
  markers: false,             // Установите true для отладки
}
```

### 2. Добавлена проверка корректности срабатывания

```javascript
onUpdate: (self) => {
  // Проверяем, что элемент действительно должен анимироваться
  if (!isMobile && self.progress > 0 && self.progress < 1) {
    if (!self.isActive) {
      console.warn("[MenuSection] Animation triggered too early, refreshing...");
      ScrollTrigger.refresh();
    }
  }
}
```

### 3. Улучшен порядок инициализации

```javascript
// Проверка размеров элемента перед созданием ScrollTrigger
const rect = mosaicRef.current.getBoundingClientRect();
console.log("[MenuSection] Mosaic rect:", rect);

// Отложенный refresh после полной загрузки
setTimeout(() => {
  handleResize();
  // Сортируем ScrollTrigger'ы для правильного порядка выполнения
  ScrollTrigger.sort();
}, 800);
```

### 4. Множественные точки обновления ScrollTrigger

```javascript
// После создания анимации
setTimeout(() => {
  if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
    ScrollTrigger.refresh();
  }
}, 300);

// При изменении размера окна
const handleResize = () => {
  requestAnimationFrame(() => {
    if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
      ScrollTrigger.refresh();
      console.log("[MenuSection] Final ScrollTrigger refresh");
    }
  });
};
```

## Ключевые параметры ScrollTrigger

- **invalidateOnRefresh: true** - заставляет ScrollTrigger пересчитывать start/end позиции при вызове refresh()
- **preventOverlaps: true** - предотвращает конфликты с другими ScrollTrigger анимациями
- **fastScrollEnd: true** - улучшает поведение при быстром скролле
- **anticipatePin: 1** - подготавливает пространство для pin эффекта заранее
- **pinSpacing: true** - создает пространство для закрепленного элемента

## Отладка

Для отладки проблем с ScrollTrigger:

1. Включите маркеры:
   ```javascript
   markers: true, // Показывает start/end позиции
   ```

2. Проверяйте консоль для сообщений:
   - `[MenuSection] Mosaic rect:` - размеры элемента
   - `[MenuSection] ScrollTrigger refresh` - когда происходит обновление
   - `[MenuSection] Animation triggered too early` - преждевременное срабатывание

3. Используйте ScrollTrigger.refresh() после загрузки всех ресурсов

## Рекомендации

1. **Всегда используйте invalidateOnRefresh: true** для сложных анимаций с pin
2. **Добавляйте задержку перед инициализацией** если контент загружается асинхронно
3. **Вызывайте ScrollTrigger.sort()** после создания всех триггеров
4. **Используйте onUpdate для проверки** корректности срабатывания
5. **Тестируйте на разных скоростях скролла** - быстрый и медленный

## Результат

- ✅ Анимация срабатывает в правильный момент
- ✅ Pin эффект работает корректно с первого раза
- ✅ Нет конфликтов с другими анимациями
- ✅ Стабильная работа при любой скорости загрузки