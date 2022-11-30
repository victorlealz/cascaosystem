import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
//AreYouSure MUI Componentes
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//firebase db
import { db } from "../services/firebase-config";
import { collection, doc, getDocs, updateDoc, increment } from "firebase/firestore";
//React Hooks
import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";



export default function SellProductButton({ id, productType }) {


    //UseForm/begin
    const { control, handleSubmit } = useForm({
        defaultValues: {
            productSelled: ''
        }
    });
    //UseForm/end

    //MAP WITH THE FIREBASE INFO/Begin
    const [open, setOpen] = React.useState(false);
    const [products, setProducts] = useState([]);
    const productsRef = collection(db, "products")

    useEffect(() => {
        const getProducts = async () => {
            const data = await getDocs(productsRef);
            setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getProducts()
    }, [])


    const handleClickOpenSell = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };
    const refreshPage = () => { window.location.reload() };

    
    const onSubmit = async (data) => {
        await updateDoc(doc(db, "products", id), {
            productSelled: increment(data.productSelled)
        }
        )
        handleClose();
        refreshPage();
    }

    //TEM UM BUG QUE O SETDOC NA PRIMEIRA VEZ SUBSTITUI E DEPOIS QUE FAZ O UPDATE...

    return (
        <>
            <Container>
                <IconButton
                    sx={{ p: 0, m: 1.5 }}
                    onClick={handleClickOpenSell}
                    aria-label="add"
                    color="success"
                    size="large">
                    <AddShoppingCartIcon id={id} />
                </IconButton>
            </Container>


            <Container>
                <Dialog open={open} align="center" onClose={handleClose}>
                    <form onSubmit={handleSubmit(onSubmit)}>


                        <DialogTitle>Vender Produto</DialogTitle>
                        <h2>{productType}</h2>
                        <DialogContent>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid
                                    sx={{ m: 1, p: 1 }}
                                    container
                                    spacing={{ xs: 2, md: 3 }}
                                    columns={{ xs: 3, sm: 3, md: 3 }}
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="center">

                                    <Grid item xs={2} sm={4} md={4}>
                                        <Controller
                                            name="productSelled"
                                            control={control}
                                            rules={{ required: 'Quantidade necessária!' }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <>
                                                    <TextField
                                                        type="number"
                                                        InputProps={{ inputProps: { min: 1 } }}
                                                        label="Quantidade"
                                                        variant="outlined"
                                                        value={value}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helpertext={error ? error.message : null}
                                                    />
                                                </>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Sair</Button>
                            <Button type="submit" onClick={handleClose}>Vender</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container >
        </>
    );
}