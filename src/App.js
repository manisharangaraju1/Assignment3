
var contentNode = document.getElementById('contents');



class ProductRow extends React.Component{
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
        console.log(this.props.product.name);
    }

    handleOnClick(url) {
        window.open(url, '_blank');
    }
    render() {
        const linkStyle = { textDecoration: "underline", color: "blue"};
        return(
            <tr>
                <td>{this.props.product.Name}</td>
                <td>${this.props.product.Price}</td>
                <td>{this.props.product.Category}</td>
                <td><div style={linkStyle}  onClick={() => {this.handleOnClick(this.props.product.image)}}> View </div>         </td>
            </tr>
    )};
}


class ProductTable extends React.Component{
    constructor(props) {
        super(props);

    }
    render() {
        const productRows = this.props.products.map(product => <ProductRow key={product.id} product={product}/>)
        return(
            <table className="bordered-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Image</th>
                    </tr>
                </thead>
            <tbody>{productRows}</tbody>
            </table>
    );
    }
}

class ProductAdd extends React.Component{
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.addProduct;
        this.props.createProduct({
            name : form.name.value,
            price : form.price.value.slice(1),
            category : form.category.value,
            image : form.image.value,

        });
        form.name.value = "";
        console.log(form.price.defaultValue);
        form.category.value="";
        form.price.value = form.price.defaultValue; 
        form.image.value="";
    }

    render() {
        return(
            <div>
                <form name="addProduct" onSubmit={this.handleSubmit}>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <td>
                                    Name<br/>
                                    <input type="text" name="name" placeholder="Name"/>
                                </td>
                                <td>
                                    Price<br/>
                                    <input type="text" name="price" defaultValue="$"/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Category <br/>
                                    <select name="category"> 
                                        <option value="Shirts">Shirts</option>
                                        <option value="Jeans">Jeans</option>
                                        <option value="Jackets">Jackets</option>
                                        <option value="Sweaters">Sweaters</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </td>
                                <td>
                                    Image URL<br/>
                                    <input type="text" name="image" placeholder="Image"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button>Add Product</button>
                </form>
            </div>
        );
    }
}


class ProductList extends React.Component{
    constructor() {
        super();
        this.state = {products : []};
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
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
            });
            const result = await response.json();
            this.setState({ products: result.data.productList });
    }

    createProduct(newProduct) {
        this.setState({products : newProducts});
    }

    render() {
        return(
            <div>
                <h1>My Company MyInventory</h1>
                Showing all available products
                <hr/>
                <ProductTable products={this.state.products}/>
                <hr/>
                Add a new product to inventory
                <hr/>
                <ProductAdd createProduct={this.createProduct}/>
            </div>
        );
    }
}




ReactDOM.render(<ProductList/>, contentNode);