import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const _layout = ()=>{
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  )
}
const MainLayout = () => {
  const {setAuth} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    supabase.auth.onAuthStateChange((_event, session)=> {
      console.log('session user: ', session?.user?.id);

       if(session){
        setAuth(session?.user);
        router.replace('/home');
       } else {
         setAuth(null);
        router.replace('/welcomeScreen');

      } 
    })
  }, [])
  return (
   <Stack
    screenOptions={{
        headerShown: false
    }}
    />
  )
}

export default _layout

