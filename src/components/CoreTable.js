import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import NewProductButton from './NewProductButton';
import EditRemoveButton from './EditRemoveButton';
import SellProductButton from './SellButton';

import { useState, useEffect } from 'react';

//firebase db
import { db } from "../services/firebase-config";
import { collection, getDocs } from '@firebase/firestore';



//MUI BEGIN
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
//MUI END

export default function CoreTable() {

  //MAP WITH THE FIREBASE INFO/Begin
  const [products, setProducts] = useState([]);
  const productsRef = collection(db, "products")



  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    getProducts()
  }, [])




  return (
    <Container maxWidth="sm">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: '100%' }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Produto</StyledTableCell>
              <StyledTableCell align="center">Preço</StyledTableCell>
              <StyledTableCell align="center">Vendidos</StyledTableCell>
              <StyledTableCell align="center">Funções</StyledTableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            {products.map((p) => (
              <StyledTableRow key={p.id}>
                <StyledTableCell align="center" component="th" scope="row">
                  {p.productType}
                  <SellProductButton id={p.id} productType={p.productType} />
                </StyledTableCell>
                <StyledTableCell align="center">R$ {p.productPrice}</StyledTableCell>
                <StyledTableCell align="center">{p.productSelled}</StyledTableCell>
                <StyledTableCell align="center">
                  <EditRemoveButton
                    id={p.id}
                    productType={p.productType}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          width: 150,
          height: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          m: 0
        }}>
        
        <NewProductButton />

      </Box>

    </Container>
  );
}