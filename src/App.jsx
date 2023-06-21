import './App.scss';
import { useState } from 'react';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const findById = (arr, id) => (
  arr.find(item => item.id === id)
);

const products = productsFromServer.map((product) => {
  const category = findById(categoriesFromServer, product.categoryId);
  const user = findById(usersFromServer, category.ownerId);

  return ({
    ...product,
    category,
    user,
  });
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');

  let currentProducts = products;

  const handleClickUser = (userId) => {
    setSelectedUserId(userId);
  };

  const filteredProductsByUserId = productsToFilter => (
    productsToFilter.filter(product => selectedUserId === product.user.id)
  );

  const changeQueryText = (event) => {
    setQuery(() => event.target.value);
  };

  const getUpperCase = word => word.toUpperCase();

  const filteredProductsByName = productsToFilter => (
    productsToFilter.filter((product) => {
      const queryUpperCase = getUpperCase(query).trim();

      return (
        getUpperCase(product.name).includes(queryUpperCase)
      );
    })
  );

  const getFilteredProducts = () => {
    if (selectedUserId !== 0) {
      currentProducts = filteredProductsByUserId(currentProducts);
    }

    if (query !== '') {
      currentProducts = filteredProductsByName(currentProducts);
    }

    return currentProducts;
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={handleClickUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={classNames({
                    'is-active': selectedUserId === user.id,
                  })}
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={handleClickUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={changeQueryText}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {products.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  key={category.id}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {getFilteredProducts().map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">
                    {product.name}
                  </td>
                  <td data-cy="ProductCategory">
                    {`${product.category.icon} - ${product.category.title}`}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={product.user.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
