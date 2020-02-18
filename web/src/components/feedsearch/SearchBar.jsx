import React from "react";
import { makeStyles, TextField, Box } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { useHistory } from "react-router";
import { useStore } from "../custom-hooks/custom-hooks";

const useStyles = makeStyles(theme => ({
  searchBarRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100vw",
    maxWidth: "500px"
  },

  tab: {
    backgroundColor: theme.palette.background.default
  }
}));

const SearchBar = props => {
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const classes = useStyles();
  const history = useHistory();
  const { store, onChangeStore } = useStore();
  const handleChange = e => {
    setInputValue(e.target.value);
  };
  const pressEnter = e => {
    if (e.keyCode === 13) {
      if (e.target.value !== undefined && e.target.value !== "") {
        onChangeStore({ ...store, options: options }, "", "");
      } else {
        onChangeStore({ ...store, options: [] }, "", "");
      }
    }
  };
  React.useEffect(() => {
    onChangeStore({ ...store, options: [] }, "", "");
  }, []);
  React.useEffect(() => {
    let active = true;
    if (inputValue === "") {
      setOptions([]);

      return undefined;
    }
    let inputList = inputValue.split(" ");
    setOptions(
      props.data.filter(data => {
        let nameSearch = true;
        let compSearch = true;
        let isNull = false;
        inputList.forEach(el => {
          if (el !== "") isNull = true;
          if (data.f_Name.toLowerCase().indexOf(el.toLowerCase()) === -1)
            nameSearch = false;
          if (
            data.f_Manufacturer.toLowerCase().indexOf(el.toLowerCase()) === -1
          )
            compSearch = false;
        });
        return isNull && (nameSearch || compSearch);
      })
    );
    fetch({ input: inputValue }, results => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Box className={classes.searchBarRoot}>
      <Autocomplete
        id="feed-search"
        style={{ width: "90%" }}
        getOptionLabel={option =>
          typeof option === "string" ? option : option.f_Name
        }
        filterOptions={x => x}
        options={options}
        autoComplete
        includeInputInList
        freeSolo
        disableOpenOnFocus
        onChange={(e, v) => {
          if (typeof v === "object" && v !== null) {
            history.push(`/feedinfo/${v.f_No}`);
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="사료 검색"
            variant="outlined"
            fullWidth
            size="small"
            onChange={handleChange}
            onKeyDown={pressEnter}
          />
        )}
        renderOption={(option, { inputValue }) => {
          const matches = match(
            option.f_Name + " / " + option.f_Manufacturer,
            inputValue
          );
          const parts = parse(
            option.f_Name + " / " + option.f_Manufacturer,
            matches
          );

          return (
            // 자동완성
            <div key={option.f_No}>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    color: part.highlight ? "#00b08b" : "rgb(0,0,0)",
                    fontSize: 14
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          );
        }}
      />
    </Box>
  );
};
export default SearchBar;
