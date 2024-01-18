# TableComponent

The TableComponent is a customizable, sortable, and filterable table component for React, designed for easy integration and use in various React projects.

## Features

- Column sorting
- Search filtering
- Pagination
- Customizable display

## Prerequisites

To use the `TableComponent`, your development environment should have the following prerequisites:

- [Node.js](https://nodejs.org/): The JavaScript runtime environment. Required for installing packages from NPM and running build scripts. Compatible with Node.js version 12 or higher.
- [React](https://reactjs.org/): This component is designed for React applications. Make sure you have React version 17 or higher installed in your project.
- [TypeScript](https://www.typescriptlang.org/): Since the component is written in TypeScript and exports types, TypeScript 4.0 or higher is required for full compatibility.

Ensure these prerequisites are met in your project to seamlessly integrate and utilize the `TableComponent`.

## Installation

To install the component, use npm or yarn:

```bash
npm install react-typescript-table
```

or

```bash
yarn add react-typescript-table
```

## Usage

To use TableComponent in your project, import it and pass your data along with the column configuration. Here's a basic example:

```tsx
import TableComponent from 'react-typescript-table';

const data = [
  // Your data array
];

const columns = [
  { title: 'Column 1', field: 'field1' },
  { title: 'Column 2', field: 'field2' },
  // More columns as needed
];

function MyComponent() {
  return <TableComponent columns={columns} data={data} />;
}
```

The component allows sorting and filtering functionality out of the box.

## Props

The TableComponent accepts the following props:

- `columns`: An array of objects defining the table columns. Each object should have a `title` (display name) and a `field` (key in the data objects). Example object type for a column: `{ title: string; field: string }`.
- `data`: An array of objects representing the rows to display in the table. The type of these objects should match the keys defined in columns. Example data type: `Array<{ [key: string]: any }>`.

## Example Data Type

Here's an example of a TypeScript type for the data used in the TableComponent:

```tsx
type MyDataType = {
  [key: string]: string | number | boolean | Date; // or any other necessary type
};

const data: MyDataType[] = [
  // Your array of data
];
```

## Customization

The appearance and functionality of the TableComponent can be customized through CSS and additional prop settings. Please refer to the provided CSS module for styling options.

## Contributing

Contributions to improve TableComponent are welcome. Please submit issues and pull requests on the repository page.

## License

TableComponent is released under the MIT license. See the LICENSE file for more details.
