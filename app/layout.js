import "./globals.css";
import { ThemeContextProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ToastProvider';

export const metadata = {
  title: "Enhanced Inventory Management",
  description: "Modern inventory management application with advanced features",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <ThemeContextProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
