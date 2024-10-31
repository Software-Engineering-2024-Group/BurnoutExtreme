import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  ListSubheader,
  InputAdornment,
  MenuItem
} from '@mui/material'
import axios from 'axios'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import { Container, Typography } from '@mui/material'
import Footer from './Footer'
import headerImage from '../images/meal.webp'

import { useTheme } from './ThemeContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
export default function Meals (props) {
  const { theme } = useTheme();
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [mealName, setMealName] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [ingredientCalories, setIngredientCalories] = useState([])
  const [searchText, setSearchText] = useState('')
  const [foodItems, setFoodItems] = useState({})
  const [meals, setMeals] = useState([])

  const displayedOptions = useMemo(
    () =>
      Object.keys(foodItems).filter(option => containsText(option, searchText)),
    [foodItems, searchText]
  )

  const handleCreateMeal = event => {
    axios({
      method: 'post',
      url: '/createMeal',
      headers: {
        Authorization: 'Bearer ' + props.state.token
      },
      data: {
        mealName: mealName,
        ingredients: ingredients
      }
    })
      .then(response => {
        const res = response.data
        console.log(res)
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }

  const handleCreateCustomFood = event => {
    axios({
      method: 'post',
      url: '/createFood',
      headers: {
        Authorization: 'Bearer ' + props.state.token
      },
      data: {
        foodName: foodName,
        calories: calories
      }
    })
      .then(response => {
        const res = response.data
        console.log(res)
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }

  const handleIngredientSelection = event => {
    const {
      target: { value }
    } = event
    setIngredients(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/foodCalorieMapping',
      headers: {
        Authorization: 'Bearer ' + props.state.token
      }
    })
      .then(response => {
        const res = response.data
        setFoodItems(res)
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })

    axios({
      method: 'GET',
      url: '/myMeals',
      headers: {
        Authorization: 'Bearer ' + props.state.token
      }
    })
      .then(response => {
        const res = response.data
        setMeals(res)
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }, [props.state.token])
  return (
    <div>
      <Container
        maxWidth='lg'
        style={{ textAlign: 'center', marginTop: '20px', width: '60%' }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            backgroundImage: `url(${headerImage})`,
            backgroundSize: '65%', // Cover the entire area
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '70px', // Top padding
            width: '100%',
            height: '300px'
          }}
        >
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='text.primary'
            gutterBottom
          >
            <strong>My Meals</strong>
          </Typography>
        </Box>
      </Container>
      <Container maxWidth>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 2,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"custom-food custom-food custom-food create-meal create-meal create-meal"
                              "meal meal meal meal meal meal"`,
            paddingTop: '2rem'
          }}
        >
          <Card sx={{ gridArea: 'custom-food' }} elevation={5}>
            <CardHeader
              title={'Custom Food'}
              subheader={
                'Enter the food name and calorie information to add it to the list of foods'
              }
              avatar={<FastfoodIcon />}
            />
            <CardContent>
              <form onSubmit={handleCreateCustomFood}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ paddingBottom: '1rem' }}>
                    <FormControl fullWidth>
                      <TextField
                        label='Food Item Name'
                        id='foodName'
                        value={foodName}
                        onChange={event => {
                          setFoodName(event.target.value)
                        }}
                        type='text'
                        required
                      />
                    </FormControl>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TextField
                      label='Calories'
                      id='calories'
                      value={calories}
                      onChange={event => {
                        setCalories(event.target.value)
                      }}
                      type='number'
                      required
                    />
                    <Button
                      type='submit'
                      variant='contained'
                      size='large'
                      style={{ backgroundColor: theme.headerColor, color: 'white' }}
                    >
                      Create Food
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
          <Card sx={{ gridArea: 'create-meal' }} elevation={5}>
            <CardHeader
              title={'Create Meal'}
              subheader={
                'Enter the meal name and select the ingredients to create a meal'
              }
              avatar={<FastfoodIcon />}
            />
            <CardContent>
              <form onSubmit={handleCreateMeal}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ paddingBottom: '1rem' }}>
                    <FormControl fullWidth>
                      <TextField
                        label='Meal Name'
                        id='mealName'
                        value={mealName}
                        onChange={event => {
                          setMealName(event.target.value)
                        }}
                        type='text'
                        required
                      />
                    </FormControl>
                  </Box>
                  <Box sx={{ paddingBottom: '1rem' }}>
                    <FormControl fullWidth>
                      <InputLabel id='ingredients'>Ingredient Name</InputLabel>
                      <Select
                        MenuProps={{ autoFocus: false }}
                        labelId='ingredientName'
                        id='search-select'
                        multiple
                        value={ingredients}
                        label='Ingredient Name'
                        onChange={handleIngredientSelection}
                        required
                      >
                        <ListSubheader>
                          <TextField
                            size='small'
                            // Autofocus on textfield
                            autoFocus
                            placeholder='Type to search...'
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <SearchIcon />
                                </InputAdornment>
                              )
                            }}
                            onChange={e => setSearchText(e.target.value)}
                            onKeyDown={e => {
                              if (e.key !== 'Escape') {
                                // Prevents autoselecting item while typing (default Select behaviour)
                                e.stopPropagation()
                              }
                            }}
                          />
                        </ListSubheader>
                        {displayedOptions.map((option, i) => (
                          <MenuItem key={i} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    style={{ backgroundColor: theme.headerColor, color: 'white' }}
                  >
                    Create Meal
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
          <Card sx={{ gridArea: 'meal' }} elevation={5}>
            <CardHeader
              title={'My Meals'}
              subheader={'Your custom created meals'}
              avatar={
                <>
                  <LunchDiningIcon />
                  <LocalCafeIcon />
                </>
              }
            />
            <CardContent
              sx={{
                display: 'flex',  // Change from 'grid' to 'flex'
    flexDirection: 'column',  // Use column direction
    alignItems: 'center',  // Center align the content
    gap: 2,
                
            
              }}
            >
              {meals.map((meal, index) => {
                console.log(meal.ingredients)
                return (
                  <Card sx={{ gridArea: `meal-${index}` }} elevation={5}>
                    <CardHeader
                      title={'Custom Meal'}
                      avatar={<LunchDiningIcon />}
                    />
                    <CardContent>
                      <div
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          paddingBottom: '5px',
                    
                        }}
                      >
                        {meal.meal_name}
                      </div>
                      <div style={{ textAlign: 'center' }}>Ingredients</div>
                      <div>
                        <List>
                          {meal.ingredients.map((item, index) => {
                            return (
                              <ListItem
                                key={item}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <div>{index + 1}</div>
                                <div>{item}</div>
                              </ListItem>
                            )
                          })}
                        </List>
                        <div style={{ textAlign: 'center' }}>
                          Total Calories
                        </div>
                        <div
                          style={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                          {meal.total_calories}
                        </div>
                      </div>
                      <div>
                        {(() => {
                          const data = meal?.ingredientCalories?.map((calories, index) => ({
                            name: meal?.ingredients[index],
                            calories,
                          })) || [];

                          console.log("data", data);

                          return (
                            <PieChart width={800} height={300}>
                              <Pie
                                data={data}
                                dataKey="calories"  // The key representing calorie count in each object
                                nameKey="name" // The key representing ingredient name in each objec
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                               innerRadius={30}
                                fill="#8884d8"
                                label
                              >
                                {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}