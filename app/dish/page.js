'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

export default function Recipes() {
  const searchParams = useSearchParams();
  const items = searchParams.get('items')?.split(',') || [];
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`/api/recipes?items=${encodeURIComponent(items.join(','))}`);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchRecipes();
    } else {
      setLoading(false);
    }
  }, []); 

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      bgcolor="#FFF5EC"
    //#FFF5EC
    //#E9B17E
    >
      <Box
        width="100vw"
        height="150px"
        p={4}

        sx={{
          backgroundImage: `url('https://i.pinimg.com/736x/33/ef/8b/33ef8b9c0b902154a6cd4103a21275ef.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
         <Link href="/" passHref>
            <Button variant="contained" sx = {{bgcolor: "#E9B17E"}}>
              Back
            </Button>
          </Link>
        <Typography textAlign='center' color="white" variant="h3" mb={5} fontWeight='bold' gutterBottom>
          Meal Ideas
        </Typography>
      </Box>

      {recipes.length > 0 ? (
        recipes.map((recipe, index) => {
          const parts = recipe.split(/Meal \d+: .+/);
         // const parts = recipe.replaceAll("Enjoy!", "Enjoy!\n").split(/Meal \d+: .+/);
          const titleMatch = recipe.match(/^Meal \d+: .+/)
          const title = titleMatch ? titleMatch[0].replace(/^Meal \d+: /, '') : '';
          return (

            <Box key={index} >
              <Typography
                variant="body1"
                component="div"
                paragraph
                mt={5}
                ml={5}
                color="#E9B17E"
                sx={{ textAlign: "left", fontSize: 20, fontWeight: 'bold' }}
              >
                {title}      
              </Typography>
              <Typography
                mb={5} ml={5}
              >
                {parts}
              </Typography>    
            </Box>
          )
        })
      ) : (
        <Typography
          variant="body1"
          sx={{ flex: 0, minWidth: '50px', textAlign: 'center' }}
        >
          No recipes found.</Typography>
      )}
    </Box>
  );
}


