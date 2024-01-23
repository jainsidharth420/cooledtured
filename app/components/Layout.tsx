import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import React, { useState } from 'react';


import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';

import Social from './Social';
export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      {/* <FilterAside /> */}
      <MobileMenuAside menu={header.menu} shop={header.shop} />
      {/* <SubscribePopup /> */}
      <div className="sticky top-0 z-10">
        <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      </div>
      <Social />
      <div className="px-2 md:px-20">
        <main>{children}</main>
      </div>
      <Suspense>
        {/* <Await resolve={footer}> */}
        <Footer />
        {/* {(footer) => <Footer menu={footer.menu} shop={header.shop} />} */}
        {/* </Await> */}
      </Suspense>
      <script
        async
        type="text/javascript"
        src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=REDMX5"
      ></script>
    </>
  );
}


function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}


export function SearchAside() {
  const [asideVisible, setAsideVisible] = useState(true);
  const toggleAside = () => {
    setAsideVisible(!asideVisible);
  };
  const closeAside = () => {
    setAsideVisible(false);
  };

  return (
    <>
      <Aside
        id="search-aside"
        heading="SEARCH"
        isOpen={asideVisible}
        onClose={closeAside}
      >
        <div className="predictive-search">
          <br />
          <PredictiveSearchForm>
            {({ fetchResults, inputRef }) => (
              <div>
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Search"
                  ref={inputRef}
                  type="search"
                />
                &nbsp;
                <button type="submit" onClick={closeAside}>
                  Search
                </button>
              </div>
            )}
          </PredictiveSearchForm>
          <PredictiveSearchResults />
        </div>
      </Aside>
    </>
  );
}

function MobileMenuAside({
  menu,
  shop,
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu
        menu={menu}
        viewport="mobile"
        primaryDomainUrl={shop.primaryDomain.url}
      />
    </Aside>
  );
}