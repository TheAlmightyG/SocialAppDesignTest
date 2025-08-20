import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

const Home = () => {

    const {setAuth} = useAuth();

    const onLogout = async () => {
        //setAuth(null);
        const {error} = await supabase.auth.signOut();
        if(error){
            Alert.alert('Sign out', "Error signing out!")
        }

    }
  return (
    <ScreenWrapper>
      <Text>home</Text>
      <Button title= "logout" onPress={onLogout} />
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})