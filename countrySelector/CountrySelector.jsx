import { Accordion, Form, Grid, Icon, Input, Menu } from "semantic-ui-react";
import React, { useEffect, useRef, useState } from "react";
import { SELECTED_COUNTRY, SELECTED_INDICATOR } from "../commonConstants";
import DropDownFilter from "./DropDownFilter";

const CountrySelector = ({
                             countries,
                             filters,
                             onApply,
                             selectedCountryFirst,
                             addYear,
                             selectedCountryLabel,
                             countryColumns,
                             intl,
                             isShowSelector,
                             selectedCountryPostLabel,
                             setIsFilterOpen,
                             isAddIndicatorFilter,
                             categoriesWP

                         }) => {
    const indicatorColumns = countryColumns;

    const getSelectedCountry = () => {
        if (filters && filters.get(SELECTED_COUNTRY)) {
            if (countries) {
                const selectedCountry = countries.find(c => c.countryId === filters.get(SELECTED_COUNTRY));
                return `${selectedCountry.country} ${addYear ? ' ' + selectedCountry.year : ''}`;
            }
        }
    }

    const getSelectedCountryGrids = () => {
        const grids = [];
        const divider = isAddIndicatorFilter ? 2 : 1;
        if (isAddIndicatorFilter && categoriesWP) {
            const indicators = categoriesWP.filter(cwp => cwp.parent === 162);
            grids.push(<DropDownFilter
                selectedCountryFirst={selectedCountryFirst}
                filterTitle={'Select Indicator'}
                divider={divider}
                divId={'indicator'}
                columnCount={1}
                options={indicators} filters={filters}
                addYear={false}
                selectedFilter={SELECTED_INDICATOR}
                onApply={onApply}
            />);
        }
        if (isShowSelector && countries) {
            const newCountries = countries.map(c => {
                return {
                    id: c.countryId,
                    name: c.country,
                    year: c.year
                }
            });
            grids.push(<DropDownFilter
                selectedCountryFirst={selectedCountryFirst}
                filterTitle={'Select another country'}
                divider={divider} setIsFilterOpen={setIsFilterOpen}
                divId={'country'}
                columnCount={countryColumns}
                addYear={addYear}
                options={newCountries}
                selectedFilter={SELECTED_COUNTRY}
                onApply={onApply}
            />);
        }
        const selectedColumn = <Grid.Column key={2} width={selectedCountryFirst ? 8 : 6}
                                            className="selected-country">{selectedCountryLabel &&
            <span>{selectedCountryLabel}</span>}{getSelectedCountry()}{selectedCountryPostLabel &&
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
            {getSelectedCountryGrids()}
        </Grid></div>
    );
}

export default CountrySelector;
