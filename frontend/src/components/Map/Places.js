import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export default function Places({ setOffice }) {
  const {
    // is the script ready to use
    ready,
    // what the users enter into the input box
    value,
    // changes the above value
    setValue,
    // status: have suggestions been received, data: suggestions
    suggestions: { status, data },
    // can remove suggestions shown
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val) => {
    setValue(val, false);
    // stop showing list of suggestions since user has already shown
    clearSuggestions();

    // converts address into geocode
    console.log(val)
    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    // set office to our latitude and longitude
    setOffice({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      {/* User types into this box */}
      <ComboboxInput
        value={value}
        // listen to changes
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search office address"
      />
      <ComboboxPopover>
        {/* List of suggestions */}
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}