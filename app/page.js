'use client'

import { useState, useEffect } from 'react'
import { firestore } from '@/firebase';
import { Box, Modal, Stack, TextField, Typography, Button, AppBar, Toolbar} from '@mui/material'
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [lowStock, setLowStock] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity == 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = inventory.filter(({ name }) =>
      name.toLowerCase().includes(query)
    );
    setFilteredInventory(filtered);
  };

  const handleSearchButtonClick = () => {
    setShowSearchBar((prev) => !prev);
  };

  const handleLowStock = () => {
    setLowStock((prev) => !prev);
    setSearchQuery('');
    setShowSearchBar(false);
  };

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    let filtered = inventory.filter(({ name }) =>
      name.toLowerCase().includes(searchQuery)
    );
    if (lowStock) {
      filtered = filtered.filter(({ quantity }) => quantity < 3);
    }
    setFilteredInventory(filtered);
  }, [searchQuery, lowStock, inventory]);


  const handleGetSuggestions = async () => {
    const items = inventory.map(item => item.name);
    setLoading(true);

    try {
      const response = await fetch(`/api/recipes?items=${encodeURIComponent(items.join(','))}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // setRecipes(data);
        router.push(`/dish?items=${encodeURIComponent(items.join(','))}`);
      } else {
        console.error('No recipes found');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: `url('https://img.freepik.com/free-photo/modern-kitchen-interior-design_23-2150772115.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1722643200&semt=ais_hybrid')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      <AppBar position="static" sx={{ backgroundColor: "#E9B17E" }}>
        <Toolbar>
          <Button color="inherit" onClick={() => window.location.href = '/'}>
            Home
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit"
            sx={{ gap: 10 }}
            onClick={handleSearchButtonClick}
          >
            Search Pantry
          </Button>
          <Button color="inherit" onClick={handleGetSuggestions} disabled={loading}>
            {loading ? 'Loading...' : 'Get Recipes'}

          </Button>

        </Toolbar>
      </AppBar>


      {showSearchBar && (
        <TextField
          variant="outlined"
          placeholder="Search Pantry"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 2, width: '400px' }}
        />
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          bgcolor="white"
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h2" color='white' mt="5">
        My Pantry
      </Typography>

      <Box //holds inventory items + title
        overflow="auto"
        width="800px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        spacing={50}
        p={2}
      >
        <Box
          width="100%"
          height="100px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={5}
        >
          <Stack direction="row" spacing={5}>
            <Button variant="contained" sx={{ color: "#333", backgroundColor: "#FFF5EC", '&:hover': { backgroundColor: '#E9B17E' } }}
              onClick={() => {
                handleOpen()
              }}
            >
              Add New Item
            </Button>
            <Button variant="contained" sx={{ color: "#333", backgroundColor: "#FFF5EC", '&:hover': { backgroundColor: '#E9B17E' } }}
              onClick={handleLowStock}
            >
              Low Stock
            </Button>
          </Stack>
        </Box>

        <Stack width="100%" height="500px" spacing={2} >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="50px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding="10px"
              borderRadius="8px"
              boxShadow="0 2px 4px rgba(0,0,0,0.1)"
            >
              <Typography
                variant="h5"
                color="#333"
                sx={{ flex: 1 }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1) + ":"}
              </Typography>
              <Typography
                variant="h5"
                color="#333"
                sx={{ flex: 0, minWidth: '50px', textAlign: 'center' }}
                mr={55}
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    addItem(name)
                  }}
                  sx={{ fontSize: "1rem", lineHeight: 1, backgroundColor: '#FFF5EC', color: '#333', '&:hover': { backgroundColor: '#E9B17E' } }}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    removeItem(name)
                  }}
                  sx={{
                    fontSize: "1rem", lineHeight: 1,
                    backgroundColor: '#FFF5EC', color: '#333', '&:hover': { backgroundColor: '#E9B17E' }
                  }}
                >
                  -
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>

  )
}
