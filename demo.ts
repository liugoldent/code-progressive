interface Musician {
  artistName: string;
  age: number;
  // 在 interface 中物件必須跟介面的定義一致，多出或少了介面中的屬性都不行
  deceased: boolean;
}
type Data = typeof d3ChartConfig.data;

type Payload = {
  name: string;
  mass: number;
  // the tests show that you need a `mass` property here
  // but first you might need to create an alias for `Kilograms`
  // because that's the value of `mass`
};

type GroceryStore<Name, City> = ({
	name: Name,
	city: City
});

type GroceryItem<
	Name extends string,
	Price extends number,
	InStock extends boolean
> = {
	name: Name,
	price: Price,
	inStock: InStock
};


enum Days {
  Sun,
  Mon,
  Tue
}

console.log(Days['Sun'] === 1)


