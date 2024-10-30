'use client'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Pie, PieChart } from 'recharts'
import { useState } from 'react'
import { format } from 'date-fns'
import './Profile.css'
import Navbar from '../Navbar/page'
import Card from '../components/Card'
import { account } from '../appwrite'
import { fetchDataTable1, fetchDataTable2 } from '../actions/fetchData'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/Components/ui/dropdown-menu'
import { Button } from '@/Components/ui/button'
import Leaderboard from '../components/Leaderboard'


const Profile = () => { 

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [sessionData, setSessionData] = useState([]); 
  const [table1Data, setTable1Data] = useState([]);
  const [table2Data, setTable2Data] = useState([]);
  // const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last month'); 
  const [displayMode, setDisplayMode] = useState('By Mode');

  useEffect(() => {
    const fetchData = async () => {
      try{
        const session = await account.get()
        setSessionData(session)
        const userId = session.$id
        const table1 = await fetchDataTable1(userId)
        const table2 = await fetchDataTable2(userId) 
        setTable1Data(table1)
        setTable2Data(table2)
      }      
      catch(e){
        console.error("Failed to load user data!", e)
        // setError(error.message);
      }
    }
    fetchData();
  },[])  

  const handleCardClick = () => {
    setOverlayVisible(!overlayVisible);
  }; 

  const filteredDataByDateRange = table1Data.filter(item => {
    const itemDate = new Date(item.createdAt);
    const currentDate = new Date();
    if (dateRange === 'last week') {
      const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
      return itemDate >= oneWeekAgo;
    } else if (dateRange === 'last month') {
      const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      return itemDate >= oneMonthAgo;
    } else if (dateRange === 'last year') {
      const oneYearAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
      return itemDate >= oneYearAgo;
    }
    return true;
  });

  const top = table2Data.length > 0 ? table2Data.length - 1 : null;
  
  const carbonFootprintByMode = table1Data.reduce((acc, item) => {
    const mode = item.mode;
    if (!acc[mode]) {
      acc[mode] = 0;
    }
    acc[mode] += item.carbonFootprint;
    return acc;
  }, {});

  const carbonFootprintByFuel = table1Data.reduce((acc, item) => {
    const fuel = item.fuelType;
    if (!acc[fuel]) {
      acc[fuel] = 0;
    }
    acc[fuel] += item.carbonFootprint;
    return acc;
  }, {});

  const barChartDataByFuel = Object.keys(carbonFootprintByFuel).map(fuel => ({
    fuel,
    carbonFootprint: carbonFootprintByFuel[fuel],
  }));

  const barChartData = displayMode === 'By Mode'
  ? Object.keys(carbonFootprintByMode).map(mode => ({
      mode,
      carbonFootprint: carbonFootprintByMode[mode],
    }))
  : Object.keys(carbonFootprintByFuel).map(fuel => ({
      fuel,
      carbonFootprint: carbonFootprintByFuel[fuel],
    }));

  // if (error) return <div className='h-screen w-screen flex items-center justify-center'>Error: {error}</div>;

  return (
    <div className='h-screen w-screen overflow-x-hidden'>
        <Navbar/>
        <div className='profile h-fit max-w-full pt-24'>
          <div className='h-1/7 w-screen flex flex-row items-center justify-center gap-5 px-10'>
            <h1 className='h-20 w-2/5 text-3xl font-[700] rounded-2xl shadow-2 flex flex-row items-center justify-center p-2 bg-white'>{sessionData.name}</h1>
            <Card 
              initial={{}}
              final={{}}
              delay={{}}
              duration={{}}
              scaleOnClick={{}}
              className='h-20 w-4/5 flex-row'
            >
              <div className='h-3/5 w-1/3 flex flex-col items-center justify-center'>
                <h2 className='text-[25px] mb-2'>Total Emission Factor</h2>
                {table2Data.length > 0 && (
                  <p className='text-[10px]'>{table2Data[top].totalEmissionFactor} kg CO<sub>2</sub> / km</p>
                )}
              </div>
              <div className='h-4/5 w-2/3 flex flex-col items-center justify-center'>
                <h2 className='text-[25px] mb-2'>Total Carbon Footprint</h2>
                {table2Data.length > 0 && (
                  <p className='text-[10px]'>{table2Data[top].totalCarbonFootprint} kg CO<sub>2</sub></p>
                )}  
              </div>
              <div className='h-4/5 w-1/3 flex flex-col items-center justify-center'>
                <h2 className='text-[25px] mb-2'>Total Distance</h2>
                {table2Data.length > 0 && (
                  <p className='text-[10px]'>{table2Data[top].totalDistanceTravelled} km</p>
                )}
              </div>
            </Card>
          </div>
          <div className='h-3/7 w-screen flex flex-row items-center justify-center gap-10 px-10 mt-14'>
            <Card
              scaleOnClick
              scale={1.3}
              className='bg-white h-fit w-2/3 flex-col gap-2.5'
              ontoggle={handleCardClick}
            > 
              <div className='w-full flex flex-row items-end justify-between mx-[100px]'>
                <h2 className='ml-8 text-[25px]'>Total carbon Footprint vs {displayMode === 'By Mode' ? 'Mode' : 'Fuel'}</h2> 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>Select</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div onClick={() => setDisplayMode('By Mode')}>
                      <DropdownMenuItem>By Mode</DropdownMenuItem>
                    </div>
                    <div onClick={() => setDisplayMode('By Fuel')}>
                      <DropdownMenuItem>By Fuel</DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ResponsiveContainer width='100%' minHeight={300} className='flex flex-wrap items-center justify-center'>  
                <BarChart data={barChartData} >
                  <CartesianGrid stroke="hsl(var(--muted))" />
                  <XAxis dataKey={displayMode === 'By Mode' ? 'mode' : 'fuel'} stroke="hsl(var(--primary))"/>
                  <YAxis stroke="hsl(var(--primary))"/>
                  <Tooltip />
                  <Bar dataKey='carbonFootprint' fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card
              scaleOnClick
              scale={1.3} 
              transformOrigin='top right'
              className='bg-white h-fit w-1/3 flex-col gap-2.5'
              ontoggle={handleCardClick}
            >
              <div className='w-full flex flex-row items-end justify-between mx-[100px]'>
                <h2 className='ml-8 text-[25px]'>TotalEmissionFactor vs Time</h2> 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>Select</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>last week</DropdownMenuItem>
                    <DropdownMenuItem>last month</DropdownMenuItem>
                    <DropdownMenuItem>last Year</DropdownMenuItem>
                    <DropdownMenuItem>Full History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> 
              <ResponsiveContainer width='100%' minHeight={300} className='flex flex-wrap items-center justify-center'>  
                <LineChart data={table1Data}>
                  <CartesianGrid stroke="hsl(var(--muted))" />
                  <XAxis dataKey='createdAt' stroke="hsl(var(--primary))" tickFormatter={(date) => format(new Date(date), 'dd-MM-yyyy')}/>
                  <YAxis stroke="hsl(var(--primary))"/>
                  <Tooltip />
                  <Line type="monotone" dataKey="emissionFactor" stroke="#8884d8" dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div> 
          <div className='h-3/7 w-screen flex flex-row items-center justify-center gap-10 px-10 mt-14 pb-10'>
            <Card
              scaleOnClick
              scale={1.3}
              transformOrigin='bottom left' 
              className='bg-white h-fit w-1/3 flex-col gap-2.5'
              ontoggle={handleCardClick}
            > 
              <div className='w-full flex flex-row items-end justify-between mr-10'>
                <h2 className='ml-8 text-[25px]'>Total Emission Factor vs mode</h2> 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>Select</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>last week</DropdownMenuItem>
                    <DropdownMenuItem>last month</DropdownMenuItem>
                    <DropdownMenuItem>last Year</DropdownMenuItem>
                    <DropdownMenuItem>Full History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ResponsiveContainer width='100%' minHeight={300} className='flex flex-wrap items-center justify-center'>  
                <PieChart>
                  <Tooltip />
                  <Pie data={table1Data} dataKey='emissionFactor' nameKey='mode' fill="#8884d8"/>
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card
              scaleOnClick
              scale={1.3}
              transformOrigin='bottom right'
              className='bg-white h-fit w-2/3 flex-col gap-2.5'
              ontoggle={handleCardClick}
            > 
              <div className='w-full flex flex-row items-end justify-between mx-[100px]'>
                <h2 className='ml-8 text-[25px]'>Leaderboard</h2> 
              </div>
              <Leaderboard/>
            </Card>
          </div> 
          {overlayVisible && (
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                zIndex: 25, 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.3 }} 
            />
          )}
        </div>
    </div>
  )
}

export default Profile