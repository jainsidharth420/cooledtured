import {NavLink} from '@remix-run/react';
import CopyrightBar from '../components/copyrightBar';

import MailingList from '~/components/mailingList';

/**
 * @param {FooterQuery & {shop: HeaderQuery['shop']}}
 */
export function Footer() {
  return (
    <footer className="footer" style={{ backgroundColor: 'white' }}>
      <div
        style={{
          color: 'black',
          display: 'flex',
          marginLeft: '70px',
          gap: '50px',
        }}
      >
        <FooterMenuSection title="Company Info" links={companyInfoLinks} />
        <FooterMenuSection title="Support" links={supportLinks} />
        <FooterMenuSection title="Legal Policy" links={legalPolicyLinks} />
        <MailingList />
      </div>
      <CopyrightBar />
    </footer>
  );
}

/**
 * @param {{
 *   title: string;
 *   links: { id: string; title: string; url: string }[];
 * }}
 */
interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface FooterMenuSectionProps {
  title: string;
  links: LinkItem[];
}

function FooterMenuSection({
  title,
  links,
}: FooterMenuSectionProps): JSX.Element {
  return (
    <div className="footer bg-white pt-4">
      <div
        className="flex flex-col"
        style={{alignItems: 'center', textAlign: 'center'}}
      >
        <h4 style={{margin: '0'}}>{title}</h4>
        <nav
          className="footer-menu"
          role="navigation"
          style={{flexDirection: 'column'}}
        >
          {links.map((item: LinkItem) => (
            <NavLink key={item.id} end prefetch="intent" to={item.url}>
              <h5 style={{margin: '0', color: 'black'}}>{item.title}</h5>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

const companyInfoLinks = [
  {id: 'link1-1', title: 'About Us', url: 'header'},
  {id: 'link1-2', title: 'FAQs', url: 'header'},
  {id: 'link1-3', title: 'We are Hiring', url: 'header'},
  {id: 'link1-3', title: 'Blog', url: 'header'},
];

const supportLinks = [
  {id: 'link2-1', title: 'Live Agent', url: 'header'},
  {id: 'link2-2', title: 'Email', url: 'header'},
  {id: 'link2-3', title: 'Hours of Operation', url: 'header'},
];

const legalPolicyLinks = [
  {id: 'link3-1', title: 'Affiliate Program', url: 'header'},
  {id: 'link3-2', title: 'Search', url: 'header'},
  {id: 'link3-3', title: 'Terms of Service', url: 'header'},
  {id: 'link3-3', title: 'Refund Policy', url: 'header'},
];
