import { Fragment, useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
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

const BarContainer = tw.div`
  relative w-full
  rounded bg-white text-left shadow-md
  cursor-default overflow-hidden
  focus:outline-none
  focus-visible:(ring-2 ring-white ring-opacity-75 ring-offset-2 ring-offset-pink-300)
`;

const OptionItem = styled.li({
  ...tw`relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900`,

  variants: {
    active: {
      true: tw`bg-[${purple}] text-white`,
      false: tw`text-gray-900`,
    },
  },
});

const OptionName = styled.div({
  ...tw`block truncate`,

  variants: {
    selected: {
      true: tw`font-medium`,
      false: tw`font-normal`,
    },
  },
});

const CheckContainer = styled.span({
  ...tw`absolute inset-y-0 left-0 flex items-center pl-3`,

  variants: {
    active: {
      true: tw`text-white`,
      false: tw`text-[${purple}]`,
    },
  },
});

type Entry = {
  objectID: string,
  course_code: string,
};

const SearchBar = () => {
  const [selected, setSelected] = useState({ objectID: "", course_code: "" });
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
    timetable[selected.course_code] = [];
  }, [selected]);

  return (
    <div tw="w-full text-left">
      <Combobox value={selected} onChange={setSelected}>
        <div tw="relative mt-1">
          <BarContainer>
            <div tw="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                tw="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <Combobox.Input
              tw="w-full border-none py-3 pl-10 pr-10 leading-5 text-gray-900 focus:ring-0"
              displayValue={(entry: Entry) => entry.course_code}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button tw="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon
                tw="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </BarContainer>
          <Transition
            as={Fragment}
            enter={tw`transition ease-out duration-150`}
            enterFrom={tw`opacity-0 translate-y-2`}
            leave={tw`transition ease-in duration-150`}
            leaveTo={tw`opacity-0 translate-y-2`}
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options tw="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filtered.length === 0 && query !== "" ? (
                <div tw="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filtered.map((entry) => (
                  <Combobox.Option key={entry.objectID} value={entry}>
                    {({ selected, active }) => (
                      <OptionItem active={active}>
                        <OptionName selected={selected}>
                          {entry.course_code}
                        </OptionName>
                        {selected ? (
                          <CheckContainer active={active}>
                            <CheckIcon tw="h-5 w-5" aria-hidden="true" />
                          </CheckContainer>
                        ) : null}
                      </OptionItem>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchBar;
