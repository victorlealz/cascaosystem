//MUI Components
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

//AreYouSure MUI Componentes
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//Edit dialog MUI Components
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

//firebase db
import { db } from "../services/firebase-config";
import { collection, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";

//React Hooks
import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";


export default function EditRemoveButton({ id, productType }) {

    //UseForm/begin
    const { control, handleSubmit } = useForm({
        defaultValues: {
            productType: '',
            productPrice: '',
            productSelled: ''
        }
    });
    //UseForm/end

    //select products
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const data = await getDocs(productsRef);
            setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        getProducts()
    }, [])


    //ARE YOU SURE? MUI JSX
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openRemove, setOpenRemove] = React.useState(false);
    
    const handleClickOpenRemove = () => { setOpenRemove(true) };
    const handleClose = () => { setOpenEdit(false); setOpenRemove(false) };
    const handleClickOpenEdit = () => { setOpenEdit(true) };


    //AutoRefresh
    const refreshPage = () => { window.location.reload() };

    //deleting functions
    const productsRef = collection(db, "products")

    const removeFunction = async () => {
        await deleteDoc(doc(db, "products", id));

        handleClose();
        refreshPage();
    }

    //Editing functions

    const onSubmit = async (data) => {
        await updateDoc(doc(db, "products", id), {
            productType: data.productType,
            productPrice: data.productPrice,
            productSelled: data.productSelled
        }
        )
        
            handleClose();
            refreshPage();

    }



    return (

        <>
            <IconButton aria-label="edit" onClick={handleClickOpenEdit} color="primary">
                <ModeEditOutlineOutlinedIcon fontSize="small" id={id} productType={productType} />
            </IconButton>
            <IconButton aria-label="delete" onClick={handleClickOpenRemove} color="error">
                <HighlightOffOutlinedIcon fontSize="small" id={id} productType={productType} />
            </IconButton>


            {/* REMOVE DIALOG COMPONENT */}
            <div>
                <Dialog
                    open={openRemove}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {productType}
                    </DialogTitle>
                    <DialogTitle id="alert-dialog-title">
                        Tem certeza que deseja apagar este item?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Esta ação não poderá ser desfeita!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>NÃO</Button>
                        <Button onClick={removeFunction} autoFocus>SIM</Button>
                    </DialogActions>
                </Dialog>
            </div>




            {/* EDITING DIALOG COMPONENT */}
            <Container>
                <Dialog open={openEdit} align="center" onClose={handleClose}>
                    <form onSubmit={handleSubmit(onSubmit)}>


                        <DialogTitle>Editar Produto</DialogTitle>
                        <h3>{productType}</h3>
                        <p><sup>preencha TODOS os campos</sup></p>
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
                                            rules={{ required: 'Nome necessário!' }}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <>
                                                    <TextField
                                                        type="text"
                                                        label="Nome do Produto"
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
                            <Button type="submit">Cadastrar</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container >

        </>
    );
}