import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'react-native'
import { wp, hp} from '../helpers/common'
import { theme } from '../constants/Theme.js'
import  Button  from '../components/Button.jsx'
import { useRouter } from 'expo-router'

const welcomeScreen = () => {
    const router = useRouter()
  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"/>
        <View style={styles.container}>
            {/* Welcome Image */}
            <Image style={styles.welcomeImage} resizeMode ='contain' source={require('../assets/images/welcome.png')}></Image>

        
        <View style={{gap:20}}>
            <Text style={styles.title}>FitWave</Text>
            <Text style={styles.punchline}>
                Improvement through Community
            </Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
            <Button
                title="Getting Started"
                buttonStyle={{marginHorizonatal: wp(3)}}
                onPress={()=>router.push('signUp')}
            />
            <View style={styles.bottomTextContainer}>
                <Text style={styles.loginText}>
                    Already have an Account!
                </Text>
                <Pressable onPress={()=> router.push('login')}>
                    <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                        Login
                    </Text>
                </Pressable>
            </View>

        </View>
    </View>
      
    </ScreenWrapper>
  )
}

export default welcomeScreen

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4),


    },
    welcomeImage: {
        height: hp(30),
        width: wp(100),
        alignSelf: 'center'
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extrabold,
    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color:theme.colors.text,
    },
    footer: {
        gap: 30,
        width: '100%'

    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,

    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
}
)
