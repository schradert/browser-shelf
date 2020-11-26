import Item from './Item.js';
import { firstBy } from 'thenby';

const domainParser = url => {
  return url.match(/([\w-]+)\.(org|com|net)/)[1];
};

const filterList = (list, filters) => {
  return Object.entries(filters).reduce(
    (res, [key, vals]) => {
      if (!vals.length) return res;
      const parser = key === 'url' ? domainParser : x => x;
      return res.filter(item => vals.includes(parser(item[key])));
    },
    list);
};
const sortList = (list, sort) => {
  sort = sort.filter(sorter => sorter.direction !== "normal");
  if (!sort.length) return list;
  else if (!sort.length === 1) return list.sort(firstBy(sort[0].name, {direction: sort[0].direction}));
  const sorters = sort.slice(1).reduce(
    (composition, sorter) => composition.thenBy(sorter.name, {direction: sorter.direction}), 
    firstBy(sort[0].name, {direction: sort[0].direction}));
  return list.sort(sorters);
};

const ItemList = ({ list, filters, sort }) => {
  return (
    <div className="list">
      {(sortList(filterList(list, filters), sort) || []).map(item => (
        <Item key={'item' + item.id} item={item}/>
      ))}
    </div>
  );
}
export default ItemList;