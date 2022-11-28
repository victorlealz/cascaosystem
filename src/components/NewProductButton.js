import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Container from '@mui/material/Container';
//MUI DIALOG
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';
//firebase db
import { db } from "../services/firebase-config";
import { collection, getDocs, addDoc } from '@firebase/firestore';
//React Hooks
import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";







const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



export default function NewProductButton() {

    useEffect(() => {
        const getProducts = async () => {
            const data = await getDocs(productsRef);
            setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getProducts()
    }, [])


    //UseForm/begin
    const { control, handleSubmit } = useForm({
        defaultValues: {
            productType: '',
            productPrice: '',
            productSelled: ''
        }
    });
    //UseForm/end

    //MAP WITH THE FIREBASE INFO/Begin
    const [products, setProducts] = useState([]);
    const productsRef = collection(db, "products")

    //MUI DIALOG/Begin
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //MUI DIALOG/End

    //POST DATA IN FIREBASE/Begin
            //ADD Data inside FIREBASE

            
            //AutoRefresh
            const refreshPage = () => {
                window.location.reload();
              }

            const createProduct = async (data) => {
                await addDoc(productsRef, {
                    productType: data.productType,
                    productPrice: data.productPrice,
                    productSelled: data.productSelled
                });
                refreshPage()
            }

            const onSubmit = (data) => {
                createProduct(data)
            }

            
    //POST DATA IN FIREBASE/End


    return (
        <Container>
            <IconButton
                sx={{ p: 0, m: 0 }}
                onClick={handleClickOpen}
                aria-label="add"
                color="success"
                size="small">
                <AddCircleIcon />
            </IconButton>

            {/* MUI DIALOG */}

            <Dialog open={open} align="center" onClose={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>


                    <DialogTitle>Novo Produto</DialogTitle>
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
                                        name="productType"
                                        control={control}
                                        defaultValue="testing"
                                        rules={{ required: 'Nome necessário!' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <TextField
                                                type="text"
                                                label="Nome do Produto"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helpertext={error ? error.message : null}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={2} sm={4} md={4}>
                                    <Controller
                                        name="productPrice"
                                        control={control}
                                        defaultValue={0}
                                        rules={{ required: 'Preço necessário!' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                label="Preço do Produto (R$)"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helpertext={error ? error.message : null}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={2} sm={4} md={4}>
                                    <Controller
                                        name="productSelled"
                                        control={control}
                                        defaultValue={0}
                                        rules={{ required: 'Vendidos necessário!' }}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                label="Vendidos"
                                                variant="outlined"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helpertext={error ? error.message : null}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Sair</Button>
                        <Button type="submit" onClick={handleClose}>Cadastrar</Button>
                    </DialogActions>
                </form>

            </Dialog>
        </Container >
    );
}