import Link from "next/link";
import Header3 from "@/components/layout/header/Header3";
import FooterTwo from "@/components/layout/footers/FooterTwo";

export default function NotFound() {
  return (
    <>
      <main>
        <Header3 />
        <div className="header-margin"></div>
        <section className="nopage">
          <div className="container">
            <div className="row y-gap-30 justify-between items-center">
              <div className="col-lg-6">
                <div className="nopage__content pr-30 lg:pr-0">
                  <h1>404</h1>
                  <h2 className="text-30 md:text-24 fw-700">
                    Oops! Page not found.
                  </h2>
                  <p>
                    The page you are looking for might have been removed, had
                    its name changed, or is temporarily unavailable.
                  </p>
                  <Link href="/en" className="button -md -dark-1 bg-accent-1 text-white mt-25">
                    Go back to homepage
                    <i className="icon-arrow-top-right ml-10"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FooterTwo />
      </main>
    </>
  );
}
