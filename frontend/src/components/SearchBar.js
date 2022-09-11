import { Fragment, useEffect, useState } from "react";
import { styled } from "@mui/system";
import tw, { styled as twinStyled } from "twin.macro";
import { Combobox } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import algoliasearch from "algoliasearch";

import Transition from "./Transition";
import useTimetable from "../hooks/useTimetable";

const client = algoliasearch("M25OTYMRZE", "172d90c7601fc57095c973e7941acd43");
const index = client.initIndex("courses");

const purple = "hsl(287.5, 54.5%, 54%)";

const StyledMessage = styled("div")`
  position: relative;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: #374151;
  cursor: default;
  user-select: none;
`;

const StyledComboboxOptions = styled(Combobox.Options)`
  overflow: auto;
  position: absolute;
  z-index: 10;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  margin-top: 0.25rem;
  background-color: #ffffff;
  font-size: 1rem;
  line-height: 1.5rem;
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  --ring-color: #000000;
  --ring-opacity: 0.05;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const StyledIcon = styled("div")`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  padding-left: 0.75rem;
  align-items: center;
`;

const StyledMagnifyingGlassIcon = styled(MagnifyingGlassIcon)`
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
`;

const StyledChevronUpDownIcon = styled(ChevronUpDownIcon)`
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
`;

const SearchBarContainer = styled("div")`
  text-align: left;
  width: 100%;
`;

const BarContainer = styled("div")`
  overflow: hidden;
  position: relative;
  background-color: #ffffff;
  text-align: left;
  width: 100%;
  border-radius: 0.25rem;
  --ring-color: #ffffff;
  --ring-opacity: 0.75;
  --ring-offset-width: 2px;
  box-shadow: 0 0 0 var(--ring-offset-width) var(--ring-offset-color),
    var(--ring-shadow);
  cursor: default;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const OptionItem = styled("liv")`
  position: relative;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
  padding-left: 2.5rem;
  cursor: default;
  user-select: none;
`;

const OptionName = styled("div")`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CheckContainer = styled("span")`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  padding-left: 0.75rem;
  align-items: center;
`;

const SearchBar = () => {
  const [selected, setSelected] = useState({ objectID: "", companyOffice: "" });
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const timetable = useTimetable();

  useEffect(() => {
    const search = async () => {
      const { hits } = await index.search(query);
      setFiltered(hits);
      console.log(hits);
    };

    search();
  }, [query]);

  useEffect(() => {
    if (!timetable) return;
    timetable[selected.companyOffice] = [];
  }, [selected]);

  return (
    <SearchBarContainer>
      <Combobox value={selected} onChange={setSelected}>
        <div style={{ textAlign: "left", width: "100%" }}>
          <BarContainer>
            <StyledIcon>
              <StyledMagnifyingGlassIcon aria-hidden="true" />
            </StyledIcon>
            <Combobox.Input
              style={{
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                paddingRight: "2.5rem",
                paddingLeft: "2.5rem",
                color: "#111827",
                lineHeight: "1.25rem",
                width: "100%",
                borderStyle: "none",
              }}
              displayValue={(entry) => entry.companyOffice}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button
              style={{
                display: "flex",
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                paddingRight: "0.75rem",
                alignItems: "center",
              }}
            >
              <StyledChevronUpDownIcon aria-hidden="true" />
            </Combobox.Button>
          </BarContainer>
          <Transition
            as={Fragment}
            enter={"transition ease-out duration-150"}
            enterFrom={"opacity-0 translate-y-2"}
            leave={"transition ease-in duration-150"}
            leaveTo={"opacity-0 translate-y-2"}
            afterLeave={() => setQuery("")}
          >
            <StyledComboboxOptions>
              {filtered.length === 0 && query !== "" ? (
                <StyledMessage>Nothing found.</StyledMessage>
              ) : (
                filtered.map((entry) => (
                  <Combobox.Option key={entry.objectID} value={entry}>
                    {({ selected, active }) => (
                      <OptionItem active={active}>
                        <OptionName selected={selected}>
                          {entry.companyOffice}
                        </OptionName>
                        {selected ? (
                          <CheckContainer active={active}>
                            <CheckIcon
                              style={{ width: "1.25rem" }}
                              aria-hidden="true"
                            />
                          </CheckContainer>
                        ) : null}
                      </OptionItem>
                    )}
                  </Combobox.Option>
                ))
              )}
            </StyledComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </SearchBarContainer>
  );
};

export default SearchBar;
