import React, { useRef, useEffect, useState } from 'react';
import { Aside } from './Aside';
import type {LayoutProps} from './Layout';

interface SearchFilterProps {
  handleFilterChange: (
    arg0: string,
    arg1: string,
    arg2: boolean,
    arg3: string[]
  ) => void;
}

interface FilterCategory {
  key: string;
  label: string;
  options: string[];
}


const vendorList = [
  'Alter',
  'Aniplex',
  'Bandai',
  'Bandai Tamashii Nations',
  'Banpresto',
  'Beeline Creative',
  'Bellfine',
  'Bioworld',
  'cooledtured',
  'DC Direct',
  // 'Enterbay',
  // 'Freeing',
  // 'First 4 Figures',
  // 'FuRyu',
  // 'Funko',
  // 'Good Smile Company',
  // 'Iron Studios',
  // 'Kotobukiya',
  // 'Mattel',
  // 'McFarlane Toys',
  // 'Medicom',
  // 'Megahouse',
  // 'Ques Q',
  // 'Salesone Studios',
  // 'Sega',
  // 'Sentinel',
  // 'Taito',
  // 'Union Creative',
];

const CollectionsList = ["Accessories", "Adult Apparel", "Bag", "Bandai", "Banpresto", "Toys"];


const typeList = [
  '1000 Toys',
  'Action & Toy Figures',
  'Board Games',
  'Ceramics',
  'Hats',
  'Socks',
  'Wallet',
  'Plush',
  'Super Premium',
  'FuRyu',
  'Q Posket',
];

const exclusives = [
  'AAA Anime Exclusive',
  'AE Exclusive',
  'Amazon Exclusive',
  'Barnes and Nobles Exclusive',
  'BoxLunch Exclusive',
  'Disney Exclusive',
  'Funko Exclusive',
  'Target Exclusive',
  'Hot topic Exclusive',
  'Speciality Series Exclusive',
  'Entertainment Exclusive',
];

const Availability = ['In Stock', 'Pre-Order', 'Sold Out'];

const sort  = ['Featured', 'Name: A - Z', 'Name: Z - A', 'Newest First', 'Oldest First', 'Best Selling', 'Price Low To High', 'Price High to Low'];

const SearchFilter: React.FC<SearchFilterProps> = ({ handleFilterChange }) => {
  const [vendorFilters, setVendorFilters] = useState<string[]>([]);
  const [showVendorFilters, setShowVendorFilters] = useState(false);

  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [showTypeFilters, setShowTypeFilters] = useState(false);
  
  const [ColFilters, setColFilters] = useState<string[]>([]);
  const [showColFilters, setShowColFilters] = useState(false);
  
  const [sortFilters, setsortFilters] = useState<string[]>([]);
  const [showSortFilters, setShowSortFilters] = useState(false);
  
  const [AvFilters, setAvFilters] = useState<string[]>([]);
  const [showAvFilters, setShowAvFilters] = useState(false);
  
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

 
  const toggleAllFilters = () => {
    console.log('toggleAllFilters');
    setShowAllFilters(!showAllFilters);
  };


  const toggleColFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowColFilters(!showColFilters);
    setPopupPosition({ top: event.clientY, left: event.clientX });
  };

  const toggleAvFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowAvFilters(!showAvFilters);
    setPopupPosition({ top: event.clientY, left: event.clientX });
  };

  const toggleVendorFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowVendorFilters(!showVendorFilters);
    setPopupPosition({ top: event.clientY, left: event.clientX });
  };
  const toggleSortFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowSortFilters(!showSortFilters);
    setPopupPosition({ top: event.clientY, left: event.clientX });
  };

  const toggleTypeFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowTypeFilters(!showTypeFilters);
    setPopupPosition({ top: event.clientY, left: event.clientX });
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleVendorChange = (value: string, isChecked: boolean) => {
    const updatedFilters = isChecked
      ? [...vendorFilters, value]
      : vendorFilters.filter((filter) => filter !== value);
    setVendorFilters(updatedFilters);
    handleFilterChange('vendor', value, isChecked, updatedFilters);
  };

  const handlesortChange = (value: string, isChecked: boolean) => {
    const updatedFilters = isChecked
      ? [...sortFilters, value]
      : sortFilters.filter((filter) => filter !== value);
    setsortFilters(updatedFilters);
    handleFilterChange('Sort', value, isChecked, updatedFilters);
  };

  
  const handleTypeChange = (value: string, isChecked: boolean) => {
    const updatedFilters = isChecked
      ? [...typeFilters, value]
      : typeFilters.filter((filter) => filter !== value);
    setTypeFilters(updatedFilters);
    handleFilterChange('type', value, isChecked, updatedFilters);
  };

  const handleColChange = (value: string, isChecked: boolean) => {
    const updatedFilters = isChecked
      ? [...ColFilters, value]
      : ColFilters.filter((filter) => filter !== value);
    setColFilters(updatedFilters);
    handleFilterChange('Collection', value, isChecked, updatedFilters);
  };


  const handleAvChange = (value: string, isChecked: boolean) => {
    const updatedFilters = isChecked
      ? [...AvFilters, value]
      : AvFilters.filter((filter) => filter !== value);
    setAvFilters(updatedFilters);
    handleFilterChange('Availability', value, isChecked, updatedFilters);
  };

  function FilterToggle() {
    const handleClick = () => {
      window.location.href = '#filter-aside';
    };
  
    return (
      <button
        onClick={handleClick}
        style={{
          background: 'black',
          color: 'white',
          padding: '10px 15px',
          cursor: 'pointer',
          borderRadius: '3px',
          border: 'none',
          fontSize: '16px',
        }}
      >
        All Filters
      </button>
    );
  }


  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Sort Filter */}
      <div className="block">
      <button
          className="filter-toggle"
          aria-expanded={showSortFilters}
          onClick={toggleSortFilters}
          style={{ fontWeight: 'bold' }}
        >
          Sort ▼
        </button>
        {showSortFilters && (
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              width: '200px',
              borderRight: '7px solid black', // Border on the left
              borderBottom: '7px solid black', // Border on the bottom
              zIndex: 1000,
            }}
          >

            {sort.map((sorted) => (
              <React.Fragment key={sorted}>
                <label       htmlFor={sorted}
                style={{
                  // display: 'block',
                  fontSize: '12px', // Adjust the font size
                }}
                >
                  <input
                    type="checkbox"
                    id={sorted}
                    value={sorted}
                    checked={sortFilters.includes(sorted)}
                    onChange={(e) =>
                      handlesortChange(e.target.value, e.target.checked)
                    }
                    />
                  {'  ' + sorted}
                    {<br />}
                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>




      {/* Vendor Filter */}
      <div className="block">
      <button
          className="filter-toggle"
          aria-expanded={showSortFilters}
          onClick={toggleVendorFilters}
          style={{ fontWeight: 'bold' }}
        >
          Vendor ▼
        </button>
        {showVendorFilters && (
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              width: '200px',
              borderRight: '7px solid black', // Border on the left
              borderBottom: '7px solid black', // Border on the bottom
              zIndex: 1000,
            }}
          >
            {/* Vendor Dropdown content */}

            {/* Individual vendor checkboxes */}
            {vendorList.map((vendor) => (
              <React.Fragment key={vendor}>
                <label       htmlFor={vendor}
                style={{
                  // display: 'block',
                  fontSize: '12px', // Adjust the font size
                  marginBottom: '1px', // Add spacing between lines
                }}
                >                  <input
                    type="checkbox"
                    id={vendor}
                    value={vendor}
                    checked={vendorFilters.includes(vendor)}
                    onChange={(e) =>
                      handleVendorChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + vendor}
                  {<br />}

                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
  
      {/* Type Filter */}
      <div className="block">
      <button
          className="filter-toggle"
          aria-expanded={showTypeFilters}
          onClick={toggleTypeFilters}
          style={{ fontWeight: 'bold' }}
        >
          Type ▼
        </button>
        {showTypeFilters && (
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              width: '200px',
              borderRight: '7px solid black', // Border on the left
              borderBottom: '7px solid black', // Border on the bottom
              zIndex: 1000,
            }}
          >
            
            {typeList.map((type) => (
              <React.Fragment key={type}>
                <label       htmlFor={type}
                style={{
                  fontSize: '12px', // Adjust the font size
                  marginBottom: '1px', // Add spacing between lines
                }}
                >                  
                <input
                    type="checkbox"
                    id={type}
                    value={type}
                    checked={typeFilters.includes(type)}
                    onChange={(e) =>
                      handleTypeChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + type}
                  {<br />}

                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
            {/* Collection Filter */}
            <div className="block">
      <button
          className="filter-toggle"
          aria-expanded={showColFilters}
          onClick={toggleColFilters}
          style={{ fontWeight: 'bold' }}
        >
          Collection  ▼
        </button>
        {showColFilters && (
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              width: '200px',
              borderRight: '7px solid black', // Border on the left
              borderBottom: '7px solid black', // Border on the bottom
              zIndex: 1000,
            }}
          >

            {CollectionsList.map((col) => (
              <React.Fragment key={col}>
                <label       htmlFor={col}
                style={{
                  fontSize: '12px', 
                  marginBottom: '1px', 
                }}
                >                 
                 <input
                    type="checkbox"
                    id={col}
                    value={col}
                    checked={typeFilters.includes(col)}
                    onChange={(e) =>
                      handleColChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + col}
                  {<br />}

                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

            {/* Availability Filter */}
            <div className="block">
      <button
          className="filter-toggle"
          aria-expanded={showAvFilters}
          onClick={toggleAvFilters}
          style={{ fontWeight: 'bold' }}
        >
          Availability ▼
        </button>
        {showAvFilters && (
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '5px',
              width: '200px',
              borderRight: '7px solid black', // Border on the left
              borderBottom: '7px solid black', // Border on the bottom
              zIndex: 1000,
            }}
          >
            {Availability.map((av) => (
              <React.Fragment key={av}>
                <label       htmlFor={av}
                style={{
                  // display: 'block',
                  fontSize: '12px', // Adjust the font size
                  marginBottom: '1px', // Add spacing between lines
                }}
                >                  <input
                    type="checkbox"
                    id={av}
                    value={av}
                    checked={AvFilters.includes(av)}
                    onChange={(e) =>
                      handleAvChange(e.target.value, e.target.checked)
                    }
                  />
                  {'  ' + av}
                  {<br />}

                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <div>
      <FilterToggle />
    </div>


      

    </div>
  );
};

export default SearchFilter;