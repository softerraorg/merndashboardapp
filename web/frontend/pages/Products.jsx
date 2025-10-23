import {Page, Layout, Grid, LegacyCard} from '@shopify/polaris';
import React, {useState, useEffect} from 'react';

function Products() {


    let [data, setData] = useState([]);
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [product, setProduct] = useState({});
    let [isCreating, setIsCreating] = useState(false);
    let [imagePreview, setImagePreview] = useState('');

    // fetch('api/products/all')
    //     .then(response => response.json())
    //     .then(data => {console.log("data", data); setData(data)})
    //     .catch(error => console.error('Error:', error));


    useEffect(() => {
        fetch('api/products/all').then(response => response.json()).then(data => {
            console.log("data", data);
            setData(data.data)
        }).catch(error => console.error('Error:', error));
    }, []);

    let createHandler = async () => {
       setIsCreating(true);
       setProduct({
        title: '',
        body_html: '',
        handle: '',
        variants: [{price: ''}],
        image: null
       })
       setImagePreview('')
       setIsModalOpen(true);
    }
    let deleteHandler = () => {
        console.log("Product Deleted");
    }
    let productHandler = (id) => {
        setIsCreating(false);
    setIsModalOpen(true);
      let searchProduct = data.find(product => product.id === id);
      console.log("searchProduct", searchProduct);
      setProduct(() => ({
        ...searchProduct
      }));  
    }

    let submitHandler = (e) => {
        e.preventDefault();
        if(isCreating) {
            // Create new product
            fetch('/api/product/create', {  // Fixed: removed 's' from products
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(product)
            }).then(response => {
                if(!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            }).then(data => {
                console.log("Product created:", data);
                setIsModalOpen(false);
                setIsCreating(false);
                // Refresh product list
                fetch('api/products/all').then(res => res.json()).then(data => {
                    setData(data.data);
                });
            }).catch(error => {
                console.log('Error creating product:', error.message);
                alert('Error: ' + error.message);
            });
        } else {
            // Update existing product
            fetch('/api/products/update', {
                method: 'PUT', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(product)
            }).then(response => {
                if(!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            }).then(data => {
                console.log("Product updated:", data);
                setIsModalOpen(false);
            }).catch(error => {
                console.log('Error updating product:', error.message);
                alert('Error: ' + error.message);
            });
        }
    }

    let imageHandler = (e) => {
        let file = e.target.files[0];
        if(file) {
            // Create preview URL
            let previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            
            // Convert to base64 for sending to backend
            let reader = new FileReader();
            reader.onloadend = () => {
                setProduct((prev) => ({
                    ...prev,
                    image: {
                        attachment: reader.result.split(',')[1], // Get base64 without data:image prefix
                        filename: file.name
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    let valueHandle = (e) => {
        let {name, value} = e.target; 
        if(name === 'price') {
            setProduct((prev) => ({
                ...prev, 
                variants: [{...prev.variants[0], price: value}]
            }))
        } else {
            setProduct((prev) => ({
                ...prev, 
                [name]: value
            }))
        }
        console.log(setProduct);


    }


    return (
        <Page fullWidth>
            <Layout>

                <Layout.Section></Layout.Section>

                <button onClick={createHandler}
                    className="button">New</button>
                <button onClick={deleteHandler}
                    className="button">Delete</button>
                <Layout.Section>
                    <Grid> {
                        data.map(product => {
                            return (
                                <Grid.Cell key={
                                        product.id
                                    }
                                    columnSpan={
                                        {
                                            xs: 6,
                                            sm: 4,
                                            md: 3,
                                            lg: 3,
                                            xl: 3
                                        }
                                }>
                                    <div className="product-card" onClick={() => {
                                      productHandler(product.id)
                                    }}>

                                        <LegacyCard sectioned>
                                            <img src={
                                                    product ?. image ? product.image.src : ''
                                                }
                                                alt={
                                                    product.title
                                                }
                                                width="100%"
                                                height="100%"
                                                className="product-image"
                                                />
                                            <h2 className="product-title">
                                                {
                                                product.title
                                            }</h2>
                                            <p className="product-price">
                                                {
                                                product.variants[0].price
                                            }</p>
                                            <p>{
                                                product.createdAt
                                            }</p>
                                        </LegacyCard>
                                    </div>

                                </Grid.Cell>
                            )
                        })
                    } </Grid>

                </Layout.Section>
            </Layout>

            {

                isModalOpen && (
                    <div className="product-modal">
                        <button onClick={() => setIsModalOpen(false)} className="btn-close">Close</button>
                        <div className="product-modal-content">
                        <div className="modal-form">

                    <form onSubmit={submitHandler}>
                        <div className="image-block">
                            {isCreating ? (
                                imagePreview ? (
                                    <img className="product-image" width="20%" height="20%" src={imagePreview} alt="Preview" />
                                ) : (
                                    <p>No image selected</p>
                                )
                            ) : (
                                <img className="product-image" width="20%" height="20%" src={product?.image?.src || ''} alt={product?.title || ''} />
                            )}
                        </div>

                        <div className="form-fields">
                            <input type="hidden" name='id' value={product.id || ''} />
                            
                            <label>Title:</label>
                            <input type="text" name="title" placeholder="Product Title" value={product.title || ''} onChange={valueHandle}/>
                            
                            <label>Price:</label>
                            <input type="number" name="price" id="price" placeholder="10.00" value={product.variants?.[0]?.price || ''} onChange={valueHandle}/>
                            
                            <label>Description:</label>
                            <textarea name="body_html" id="body_html" placeholder="Product description" value={product.body_html || ''} onChange={valueHandle}/>
                            
                            <label>Handle (URL slug):</label>
                            <input type="text" name="handle" id="handle" placeholder="product-handle" value={product.handle || ''} onChange={valueHandle}/>
                            
                            {isCreating && (
                                <>
                                    <label>Product Image:</label>
                                    <input type="file" name="image" id="image" accept="image/*" onChange={imageHandler}/>
                                </>
                            )}
                            
                            <input className="button" type="submit" value={isCreating ? "Create" : "Update"} />
                        </div>

                      </form>
                            
                        </div>
                     
                        </div>
                    </div>
                )
            }

        </Page>
    );
}
export default Products;
