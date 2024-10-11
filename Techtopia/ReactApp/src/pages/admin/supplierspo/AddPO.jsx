import { Stack, Typography, TextField, Checkbox, Button } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SupplierCo = ['A', 'B', 'C', 'D'];
const SalesPerson = ['E', 'F', 'G', 'H', 'I', 'J']
const Brands = ['brand 1', 'brand 2', 'brand 3']
const Categories = ['cat 1', 'cat 2', 'cat 3']
const Models = ['model 1', 'model 2', 'model 3']

const otherButtonStyles = {
  width: '100px',
  backgroundColor: '#636870',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#404347',
    color: '#d2d2d2',
  }
}


function AddPO() {
  const [poNum, setPoNum] = useState('');
  const [poDesc, setPoDesc] = useState('');
  const [poRemarks, setPoRemarks] = useState('');
  const [poDate, setPoDate] = useState('');
  const [activePage, setActivePage] = useState('addPo');
  const [co, setCo] = useState("None");
  const [salesPerson, setSalesPerson] = useState("None");
  const [salesPersonNew, setSalesPersonNew] = useState('');
  const [coAdd, setCoAdd] = useState('');
  const [coPostal, setCoPostal] = useState('');
  const [tele1, setTele1] = useState('');
  const [tele2, setTele2] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [itemSup, setItemSup] = useState('');
  const [remarkSup, setRemarkSup] = useState('');
  const [brand, setBrand] = useState("None");
  const [model, setModel] = useState("None");
  const [Qty, setQty] = useState("");
  const [category, setCategory] = useState("None");
  const [consumable, setConsumable] = useState(false);
  const [itemToAdd, setItemToAdd] = useState([]);

  const handleCo = (event) => { setCo(event.target.value); }
  const handleSP = (event) => { setSalesPerson(event.target.value); }
  const handleBrand = (event) => { setBrand(event.target.value); }
  const handleModel = (event) => { setModel(event.target.value); }
  const handleCategory = (event) => { setCategory(event.target.value); }

  const handlePage = (page) => {
    if (page === '1') {
      setActivePage('addPo');
    } else if (page === '2') {
      setActivePage('addSup');
    } else if (page === '3') {
      setActivePage('addItem');
    } else if (page === '4') {
      setActivePage('confirm');
    } else if (page === '20') {
      setActivePage('newSup');
    }
  }
  console.log(consumable, Qty)

  const handleAddItem = () => {
    const itemAdd = { brand, model, category, Qty, consumable };
    setItemToAdd([...itemToAdd, itemAdd]);
    console.log(itemToAdd)
    setQty("");
    setCategory('None');
    setBrand('None');
    setConsumable(false);
  }

  return (
    <div >
      <h2>NYP-SIT OH2025</h2>
      <hr style={{ border: '1px solid', marginBottom: '30px' }}></hr>
      <h3 mb={2}>Add new PO</h3>
      <Stack mb={6} direction={'row'}>
        <Stack backgroundColor='#5D7B9D' padding={3} >
          <Typography sx={{ color: activePage === 'addPo' ? '#103447' : '#fff' }} mb={1.5} onClick={() => handlePage('1')} component={Link}>Add PO Details</Typography>
          <Typography sx={{ color: activePage === 'addSup' || activePage === 'newSup' ? '#103447' : '#fff' }} mb={1.5} onClick={() => handlePage('2')} component={Link}>Add Supplier</Typography>
          <Typography sx={{ color: activePage === 'addItem' ? '#103447' : '#fff' }} mb={1.5} onClick={() => handlePage('3')} component={Link}>Add Items</Typography>
          <Typography sx={{ color: activePage === 'confirm' ? '#103447' : '#fff' }} onClick={() => handlePage('4')} component={Link}>Confirmation</Typography>
        </Stack>
        <Stack backgroundColor={'#fff'} minHeight={'410px'} minWidth={'550px'} padding={3} pt={0}>
          {(activePage === 'addPo') ?
            <>
              <h3>Add PO</h3>
              <Stack direction={'row'}>
                <Stack mb={2} mr={3} display='flex'>
                  <Typography mb={0.5}>*PO Number : </Typography>
                  <TextField size='small' placeholder='Required' sx={{ minWidth: '240px' }} value={poNum} onChange={(e) => setPoNum(e.target.value)}></TextField>
                </Stack>
                <Stack mb={2} display='flex'>
                  <Typography mb={0.5}>PO Date : </Typography>
                  <DatePicker selected={poDate} onChange={(date) => setPoDate(date)} />
                </Stack>
              </Stack>
              <Stack mb={2} display='flex'>
                <Typography mb={0.5}>PO Description : </Typography>
                <TextField size='small' multiline minRows={4} placeholder='Description' sx={{ minWidth: '240px' }} value={poDesc} onChange={(e) => setPoDesc(e.target.value)}></TextField>
              </Stack>
              <Stack mb={4} display='flex'>
                <Typography mb={0.5}>Remarks : </Typography>
                <TextField size='small' multiline minRows={2} placeholder='Remarks' sx={{ minWidth: '240px' }} value={poRemarks} onChange={(e) => setPoRemarks(e.target.value)}></TextField>
              </Stack>
            </> : (activePage === 'addSup') ?
              <>
                <Stack direction='row'>
                  <h3>Choose existing supplier</h3>
                  <Typography color={'green'} mt={'18.75px'} ml={'auto'} mb={3} onClick={() => handlePage('20')} component={Link}>[<u>add new supplier</u>]</Typography>
                </Stack>
                <Typography mb={0.5}>*Supplier company</Typography>
                <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
                  <Select id="demo-select-small" value={co} onChange={handleCo} >
                    <MenuItem value="None">
                      <div style={{ color: 'grey', opacity: '70%' }}>Select company (required)</div>
                    </MenuItem>
                    {SupplierCo.map((x, index) => (
                      <MenuItem key={index} value={x}>{x}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography mt={3} mb={0.5}>*Supplier sales person</Typography>
                <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
                  <Select id="demo-select-small" value={salesPerson} onChange={handleSP} >
                    <MenuItem value="None">
                      <div style={{ color: 'grey', opacity: '70%' }}>Select salesperson (required)</div>
                    </MenuItem>
                    {SalesPerson.map((x, index) => (
                      <MenuItem key={index} value={x}>{x}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </> : (activePage === 'newSup') ?
                <>
                  <Stack direction={'row'}>
                    <h3>Add new supplier</h3>
                    <Typography color={'green'} mt={'18.75px'} ml={'auto'} mb={3} onClick={() => handlePage('2')} component={Link}>[<u>choose existing supplier</u>]</Typography>
                  </Stack>
                  <Typography mb={0.5}>*Supplier company</Typography>
                  <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
                    <Select id="demo-select-small" value={co} onChange={handleCo} >
                      <MenuItem value="None">
                        <div style={{ color: 'grey', opacity: '70%' }}>Select company</div>
                      </MenuItem>
                      {SupplierCo.map((x, index) => (
                        <MenuItem key={index} value={x}>{x}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Stack mt={2} direction={'row'}>
                    <Stack mb={2} mr={3} display='flex'>
                      <Typography mb={0.5}>Company address : </Typography>
                      <TextField size='small' placeholder='Company address' disabled sx={{ minWidth: '240px' }} value={coAdd} onChange={(e) => setCoAdd(e.target.value)}></TextField>
                    </Stack>
                    <Stack mb={2} mr={3} display='flex'>
                      <Typography mb={0.5}>Company postal code : </Typography>
                      <TextField size='small' placeholder='Company postal code' disabled sx={{ minWidth: '240px' }} value={coPostal} onChange={(e) => setCoPostal(e.target.value)}></TextField>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'}>
                    <Stack mb={2} mr={3} display='flex'>
                      <Typography mb={0.5}>*Sales person : </Typography>
                      <TextField size='small' placeholder='Sales person (required)' sx={{ minWidth: '240px' }} value={salesPersonNew} onChange={(e) => setSalesPersonNew(e.target.value)}></TextField>
                    </Stack>
                    <Stack mb={2} mr={3} display='flex'>
                      <Typography mb={0.5}>Telephone 1 : </Typography>
                      <TextField type='tel' size='small' placeholder='Telephone 1' sx={{ minWidth: '240px' }} value={tele1} onChange={(e) => setTele1(e.target.value)}></TextField>
                    </Stack>
                    <Stack mb={2} mr={3} display='flex'>
                      <Typography mb={0.5}>Telephone 2 : </Typography>
                      <TextField type='tel' size='small' placeholder='Telephone 2' sx={{ minWidth: '240px' }} value={tele2} onChange={(e) => setTele2(e.target.value)}></TextField>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'}>
                    <Stack mb={2} mr={3} display='flex'>
                      <Typography mb={0.5}>Fax : </Typography>
                      <TextField size='small' placeholder='Fax' sx={{ minWidth: '240px' }} value={fax} onChange={(e) => setFax(e.target.value)}></TextField>
                    </Stack>
                    <Stack mb={2} mr={3} display='flex'>
                      <Typography mb={0.5}>Email : </Typography>
                      <TextField type='email' size='small' placeholder='Email' sx={{ minWidth: '240px' }} value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
                    </Stack>
                    <Stack>
                      <Typography mb={0.5}>Designation : </Typography>
                      <TextField size='small' placeholder='Designation' sx={{ minWidth: '240px' }} value={designation} onChange={(e) => setDesignation(e.target.value)}></TextField>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'}>
                    <Stack mb={2} mr={3}>
                      <Typography mb={0.5}>Items supplied : </Typography>
                      <TextField multiline minRows={2} size='small' placeholder='Items supplied' sx={{ minWidth: '320px' }} value={itemSup} onChange={(e) => setItemSup(e.target.value)}></TextField>
                    </Stack>
                    <Stack mb={2} mr={3}>
                      <Typography mb={0.5}>Remarks : </Typography>
                      <TextField multiline minRows={2} size='small' placeholder='Remarks' sx={{ minWidth: '425px' }} value={remarkSup} onChange={(e) => setRemarkSup(e.target.value)}></TextField>
                    </Stack>
                  </Stack>
                </> : (activePage === 'addItem') ?
                  <>
                    <h3>Add PO items</h3>
                    <Stack mb={2} direction="row">
                      <Stack>
                        <Typography mb={0.5}>*Item brand</Typography>
                        <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
                          <Select id="demo-select-small" value={brand} onChange={handleBrand} >
                            <MenuItem value="None">
                              <div style={{ color: 'grey', opacity: '70%' }}>Select brand</div>
                            </MenuItem>
                            {Brands.map((x, index) => (
                              <MenuItem key={index} value={x}>{x}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack>
                        <Typography mb={0.5}>*Item model</Typography>
                        <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
                          <Select id="demo-select-small" value={model} onChange={handleModel} >
                            <MenuItem value="None">
                              <div style={{ color: 'grey', opacity: '70%' }}>Select model</div>
                            </MenuItem>
                            {Models.map((x, index) => (
                              <MenuItem key={index} value={x}>{x}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Stack>
                    <Stack direction="row">
                      <Stack>
                        <Typography mb={0.5}>*Item category</Typography>
                        <FormControl sx={{ minWidth: 240, minHeight: 40, marginRight: '30px' }} size="small">
                          <Select id="demo-select-small" value={category} onChange={handleCategory} >
                            <MenuItem value="None">
                              <div style={{ color: 'grey', opacity: '70%' }}>Select category</div>
                            </MenuItem>
                            {Categories.map((x, index) => (
                              <MenuItem key={index} value={x}>{x}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                      <Stack mb={2} mr={3}>
                        <Typography mb={0.5}>Quantity : </Typography>
                        <TextField type='number' size='small' placeholder='000' sx={{ maxWidth: '77px' }} value={Qty} onChange={(e) => setQty(e.target.value)}></TextField>
                      </Stack>
                    </Stack>
                    <Stack direction='row' alignItems='center' mb={2}>
                      <Typography mr={2} display='flex'>Consumable</Typography>
                      <Checkbox checked={consumable} onChange={(e) => setConsumable(e.target.checked)}></Checkbox>
                    </Stack>
                    <Button mt={'auto'} ml={'auto'} sx={{ ...otherButtonStyles }} onClick={() => { handleAddItem() }}>ADD</Button>
                  </> : (activePage === 'confirm') ?
                    <>
                      <h3>Confirm before proceeding</h3>
                      <Typography fontWeight={'bold'} mb={1}>PO Details</Typography>
                      <Stack mb={2} direction='row' alignItems="flex-start">
                        <Stack mr={4} sx={{ minWidth: '180px' }}>
                          <Typography >PO number</Typography>
                          <Typography >PO date</Typography>
                          <Typography >PO description</Typography>
                          <Typography >Remarks</Typography>
                        </Stack>
                        <Stack>
                          <Typography >:  {poNum}</Typography>
                          <Typography >:  {poDate}</Typography>
                          <Typography >:  {poDesc}</Typography>
                          <Typography >:  {poRemarks}</Typography>
                        </Stack>
                      </Stack>
                      <Typography fontWeight={'bold'} mb={1}>Supplier Details</Typography>
                      <Stack mb={2} direction='row' alignItems="flex-start">
                        <Stack mr={4} sx={{ minWidth: '180px' }}>
                          <Typography >New/existing supplier</Typography>
                          <Typography >Supplier company</Typography>
                          <Typography >Company Address</Typography>
                          <Typography >Company Postal Code</Typography>
                          <Typography >Supplier Sales Person</Typography>
                          <Typography >Supplier Telephone 1</Typography>
                          <Typography >Supplier Telephone 2</Typography>
                          <Typography >Supplier Fax</Typography>
                          <Typography >Supplier Email</Typography>
                          <Typography >Supplier Designation</Typography>
                          <Typography >Supplier Items Supplied</Typography>
                        </Stack>
                        <Stack>
                          <Typography >:  {poNum}</Typography>
                          <Typography >:  {co}</Typography>
                          <Typography >:  {coAdd}</Typography>
                          <Typography >:  {coPostal}</Typography>
                          <Typography >:  {salesPersonNew}</Typography>
                          <Typography >:  {tele1}</Typography>
                          <Typography >:  {tele2}</Typography>
                          <Typography >:  {fax}</Typography>
                          <Typography >:  {email}</Typography>
                          <Typography >:  {designation}</Typography>
                          <Typography >:  {itemSup}</Typography>
                        </Stack>
                      </Stack>

                      <Typography fontWeight={'bold'} mb={1}>PO Items</Typography>
                      {itemToAdd.map((item, index) => (
                        <div key={index}>
                          <p>{`Item ${index + 1}: ${item.brand}, ${item.model}, ${item.category}, Quantity: ${item.Qty}, Consumable: ${item.consumable ? 'Yes' : 'No'}`}</p>
                        </div>
                      ))}
                    </> : null
          }
        </Stack>
      </Stack>
      {itemToAdd.map((item, index) => (
        <div key={index}>
          <p>{`Item ${index + 1}: ${item.brand}, ${item.model}, ${item.category}, Quantity: ${item.Qty}, Consumable: ${item.consumable ? 'Yes' : 'No'}`}</p>
        </div>
      ))}
    </div>
  )
}

export default AddPO