import Item from './Item';
import { firstBy } from 'thenby';
import { 
  ItemListType,
  FiltersType,
  SortersType
} from 'interfaces';
import { domainParser } from '../functions';



const filterList: (list: ItemListType, filters: FiltersType) => ItemListType = 
(list: ItemListType, filters: FiltersType) => {
  return Object.entries(filters).reduce(
    (res, [key, vals]) => {
      if (!vals.length) return res;
      const parser: (str: string) => string = 
        key === 'url' ? domainParser : (x: any) => x;
      return res.filter(item => vals.includes(parser(item[key])));
    },
    list);
};
const sortList: (list: ItemListType, sort: SortersType) => ItemListType = 
(list: ItemListType, sort: SortersType) => {
  if (!sort.length) return list;
  else if (sort.length !== 1) {
    return list.sort(
      firstBy(sort[0].name, {direction: sort[0].direction}));
  }
  const sorters = sort.slice(1).reduce(
    (composition, sorter) => composition.thenBy(sorter.name, {direction: sorter.direction}), 
    firstBy(sort[0].name, {direction: sort[0].direction}));
  return list.sort(sorters);
};

type ItemListProps = {
  list: ItemListType,
  filters: FiltersType,
  sort: SortersType
}

const ItemList: (props: ItemListProps) => JSX.Element = 
({ list, filters, sort }: ItemListProps) => {
  const finalList: ItemListType = sortList(filterList(list, filters), sort) || [];
  return (
    <div className="list">
      {finalList.map(item => (
        <Item key={item.id} item={item}/>
      ))}
    </div>
  );
}
export default ItemList;