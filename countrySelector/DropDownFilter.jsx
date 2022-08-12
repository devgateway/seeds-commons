import { Accordion, Form, Grid, Icon, Input, Menu } from "semantic-ui-react";
import React, { useEffect, useRef, useState } from "react";
import { SELECTED_COUNTRY } from "../commonConstants";
import { WP_CATEGORIES } from "../../embeddable/reducers/StoreConstants";
import { getCrops, getDocuments, getIndicatorsInformation, getWpCategories } from "../../embeddable/reducers/data";
import { connect } from "react-redux";

const DropDownFilter = ({
                            selectedCountryFirst,
                            filterTitle,
                            divider,
                            setIsFilterOpen
                            , divId, columnCount,
                            options, filters, addYear, selectedFilter, onApply,
                            activeIndex, setActiveIndex
                        }) => {
    const ref = useRef(null);
    const [searchKeyword, setSearchKeyword] = useState(undefined);

    useEffect(() => {
        const hoverOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setActiveIndex(-1);
                if (setIsFilterOpen) {
                    setIsFilterOpen(false);
                }
            }
        };
        document.addEventListener('mouseout', hoverOutside, true);
        return () => {
            document.removeEventListener('mouseout', hoverOutside, true);
        };
    }, []);
    const handleSearch = (event, { value }) => {
        setSearchKeyword(value);
    }
    const handleSelected = (event, { value }) => {
        setActiveIndex(undefined);
        setSearchKeyword(undefined);
        if (setIsFilterOpen) {
            setIsFilterOpen(false);
        }
        onApply(selectedFilter, value);
        const customEvent = new CustomEvent('dropDownValueSelected', { detail: { divId } });
        document.dispatchEvent(customEvent);
    }
    const generateOptions = () => {
        return options && options.filter(c => {
            if (searchKeyword) {
                const searchArray = searchKeyword.toLowerCase().trim().split(' ').filter(i => i !== '');
                let ret = true;
                searchArray.forEach(i => {
                    if (!c.name.toLowerCase().includes(i) && (c.year ? !c.year.toString().includes(i) : true)) {
                        ret = false;
                    }
                });
                return ret;
            }
            return true;
        }).map(c => {
            const checked = filters && c.id === filters.get(selectedFilter);
            return <Grid.Column key={c.id}><Form.Radio
                key={c.id}
                checked={checked}
                className={`${checked ? 'checked' : ''}`}
                label={`${c.name}${addYear ? ' ' + c.year : ''}`} name='size' type='radio' value={c.id}
                onClick={handleSelected}
            /></Grid.Column>;
        });
    }
    const FilterForm = (
        <Form>
            <Form.Group grouped>
                <Input key="search_input" type="text" icon='search' iconPosition='left'
                       placeholder="Search..." onChange={handleSearch}
                       value={searchKeyword}
                />
                <Icon.Group>
                    <Icon name='circle outline' />
                    <Icon name='delete' size='tiny' link onClick={() => setSearchKeyword('')} />
                </Icon.Group>
            </Form.Group>
            <Grid columns={columnCount}>
                {generateOptions()}
            </Grid>
        </Form>
    )
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        setActiveIndex(activeIndex === index ? -1 : index);
        if (setIsFilterOpen) {
            setIsFilterOpen(true);
        }
    }
    return (
        <div ref={ref} id={divId}><Grid.Column width={selectedCountryFirst ? 8 / divider : 10} key={1}>
            <Accordion as={Menu} vertical className={!selectedCountryFirst ? 'narrow' : ''}>
                <Menu.Item>
                    <Accordion.Title
                        active={activeIndex === 0}
                        content={filterTitle}
                        icon="angle right"
                        index={0}
                        onClick={handleClick}
                    />
                    <Accordion.Content active={activeIndex === 0} content={FilterForm} />
                </Menu.Item>
            </Accordion>
        </Grid.Column></div>)

}
export default DropDownFilter;