import { React, useState } from 'react'
import { Card, CardContent, Typography, Grid, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom'
import { Box } from '@mui/system';
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
  populateCardItems('Manage Categories', 0, 'ManageCategories'),
  populateCardItems('Manage Items', 0, 'ManageItems'),
  populateCardItems('Manage Brands', 0, 'ManageBrands'),
  populateCardItems('Manage Models', 725, 'ManageModels'),
];

function StoreItemsHome() {
  const [isItemExpanded, setIsItemExpanded] = useState(true);

  const handleToggleItem = () => {
    if (isItemExpanded) {
      setIsItemExpanded(false);
    } else {
      setIsItemExpanded(true);
    }
  }

  const arrowBasedOnState = (state) => {
    return state ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />
  }
  const itemView = () => {
    return arrowBasedOnState(isItemExpanded)
  }

  return (
    <div>
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3>Store Admin Homepage</h3>

      <Grid mb={6}>
        <Box mb={2} display='flex' alignItems='center' justifyContent='center' backgroundColor='#5D7B9D' onClick={handleToggleItem} sx={{ transition: '250ms', '&:hover': { backgroundColor: '#092041', cursor: 'pointer' } }}>
          <Typography p={2} variant='h5' color='white'>Hide</Typography>
          <Stack color='white'>{itemView()}</Stack>
        </Box>
        {(isItemExpanded) ? <>
          <Grid container spacing={2}>
            {cardItems.map((card) => (
              <Grid item xs={12} md={6} lg={4} >
                <Card sx={{ boxShadow: '5px 5px 18px #828dad' }}>
                  <CardContent align={'center'} sx={{ padding: '16px !important', }}>
                    <div style={{ borderRadius: '50%', width: '50px', lineHeight: '50px', textAlign: 'center', padding: '10px', background: '-webkit-radial-gradient(bottom right, blue 0%, lightblue 100%)', boxSizing: 'content-box' }}>
                      <div style={{ fontSize: '16px', borderRadius: '50%', width: '50px', lineHeight: '50px', background: 'white' }}>{card.number}</div>
                    </div>
                    <Typography fontSize="18px" mt={2} mb={2}><b>{card.name}</b></Typography>
                    <Grid align={'center'}>
                      <Link to={`/${card.location}`} style={{ textDecoration: 'none' }}>
                        <Button sx={buttonStyles}>View</Button>
                      </Link>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </> : null
        }
      </Grid>
      <br />
    </div >
  )
}

export default StoreItemsHome