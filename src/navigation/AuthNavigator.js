import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


import WelcomeScr from '../screens/Auth/WelcomeScr';

import LoginScr from '../screens/Auth/LoginScr';

import RegistrScr from '../screens/Auth/RegistrScr';

import ForgotPasswordScr from '../screens/Auth/ForgotPasswordScr';


const Stack = createNativeStackNavigator();


export default function AuthNavigator() {

    return (

        <Stack.Navigator

            initialRouteName="Welcome"

            screenOptions={{

                headerShown: false,

            }}

        >

            <Stack.Screen

                name="Welcome"

                component={WelcomeScr}

            />


            <Stack.Screen

                name="Login"

                component={LoginScr}

            />


            <Stack.Screen

                name="Register"

                component={RegistrScr}

            />


            <Stack.Screen

                name="ForgotPassword"

                component={ForgotPasswordScr}

            />

        </Stack.Navigator>

    );

}