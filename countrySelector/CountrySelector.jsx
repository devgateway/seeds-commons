import { Grid } from "semantic-ui-react";
import React, { useEffect, useRef, useState } from "react";
import { SELECTED_COUNTRY, SELECTED_INDICATOR } from "../commonConstants";
import DropDownFilter from "./DropDownFilter";

const INDICATOR_SLUG = 'indicators';
const CountrySelector = ({
                             countries,
                             filters,
                             onApply,
                             selectedCountryFirst,
                             addYear,
                             selectedCountryLabel,
                             countryColumns,
                             isShowSelector,
                             selectedCountryPostLabel,
                             setIsFilterOpen,
                             isAddIndicatorFilter,
                             categoriesWP

                         }) => {
    const [activeCountryIndex, setActiveCountryIndex] = useState([0]);
    const [activeIndicatorIndex, setActiveIndicatorIndex] = useState([0]);
    const refCountry = useRef(null);
    const refIndicator = useRef(null);
    useEffect(() => {

        const dropDownValueSelected = ({ detail }) => {
            const { divId } = detail;
            //if isAddIndicatorFilter then means that only one filter value can be selected at a
            //certain moment
            if (isAddIndicatorFilter && isShowSelector) {
                if (divId === 'country') {
                    setActiveIndicatorIndex(undefined);
                    onApply(SELECTED_INDICATOR, 0);
                } else if (divId === 'indicator') {
                    setActiveCountryIndex(undefined);
                    onApply(SELECTED_COUNTRY, 0);
                }

            }
        };
        const hoverOutside = (event) => {
            if (refCountry && refCountry.current && !refCountry.current.contains(event.target)) {
                setActiveCountryIndex(undefined);
                if (setIsFilterOpen) {
                    setIsFilterOpen(false);
                }
            } else {
                if (refIndicator && refIndicator.current && !refIndicator.current.contains(event.target)) {
                    setActiveIndicatorIndex(undefined);
                }
            }
        }
        document.addEventListener('dropDownValueSelected', dropDownValueSelected, true);
        document.addEventListener('mouseout', hoverOutside, true);
        return () => {
            document.removeEventListener('dropDownValueSelected', dropDownValueSelected, true);
            document.removeEventListener('mouseout', hoverOutside, true);
        };
    }, []);
    const getSelectedOption = () => {
        if (filters && filters.get(SELECTED_COUNTRY) && filters.get(SELECTED_COUNTRY) !== 0) {
            if (countries) {
                const selectedCountry = countries.find(c => c.countryId === filters.get(SELECTED_COUNTRY));
                return `${selectedCountry.country} ${addYear ? ' ' + selectedCountry.year : ''}`;
            }
        } else if (filters && filters.get(SELECTED_INDICATOR) && filters.get(SELECTED_INDICATOR) !== 0) {
            if (categoriesWP) {
                const selectedIndicator = categoriesWP.find(c => c.id === filters.get(SELECTED_INDICATOR));
                return selectedIndicator.name;
            }
        }
    }

    const getSelectedOptionsGrids = () => {
        const grids = [];
        const divider = isAddIndicatorFilter ? 2 : 1;
        if (isAddIndicatorFilter && categoriesWP) {
            const categoryIndicator = categoriesWP.find(c => c.slug === INDICATOR_SLUG);
            const indicatorCategoryId = categoryIndicator ? categoryIndicator.id : -1;
            const indicators = categoriesWP.filter(cwp => cwp.parent === indicatorCategoryId);
            grids.push(<div id={'indicator'} ref={refIndicator}><DropDownFilter
                selectedCountryFirst={selectedCountryFirst}
                filterTitle={'Select Indicator'}
                divider={divider}
                divId={'indicator'}
                columnCount={1}
                options={indicators} filters={filters}
                addYear={false}
                selectedFilter={SELECTED_INDICATOR}
                onApply={onApply}
                activeIndex={activeIndicatorIndex} setActiveIndex={setActiveIndicatorIndex}
            /></div>);
        }
        if (isShowSelector && countries) {
            const newCountries = countries.map(c => {
                return {
                    id: c.countryId,
                    name: c.country,
                    year: c.year
                }
            });
            grids.push(<div id={'country'} ref={refCountry}><DropDownFilter
                selectedCountryFirst={selectedCountryFirst}
                filterTitle={'Select another country'}
                divider={divider} setIsFilterOpen={setIsFilterOpen}
                divId={'country'}
                columnCount={countryColumns}
                addYear={addYear}
                options={newCountries}
                selectedFilter={SELECTED_COUNTRY}
                onApply={onApply}
                activeIndex={activeCountryIndex} setActiveIndex={setActiveCountryIndex}
                filters={filters}
            /></div>);
        }
        const selectedColumn = <Grid.Column key={2} width={selectedCountryFirst ? 8 : 6}
                                            className="selected-country">{selectedCountryLabel &&
            <span>{selectedCountryLabel}</span>}{getSelectedOption()}{selectedCountryPostLabel &&
            <span>{selectedCountryPostLabel}</span>}</Grid.Column>;
        if (selectedCountryFirst) {
            grids.unshift(selectedColumn)
        } else {
            grids.push(selectedColumn)
        }
        return grids;
    }
    return (
        <div><Grid className={"select-country-grid"}>
            {getSelectedOptionsGrids()}
        </Grid></div>
    );
}

export default CountrySelector;
