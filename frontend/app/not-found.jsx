import Link from "next/link";
import Image from "next/image";

/**
 * Root Not Found page
 * This page is outside the [locale] layout, so it cannot use LanguageProvider
 * It redirects users to the default locale home page
 */
export default function NotFound() {
  return (
    <html lang="en" dir="ltr">
      <body>
        <main>
          <section className="nopage" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '600px' }}>
              <h1 style={{ 
                fontSize: '120px', 
                fontWeight: 'bold', 
                margin: '0',
                color: '#333'
              }}>
                40<span style={{ color: '#3554d1' }}>4</span>
              </h1>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600',
                marginBottom: '16px',
                color: '#333'
              }}>
                Oops! Page not found.
              </h2>
              <p style={{ 
                color: '#666',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>

              <Link
                href="/en"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#3554d1',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '500'
                }}
              >
                Go back to homepage →
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
