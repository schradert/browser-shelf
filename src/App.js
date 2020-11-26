/*global chrome*/
import React, { useState } from 'react';
import './styles/App.css';
import ItemList from './components/ItemList.js';
import { 
  colors,
  IconButton, 
  MenuItem,
  ListItemText,
  Select,
  Chip,
  FormControl,
  Input,
  SvgIcon
} from '@material-ui/core';
import { 
  MuiThemeProvider,
  createMuiTheme,
  withStyles, 
  makeStyles, 
  useTheme, 
  fade } from '@material-ui/core/styles';
import { 
  FilterList,
  Settings, 
  AddCircle,
} from '@material-ui/icons';
import update from 'immutability-helper';


const LIST = [
  {
    id: 1,
    title: 'Adding Web Interception Abilities to Your Chrome Extension',
    author: 'Gil Fink',
    date: '01-30-2018',
    length: '00:05:00',
    url: 'https://medium.com/@gilfink/adding-web-interception-abilities-to-your-chrome-extension-fb42366df425',
    icon: 'https://medium.com/favicon.ico'
  },
  {
    id: 2,
    title: 'Chrome Extension Tutorial - 23 - Context Menu Functionality',
    author: 'Codevolution',
    date: '09-18-2016',
    length: '00:05:27',
    url: 'https://www.youtube.com/watch?v=DH7QVll30XQ&list=PLC3y8-rFHvwg2-q6Kvw3Tl_4xhxtIaNlY&index=23&t=152s',
    icon: 'https://www.youtube.com/s/desktop/a386e432/img/favicon_32.png'
  },
  {
    id: 3,
    title: 'Project Veritas',
    author: 'unknown',
    date: '11-20-2020',
    length: '00:40:00',
    url: 'https://en.wikipedia.org/wiki/Project_Veritas',
    icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
  },
  {
    id: 4,
    title: 'Select',
    author: 'unknown',
    date: 'today',
    length: '00:05:00',
    url: 'https://material-ui.com/components/selects/#select',
    icon: 'https://material-ui.com/favicon.ico'
  },
  {
    id: 5,
    title: 'gap',
    author: 'Mojtaba Seyedi',
    date: '08-13-2020',
    length: '00:15:00',
    url: 'https://css-tricks.com/almanac/properties/g/gap/',
    icon: 'https://css-tricks.com/favicon.ico'
  }
];

const domainParser = url => {
  return url.match(/([\w-]+)\.(org|com|net)/)[1];
};

const FILTERS = ['url', 'author', 'title', 'length', 'date'];
const initState = {
  results: LIST,
  filtering: false,
  configuring: false,
  integrating: false,
  filters: Object.fromEntries(
    FILTERS.map(f => [f, { sort: 'normal', options: [] }]))
};








/*chrome.tabs.query({active:true, currentWindow:true}, tabs => {
  chrome.tabs.executeScript(tabs[0].id, {
    code: `document.body.style.backgroundColor = "${color}";`
  })
});*/

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const filterClasses = (filter, arr) => {
  const parser = filter === 'url' ? domainParser : x => x;
  const data = arr.map(item => ({ name: parser(item[filter]), icon: item.icon }));
  const uniques = [...new Set(data)];
  const sorted = uniques.sort((a,b) => a.name.localeCompare(b.name));
  return sorted;
};

const ITEM_HEIGHT = 25;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      maxWidth: '100 !important',
      backgroundColor: '#00ACAE'
    }
  }
};

const StyledFilterMenuItem = withStyles(theme => ({
  root: {
    '&:focus': { 
      backgroundColor: theme.palette.primary.main,
    },
    display: 'flex',
    gap: '5%',
    height: ITEM_HEIGHT
  }
}))(MenuItem);

const sortButtonTheme = createMuiTheme({
  palette: {
    primary: {main: colors.blue[500]},
    secondary: {main: colors.red[500]},
    tertiary: {main: colors.green[500]}
  }
});

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: `calc(100% - 2 * ${theme.spacing(1)}px)`,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5%'
  },
  sortButton: {
    top: 5,
    width: '5%',
    borderRadius: '25%',
    border: '1px solid',
    padding: '0 !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterSelect: {
    flex: '0 1 80%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2,
    backgroundColor: '#00ACAE'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1,1,1,0),
    paddingLeft: `calc(1m + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}));


const ButtonArrowIcon = ({ sort }) => {
  if (sort === 'asc') return <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" transform="scale(0.5,1) translate(24,1)"></path>;
  else if (sort === 'desc') return <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" transform="scale(0.5,1) translate(24,1)"></path>;
  return <path d="M13 6.99h3L12 3 8 6.99h3v10.02H8L12 21l4-3.99h-3z" transform="scale(0.75, 1) translate(13,0)"></path>;
};
/*
<div className={classes.search}>
          <div className={classes.searchIcon}>
            <Search />
          </div>
          <InputBase 
            placeholder="Search..."
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ 'aria-label': 'search' }}/>
        </div>

        <Sort />
              <ButtonArrowIcon sort={state.filters[filter].sort} />

const StyledFilterMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})(props => (
  <Menu 
    getContentAnchorEl={null}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    {...props}/>
));
*/

const App = () => {
  const [state, setState] = useState(initState);
  const classes = useStyles();
  const theme = useTheme();
  const onSortClick = filter => _ => {
    let sort;
    switch(state.filters[filter].sort) {
      case 'normal': sort = 'asc'; break;
      case 'asc': sort = 'desc'; break;
      case 'desc': sort = 'normal'; break;
      default: sort = 'normal';
    }
    setState(update(state, { filters: {[filter]: {sort: {$set: sort}}} }));
  };
  const onOptionChange = filter => e => setState(update(state, {
    filters: {[filter]: {options: {$set: e.target.value}}}
  }));
  const onOptionDelete = filter => e => {
    const idx = state.filters[filter].options.indexOf(e.target.value);
    setState(update(state, {
      filters: {[filter]: {options: {$splice: [[idx, 1]]}}}
    }));
  };

  const getListFilters = filters => Object.fromEntries(
    Object.keys(filters)
      .map(key => [key, filters[key].options])
  );
  const getSortSet = filters =>
    Object.keys(filters)
      .map(filter => ({ 
        name: filter, 
        direction: filters[filter].sort 
      }));
  const getSortButtonColor = sort => {
    if (sort === 'asc') return sortButtonTheme.palette.secondary.main;
    else if (sort === 'desc') return sortButtonTheme.palette.tertiary.main;
    return sortButtonTheme.palette.primary.main;
  };
  return (
    <div className="bg">
      <div className="buttonDiv">
        <IconButton
          color={state.filtering ? 'secondary' : 'primary'}
          onClick={() => setState({ ...state, filtering: !state.filtering })}>
          <FilterList />
        </IconButton>
        <IconButton
          onClick={() => setState({ ...state, integrating: !state.integrating })}>
          <AddCircle />
        </IconButton>
        <IconButton
          onClick={() => setState({ ...state, configuring: !state.configuring })}>
          <Settings />
        </IconButton>
      </div>
      {state.filtering && (
      <div className="filterBox">
        {FILTERS.map(filter => (
        <FormControl className={classes.formControl} key={'control' + filter}>
          <p id={`${filter}-filter-label`} style={{margin: 0, top: 5, marginTop: 7, flex: '0 1 10%'}}>{capitalize(filter)}</p>
          <IconButton
            onClick={onSortClick(filter)} 
            className={classes.sortButton}
            style={{
              borderColor: getSortButtonColor(state.filters[filter].sort)
            }}>
            <SvgIcon htmlColor={getSortButtonColor(state.filters[filter].sort)}>
              <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" transform="scale(0.7, 1)"></path>
              <ButtonArrowIcon sort={state.filters[filter].sort}/>
            </SvgIcon>
          </IconButton>
          <Select
            multiple
            labelId={`${filter}-filter-label`}
            id={`${filter}-filter`}
            value={state.filters[filter].options}
            onChange={onOptionChange(filter)}
            input={<Input id={`select-${filter}-filter`}/>}
            className={classes.filterSelect}
            MenuProps={MenuProps}
            renderValue={sel => (
              <div className={classes.chips}>
                {sel.map(val => (
                <Chip
                  key={'chip' + val} 
                  label={capitalize(val)}
                  value={val}
                  icon={<img src={`https://${val}.com/favicon.ico`} alt={val} width={24} height={24} />} 
                  onDelete={onOptionDelete(filter)}
                  onMouseDown={e => e.stopPropagation()} 
                  className={classes.chip} />
                ))}
              </div>
            )}
            >
            {filterClasses(filter, state.results).map((site, i) => (
            <StyledFilterMenuItem key={'select' + site.name + i} value={site.name}>
              <img src={site.icon} alt={site.name} width={16} height={16} />
              <ListItemText primary={capitalize(site.name)} />
            </StyledFilterMenuItem>
            ))}
          </Select>
        </FormControl>
        ))}
      </div>)}
      <ItemList 
        list={state.results} 
        filters={getListFilters(state.filters)} 
        sort={getSortSet(state.filters)} />
    </div>
  );
};

export default App;
