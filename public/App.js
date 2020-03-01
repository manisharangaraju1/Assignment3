
var contentNode = document.getElementById('contents');

class ProductRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(url) {
        window.open(url, '_blank');
    }
    render() {
        const linkStyle = { textDecoration: "underline", color: "blue" };
        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                null,
                this.props.product.Name
            ),
            React.createElement(
                'td',
                null,
                '$',
                this.props.product.Price
            ),
            React.createElement(
                'td',
                null,
                this.props.product.Category
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'div',
                    { style: linkStyle, onClick: () => {
                            this.handleOnClick(this.props.product.image);
                        } },
                    ' View '
                ),
                '         '
            )
        );
    }
}

class ProductTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const productRows = this.props.products.map(product => React.createElement(ProductRow, { key: product.id, product: product }));
        return React.createElement(
            'table',
            { className: 'bordered-table' },
            React.createElement(
                'thead',
                null,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Name'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Price'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Category'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Image'
                    )
                )
            ),
            React.createElement(
                'tbody',
                null,
                productRows
            )
        );
    }
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.addProduct;
        this.props.createProduct({
            Name: form.name.value,
            Price: parseFloat(form.price.value.slice(1)),
            Category: form.category.value,
            Image: form.image.value

        });
        form.name.value = "";
        form.category.value = "";
        form.price.value = form.price.defaultValue;
        form.image.value = "";
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'form',
                { name: 'addProduct', onSubmit: this.handleSubmit },
                React.createElement(
                    'table',
                    { className: 'form-table' },
                    React.createElement(
                        'tbody',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                null,
                                'Name',
                                React.createElement('br', null),
                                React.createElement('input', { type: 'text', name: 'name', placeholder: 'Name' })
                            ),
                            React.createElement(
                                'td',
                                null,
                                'Price',
                                React.createElement('br', null),
                                React.createElement('input', { type: 'text', name: 'price', defaultValue: '$' })
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                null,
                                'Category ',
                                React.createElement('br', null),
                                React.createElement(
                                    'select',
                                    { name: 'category' },
                                    React.createElement(
                                        'option',
                                        { value: 'Shirts' },
                                        'Shirts'
                                    ),
                                    React.createElement(
                                        'option',
                                        { value: 'Jeans' },
                                        'Jeans'
                                    ),
                                    React.createElement(
                                        'option',
                                        { value: 'Jackets' },
                                        'Jackets'
                                    ),
                                    React.createElement(
                                        'option',
                                        { value: 'Sweaters' },
                                        'Sweaters'
                                    ),
                                    React.createElement(
                                        'option',
                                        { value: 'Accessories' },
                                        'Accessories'
                                    )
                                )
                            ),
                            React.createElement(
                                'td',
                                null,
                                'Image URL',
                                React.createElement('br', null),
                                React.createElement('input', { type: 'text', name: 'image', placeholder: 'Image' })
                            )
                        )
                    )
                ),
                React.createElement(
                    'button',
                    null,
                    'Add Product'
                )
            )
        );
    }
}

class ProductList extends React.Component {
    constructor() {
        super();
        this.state = { products: [] };
        this.createProduct = this.createProduct.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            productList {
            id Name Category Price Image
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const result = await response.json();
        this.setState({ products: result.data.productList });
    }

    async createProduct(newProduct) {
        const query = `mutation productAdd($newProduct: productInput!) {
            productAdd(product: $newProduct) {
              id
            }
          }`;
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { newProduct } })
        });
        this.loadData();
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h1',
                null,
                'My Company MyInventory'
            ),
            'Showing all available products',
            React.createElement('hr', null),
            React.createElement(ProductTable, { products: this.state.products }),
            React.createElement('hr', null),
            'Add a new product to inventory',
            React.createElement('hr', null),
            React.createElement(ProductAdd, { createProduct: this.createProduct })
        );
    }
}

ReactDOM.render(React.createElement(ProductList, null), contentNode);