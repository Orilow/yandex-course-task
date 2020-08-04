// Переопределяем компонент App, чтобы импортировать общие для всех страниц стили
// _app.tsx - зарезервированный в Next.js файл
// Подробнее: https://nextjs.org/docs/basic-features/built-in-css-support#adding-a-global-stylesheet

import React from 'react';

import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
