import React, {useEffect} from 'react';
import Routes from './src/routes';
import * as Notifications from 'expo-notifications';

import {
   useFonts,
   Jost_400Regular,
   Jost_600SemiBold 
 } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading'; 
import { PlantProps } from './src/libs/storage';

export default function App() {

  const [ fontsLoaded ] = useFonts({
      Jost_400Regular,
      Jost_600SemiBold
  });

  useEffect(() => {
      //escutar as notificações


    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data)
      }
    );

    return () => subscription.remove();
    // LISTAR TODAS AS NOTIFICAÇÕES
    // async function notifications(){
    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log("NOTIFICAÇÕES AGENDADAS")
    //   console.log(data);
    // }

    // notifications();

    //cancelar as notificações
    // async function notifications(){
    //   await Notifications.cancelAllScheduledNotificationsAsync();
    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    //   console.log("TODAS NOTIFICAÇÕES");
    //   console.log(data);
    // }

    // notifications();

  })

  if(!fontsLoaded)
    return <AppLoading/>

  return (
    <Routes/>
  )
}

