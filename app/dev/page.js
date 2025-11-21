"use client";

import React, { useState } from "react";
import LoadingScreen from "../../components/loadingscreen/loadingscreen";
import styles from "./dev.module.css";

export default function DevPage() {
  const [showLoading, setShowLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [showProgress, setShowProgress] = useState(true);

  const startLoadingScreen = () => {
    setShowLoading(true);
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setIsLoading(false);
  };

  const resetLoadingScreen = () => {
    setShowLoading(false);
    setIsLoading(false);
  };

  return (
    <div className={styles.devContainer}>
      {/* Loading Screen */}
      {showLoading && (
        <LoadingScreen
          onLoadingComplete={handleLoadingComplete}
          speed={speed}
          showProgress={showProgress}
        />
      )}

      {/* Developer Controls */}
      <div className={styles.header}>
        <h1>Loading Screen Developer Page</h1>
        <p>
          Используйте эту страницу для тестирования и редактирования
          загрузочного экрана
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.settings}>
          <div className={styles.setting}>
            <label htmlFor="speed">Скорость загрузки:</label>
            <select
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              disabled={isLoading}
              className={styles.select}
            >
              <option value="dev">Dev (очень быстро)</option>
              <option value="fast">Быстро</option>
              <option value="normal">Нормально</option>
              <option value="slow">Медленно</option>
            </select>
          </div>

          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={showProgress}
                onChange={(e) => setShowProgress(e.target.checked)}
                disabled={isLoading}
              />
              Показывать прогресс-бар
            </label>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.primaryButton}
            onClick={startLoadingScreen}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "🚀 Запустить Loading Screen"}
          </button>

          <button
            className={styles.secondaryButton}
            onClick={resetLoadingScreen}
            disabled={!isLoading}
          >
            ⏹ Остановить Loading Screen
          </button>
        </div>

        <div className={styles.status}>
          <span
            className={`${styles.indicator} ${isLoading ? styles.active : ""}`}
          ></span>
          Status: {isLoading ? "Loading..." : "Ready"}
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoCard}>
          <h3>🎯 Как использовать:</h3>
          <ul>
            <li>Нажмите &quot;Запустить Loading Screen&quot; для просмотра</li>
            <li>
              Редактируйте файлы в <code>components/loadingscreen/</code>
            </li>
            <li>Изменения применятся автоматически (Hot Reload)</li>
            <li>Перезапустите для проверки изменений</li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h3>📁 Файлы компонента:</h3>
          <ul>
            <li>
              <code>loadingscreen.js</code> - Основная логика
            </li>
            <li>
              <code>loadingscreen.module.css</code> - Стили
            </li>
            <li>
              <code>README.md</code> - Документация
            </li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h3>⚡ Настройки тестирования:</h3>
          <div className={styles.quickTips}>
            <div className={styles.tip}>
              <strong>Скорость:</strong>
              <p>
                dev - мгновенно, fast - быстро, normal - обычно, slow - медленно
              </p>
            </div>
            <div className={styles.tip}>
              <strong>Прогресс-бар:</strong>
              <p>Включите/выключите для проверки разных вариантов</p>
            </div>
            <div className={styles.tip}>
              <strong>Логотип:</strong>
              <p>
                Замените путь в <code>src=&quot;/images/logo2.png&quot;</code>
              </p>
            </div>
            <div className={styles.tip}>
              <strong>Hot Reload:</strong>
              <p>Изменения в CSS применяются автоматически</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p>
          💡 <strong>Совет:</strong> Держите эту вкладку открытой для быстрого
          тестирования изменений
        </p>
      </div>

      {/* Дополнительный контент для тестирования скролла */}
      <div className={styles.scrollTestContent}>
        <h2 style={{ marginTop: "50px", textAlign: "center" }}>
          🔄 Тест блокировки скролла
        </h2>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          Прокрутите страницу вниз, затем запустите загрузочный экран. Скролл
          должен быть заблокирован!
        </p>

        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              margin: "10px",
              backgroundColor: i % 2 === 0 ? "#f5f5f5" : "#e8e8e8",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>Блок #{i + 1}</h3>
            <p>
              Это тестовый блок для проверки скролла. Прокрутите страницу вниз и
              нажмите кнопку запуска загрузочного экрана. После завершения
              загрузки вы должны вернуться к той же позиции скролла.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation.
            </p>
            {i === 10 && (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "8px",
                  margin: "10px 0",
                }}
              >
                <h4>🎯 Точка тестирования</h4>
                <p>
                  Прокрутите до этого блока и запустите загрузочный экран. После
                  завершения вы должны остаться здесь!
                </p>
              </div>
            )}
          </div>
        ))}

        <div
          style={{
            padding: "40px",
            margin: "20px",
            backgroundColor: "#28a745",
            color: "white",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h2>✅ Конец страницы</h2>
          <p>
            Если вы видите этот блок после запуска загрузочного экрана - значит
            блокировка скролла не работает корректно!
          </p>
          <p>Прокрутите назад вверх и протестируйте снова.</p>
        </div>
      </div>
    </div>
  );
}
