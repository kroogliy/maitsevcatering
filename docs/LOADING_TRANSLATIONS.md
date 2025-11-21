# Переводы для загрузчика

## Добавленные переводы

### Структура переводов в файлах messages/*.json

```json
"LoadingScreen": {
  "logo": "название ресторана",
  "logoSubtext": "подзаголовок",
  "journeyBegins": "заголовок выбора музыки",
  "atmosphereSubtitle": "подзаголовок атмосферы",
  "atmosphereDescription": "описание атмосферы",
  "enterWithMusic": "кнопка входа с музыкой",
  "continueInSilence": "кнопка входа без музыки"
}
```

## Переводы по языкам

### Английский (en.json)
```json
"LoadingScreen": {
  "logo": "maitsev gruusia",
  "logoSubtext": "Georgian Culinary Experience",
  "journeyBegins": "Your Journey Begins",
  "atmosphereSubtitle": "Immerse yourself in authentic Georgian atmosphere",
  "atmosphereDescription": "Let the soul of Georgia accompany your culinary adventure through centuries-old flavors and traditions. Experience the warmth of Georgian hospitality with every taste.",
  "enterWithMusic": "Enter with Music",
  "continueInSilence": "Continue in Silence"
}
```

### Русский (ru.json)
```json
"LoadingScreen": {
  "logo": "майцев груусия",
  "logoSubtext": "Грузинский кулинарный опыт",
  "journeyBegins": "Ваше путешествие начинается",
  "atmosphereSubtitle": "Погрузитесь в аутентичную грузинскую атмосферу",
  "atmosphereDescription": "Позвольте душе Грузии сопровождать ваше кулинарное приключение через вековые вкусы и традиции. Ощутите тепло грузинского гостеприимства в каждом блюде.",
  "enterWithMusic": "Войти с музыкой",
  "continueInSilence": "Продолжить в тишине"
}
```

### Эстонский (et.json)
```json
"LoadingScreen": {
  "logo": "maitsev gruusia",
  "logoSubtext": "Gruusia kulinaarne kogemus",
  "journeyBegins": "Teie teekond algab",
  "atmosphereSubtitle": "Sukelduge autentsesse Gruusia atmosfääri",
  "atmosphereDescription": "Laske Gruusia hingel saata teid kulinaarsel seiklusel läbi sajanditevanuste maitsete ja traditsioonide. Kogege Gruusia külalislahkuse soojust igas ampsu.",
  "enterWithMusic": "Sisene muusikaga",
  "continueInSilence": "Jätka vaikuses"
}
```

## Использование в компоненте

```javascript
import { useTranslations } from "next-intl";

export default function GlobalLoadingWrapper({ children }) {
  const t = useTranslations("LoadingScreen");

  return (
    <>
      <div className={styles.logo}>{t("logo")}</div>
      <div className={styles.logoSubtext}>{t("logoSubtext")}</div>
      {/* и так далее... */}
    </>
  );
}
```

## Как добавить новый язык

1. Создайте новый файл в папке `messages/` (например, `fi.json` для финского)
2. Скопируйте структуру из существующего файла
3. Добавьте раздел `LoadingScreen` с переводами
4. Добавьте язык в конфигурацию i18n

## Рекомендации по переводам

1. **Название ресторана** - можно оставить латиницей или транслитерировать
2. **Описание атмосферы** - должно передавать теплоту и гостеприимство
3. **Кнопки** - должны быть короткими и понятными
4. **Консистентность** - используйте одинаковую терминологию во всех переводах

## Проверка переводов

После добавления переводов:
1. Проверьте каждый язык, переключая локаль в URL
2. Убедитесь, что тексты помещаются в отведенное пространство
3. Проверьте корректность отображения специальных символов