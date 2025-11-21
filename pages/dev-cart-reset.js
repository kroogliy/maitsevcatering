"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCart, CartProvider } from '../contexts/CartContext';
import { getDiscountPercentage, applyDiscount, formatPrice } from '../utils/priceUtils';

function DevCartResetInner() {
  const { cart, clearCartWithPriceReset, clearCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleClearWithReset = () => {
    if (confirm('Очистить корзину и обновить цены? Это действие нельзя отменить.')) {
      clearCartWithPriceReset();
    }
  };

  const handleClearNormal = () => {
    if (confirm('Очистить корзину обычным способом?')) {
      clearCart();
    }
  };

  const migrateCurrentCart = () => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const migratedCart = parsedCart.map(item => {
          if (!item.originalPrice && item.price) {
            return {
              ...item,
              originalPrice: item.price,
              price: applyDiscount(item.price)
            };
          }
          return item;
        });
        sessionStorage.setItem('cart', JSON.stringify(migratedCart));
        alert('Корзина мигрирована! Обновите страницу.');
      }
    }
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>
        🛠️ Инструменты разработчика - Управление корзиной
      </h1>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>📊 Информация о системе скидок</h2>
        <p><strong>Текущий процент скидки:</strong> {getDiscountPercentage()}%</p>
        <p><strong>Товаров в корзине:</strong> {cart.length}</p>

        <h3>🛒 Состояние корзины:</h3>
        {cart.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              {showDetails ? 'Скрыть детали' : 'Показать детали'}
            </button>

            {showDetails && (
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                {cart.map((item, index) => (
                  <div key={index} style={{
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: item.originalPrice ? '2px solid #4CAF50' : '2px solid #FF9800'
                  }}>
                    <strong>{item.name || item.title?.en || item.title?.et || 'Unknown'}</strong><br/>
                    <span>ID: {item._id}</span><br/>
                    <span>Количество: {item.quantity}</span><br/>
                    <span>Текущая цена: {formatPrice(item.price)}€</span><br/>
                    {item.originalPrice ? (
                      <>
                        <span>Оригинальная цена: {formatPrice(item.originalPrice)}€</span><br/>
                        <span style={{ color: '#4CAF50' }}>✅ Мигрирован</span>
                      </>
                    ) : (
                      <span style={{ color: '#FF9800' }}>⚠️ Требует миграции</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>🔧 Действия</h2>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={handleClearWithReset}
            style={{
              padding: '12px 24px',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '16px'
            }}
          >
            🧹 Очистить корзину с обновлением цен
          </button>
          <small style={{ color: '#666' }}>
            Полностью очищает корзину и сбрасывает цены
          </small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={handleClearNormal}
            style={{
              padding: '12px 24px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '16px'
            }}
          >
            🗑️ Обычная очистка корзины
          </button>
          <small style={{ color: '#666' }}>
            Обычная очистка без изменения логики
          </small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={migrateCurrentCart}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '16px'
            }}
          >
            🔄 Мигрировать текущую корзину
          </button>
          <small style={{ color: '#666' }}>
            Обновляет цены в текущей корзине без очистки
          </small>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ffeaa7',
        marginBottom: '20px'
      }}>
        <h2>⚠️ Инструкции</h2>
        <ol>
          <li><strong>Если возникает ошибка валидации цен:</strong> используйте {'"'}Очистить корзину с обновлением цен{'"'}</li>
          <li><strong>Для сохранения товаров в корзине:</strong> используйте {'"'}Мигрировать текущую корзину{'"'}</li>
          <li><strong>После миграции:</strong> обновите страницу для применения изменений</li>
          <li><strong>Зеленая рамка:</strong> товар уже мигрирован</li>
          <li><strong>Оранжевая рамка:</strong> товар требует миграции</li>
        </ol>
      </div>

      <div style={{
        backgroundColor: '#d4edda',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h2>📝 Консольные команды</h2>
        <p>В консоли браузера доступны следующие команды:</p>
        <ul>
          <li><code>clearCartPrices()</code> - очистить корзину с обновлением цен</li>
        </ul>
        <p><small>Откройте консоль разработчика (F12) и введите команду</small></p>
      </div>

      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>
          <Link href="/">
            <span style={{ color: '#d32f2f', textDecoration: 'none' }}>
              ← Вернуться на главную
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

function DevCartReset() {
  return (
    <CartProvider>
      <DevCartResetInner />
    </CartProvider>
  );
}

export default dynamic(() => Promise.resolve(DevCartReset), {
  ssr: false
});
