import { React, useState, useEffect } from 'react'
import { Card, CardContent, Typography, Grid, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom'
import { Box } from '@mui/system';
import http from './http'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

const buttonStyles = {
  width: '100px',
  backgroundColor: '#5D7B9D',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#092041',
    color: '#fff',
  }
}

function populateCardItems(name, number, location) {
  return { name, number, location };
}

function populateCardLoans(name, number, location) {
  return { name, number, location };
}

const cardItems = [
  populateCardItems('Items reserved for collection', 0, 'ItemsPendingCollection'),
  populateCardItems('Items loaned out', 0, 'ManageItems'),
  populateCardItems('Items due for return', 0, 'ItemsDueForReturn'),
  populateCardItems('Loanable items', 725, 'ManageItems'),
  populateCardItems('Decommissioned items', 0, 'ManageItems'),
];

const cardLoans = [
  populateCardLoans('New loan requests', 1, 'NewIncomingReq'),
  populateCardLoans('Loan requests pending approval', 1, 'ManagePendingReq'),
  populateCardLoans('Approved loan requests', 3, 'ProcessedLoanReq'),
  populateCardLoans('Rejected loan requests', 2, 'ProcessedLoanReq'),
];

function Dashboard() {
  const [isItemExpanded, setIsItemExpanded] = useState(true);
  const [isLoanExpanded, setIsLoanExpanded] = useState(true);

  useEffect(() => {
    http.get('/Login').then((res) => {
      console.log(res.data);
    });
  }, []);

  const handleToggleItem = () => {
    setIsItemExpanded(!isItemExpanded);
  }

  const handleToggleLoan = () => {
    setIsLoanExpanded(!isLoanExpanded);
  }

  const arrowBasedOnState = (state) => {
    return state ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />
  }
  const itemView = () => {
    return arrowBasedOnState(isItemExpanded)
  }

  const loanView = () => {
    return arrowBasedOnState(isLoanExpanded)
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>Asset Management Dashboard</h3>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box mb={2} display='flex' alignItems='center' justifyContent='center' maxHeight="50px" backgroundColor='#5D7B9D' onClick={handleToggleItem} sx={{ transition: '250ms', '&:hover': { backgroundColor: '#092041', cursor: 'pointer', } }}>
            <Typography p={2} variant='h5' color='white'>Items</Typography>
            <Stack color='white'>{itemView()}</Stack>
          </Box>
          {(isItemExpanded) ? <>
            <Grid container spacing={2} >
              {cardItems.map((card) => (
                <Grid item xs={12} md={12}>
                  <Card sx={{ boxShadow: '5px 5px 18px #828dad', height: 'max-content' }}>
                    <CardContent sx={{ padding: '12px !important', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center' }}>
                      <Typography style={{ fontSize: 16 }}><b>{card.name}</b></Typography>
                      <Typography style={{ fontSize: '16px', padding: '0px 20px 0px 20px' }}>{card.number}</Typography>
                      <div style={{ justifySelf: 'end' }}>
                        {card.name === 'Decommissioned items' ?
                          <>
                            <Link
                              to={`/${card.location}?activeItem=${'decommsnd'}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <Button sx={buttonStyles}>View</Button>
                            </Link>
                          </> : card.name === 'Loanable items' ?
                            <>
                              <Link
                                to={`/${card.location}?activeItem=${'loanableY'}`}
                                style={{ textDecoration: 'none' }}
                              >
                                <Button sx={buttonStyles}>View</Button>
                              </Link>
                            </> : card.name === 'Items loaned out' ?
                              <>
                                <Link
                                  to={`/${card.location}?activeItem=${'loanedout'}`}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <Button sx={buttonStyles}>View</Button>
                                </Link>
                              </> :
                              <Link to={`/${card.location}`} style={{ textDecoration: 'none' }}>
                                <Button sx={buttonStyles}>View</Button>
                              </Link>
                        }
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </> : null
          }
        </Grid>

        <Grid item xs={12} md={6}>
          <Box mb={2} display='flex' alignItems='center' justifyContent='center' maxHeight="50px" backgroundColor='#5D7B9D' onClick={handleToggleLoan} sx={{ transition: '250ms', '&:hover': { backgroundColor: '#092041', cursor: 'pointer' } }}>
            <Typography p={2} variant='h5' color='white'>Loans</Typography>
            <Stack color='white'>{loanView()}</Stack>
          </Box>
          {(isLoanExpanded) ? <>
            <Grid container spacing={2} >
              {cardLoans.map((card) => (
                <Grid item xs={12} md={12}>
                  <Card sx={{ boxShadow: '5px 5px 18px #828dad', height: 'max-content' }}>
                    <CardContent sx={{ padding: '12px !important', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center' }}>
                      <Typography style={{ fontSize: 16 }}><b>{card.name}</b></Typography>
                      <Typography style={{ fontSize: '16px', padding: '0px 20px 0px 20px' }}>{card.number}</Typography>
                      <div style={{ justifySelf: 'end' }}>
                        {card.name === 'Approved loan requests' || card.name === 'Rejected loan requests' ? (
                          <Link
                            to={`/${card.location}?activeItem=${card.name === 'Approved loan requests' ? 'approved' : 'rejected'}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Button sx={buttonStyles}>View</Button>
                          </Link>
                        ) : (
                          <Link
                            to={`/${card.location}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <Button sx={buttonStyles}>View</Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </> : null
          }
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default Dashboard