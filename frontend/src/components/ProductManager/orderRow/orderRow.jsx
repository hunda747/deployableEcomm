import React, {useState} from 'react';
import './orderRow.css'

import { Box, Collapse, IconButton, 
  Table, TableBody, TableCell, 
  TableContainer, TableHead,
   TableRow, Typography,
    Paper} from '@material-ui/core';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button';
import Label from '@material-ui/core/InputLabel';

import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../../../redux/actions/orderDetailAction';
import { changeOrderStatus } from '../../../redux/actions/orderActions'

import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { addToCart }  from '../../../redux/actions/cartActions';
import { returnProduct } from '../../../redux/actions/productActions';
const steps = ['Processing', 'Shipped', 'Delivered'];


export default function Row(props) {
  const steps = ['Processing', 'Shipped', props?.status === 'cancel' ? 'Canceled' :'Delivered'];
  // const { row } = props;
  const [open, setOpen] = React.useState(false);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    setOpen(!open);
    const id = props.Order_id;
    dispatch(getOrderDetails(props.id)); 
  }

  const orders = useSelector((state) => state.getOrderDetail.orderDetails);
  console.log("this are the props")
  console.log(props)  
  
  const handleCancelOrder = () => {
    console.log(props.id);
    dispatch(changeOrderStatus(props.id, 'cancel'))
    orders.map((order)=> {
      console.log(order.id , order.productQuantity)
        // dispatch to increase the number of count in stock for the item ordered
        dispatch(returnProduct(order.id , order.productQuantity))
      }) 
    window.location.reload(true);
  } 

  const handleReorder = () => {
    orders?.map((order) => {
      dispatch(addToCart(order.id , order.productQuantity));
    })
    navigator('/cart')
  }

  
  console.log(orders)
  console.log('inside row');
  return (
    <React.Fragment>
      <TableRow 
      sx={{ '& > *': { borderBottom: 'unset' } }}
      className={ props.status === 'complete' ? 'comRow' 
      : props.status === 'cancel' ? 'canRow' 
      : props.status === 'pending' ? 'penRow' : 'inProg'}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {props.id}
        </TableCell>

        { props.admin === true ? ( 
            <TableCell align="left">
              {props.date}</TableCell>)
          : (
            <>
            {props?.role === 'user'? 
                ''
            : 
              <>
                <TableCell align="right">{props.fname}</TableCell>
                <TableCell align="right">{props.lname}</TableCell>
                
              </>
            }
          </>)
        }
        

        <TableCell align="center">{props.total} Birr</TableCell>
        
        { props.status === 'pending' ? (
          <TableCell align="center">
            <Button  onClick={handleCancelOrder} style={{border: '1px solid black'}}>Cancel</Button>
          </TableCell>
        ): props.status === 'inProgress' ? (
            <TableCell align="right">
              <Label className='btn'>In progress</Label>
            </TableCell>
        ): props.status === 'complete' ? (
            <TableCell align="right">
              <Label className='btn'>Complete</Label>
        </TableCell>
        ) : props.status === 'cancel' ? (
            <TableCell align="right">
              <Label className='btn'>Canceled</Label>
        </TableCell>) : ''
        }
      </TableRow>

      <TableRow>
        <TableCell 
        style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>

              <div className='ordersInfo'>
                <Typography variant="h6" gutterBottom component="div">
                  Detail
                </Typography>

                <div className="topInfo">
                  <table border="0" cellPadding="10" size="20px">
                    <tr>
                      <td>Order number: </td>
                      <td>{props.id}</td>
                    </tr>
                    <tr>
                      <td>Order placed: </td>
                      <td>{props.date}</td>
                    </tr>
                    <tr>
                      <td>Status: </td>
                      <td>{props.status === "pending" ? <p>Processing</p> : props.status === "inProgress" ?<p>In Progress</p> : <p>Completed</p> }</td>
                    </tr>
                    <tr>
                      <td>Order placed by: </td>
                      <td>{props.fname} {props.lname}</td>
                    </tr>
                  </table>
                </div>

                <div className="middleInfo">
                  <div className='infoItem'>
                    <p>Status</p>
                    <Box sx={{ width: '200%'}}>
                      <Stepper activeStep={props.status === "pending" ? 0 : props.status === "inProgress" ? 1 : 2 } alternativeLabel>
                        {steps.map((label) => (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </div>
                  <div className='infoItem'>
                    <p>Shiping Address</p>
                    <h2>{props.address}</h2>
                  </div>
                  <div className='infoItem'>
                    <p>Payment Info</p>
                    <h2>Cash on delivey</h2>
                  </div>
                </div>

                <div className='itemsInfo'>
                  <p>Items</p>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="right">Catagory</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Reorder</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell component="th" scope="row">
                            {order.productName}
                          </TableCell>
                          <TableCell>{order.productPrice} Birr</TableCell>
                          <TableCell align="right">{order.productCategory}</TableCell>
                          <TableCell align="right">
                            {order.productQuantity}
                          </TableCell>
                          <TableCell align="right">
                            <Button className='btn' onClick={(e) => {
                              navigator('/productDetails/' + (order.id))
                            }} style={{border: '1px solid black'}}>View Product</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <p className='totalInfo'>Total:     {props.total} Birr</p>

                {props?.admin?
                  ""
                : 
                  <Button className='btn' onClick={handleReorder} style={{border: '1px solid black', justifyItems: 'right '}}>Reorder Items</Button>
                }
                </div>
              </div>
              {/* {orders.map((order) => ( 
              <div className='cartItem'>
                <div className="cartItemHolder">
                  <div className='cartItem_img'>
                    <Link to={`/productDetails/${order.product}`}>
                      <img src={order.imageUrl}  alt={order.productName} />
                    </Link>
                  </div>

                  <p className='cartItem_brand'>{order.brand}</p>

                  <Link to={`/productDetails/${order.product}`}>
                    <p className='cartItem_name'>{order.productName}</p>            
                  </Link>
                  
                  <p className='cartItem_price'>${order.productPrice}</p>

                  <p className='cartItem_price'>${order.productQuantity}</p>

                  </div>
                </div>

               ))} */}


            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
