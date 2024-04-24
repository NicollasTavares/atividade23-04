import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect, useState, useRef } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    }
  }),
});

export default function App() {
  const [expoToken, setExpoToken] = useState('');

  const notificationReceivedRef = useRef();

  const notificationResponseRef = useRef();

  useEffect(() => {
    registerForPushNotificationsAsynd().then(token => setExpoToken(token));

    notificationReceivedRef.current = Notifications.
      addNotificationReceivedListener(notification => {
        console.log('Notificação recebida:', notification);
      });
    notificationResponseRef.current = Notifications.
      addNotificationResponseReceivedListener(notification => {
        console.log('Notificação clicada: ', notification);
      });

      const todasNotificacoes [notification]
  }, []);


  async function handleNotificationLocal() {
    // console.log(expoToken);
    schedulePushNotification();
  };


  return (
    <View style={styles.container}>
      <Text>Trabalhando com Notificações no Expo</Text>
      <Button
        title='Enviar notificação local'
        onPress={async () => {
          await handleNotificationLocal();
        }}
      />
       <Button
        title='Visualizar todas as notificações'
        onPress={async () => {
          await handleNotificationLocal();
        }}
      />
      <Text>{expoToken}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Notificação local",
      body: "Este e um teste de notificação local acionado imediatamente após o clique do botão",
    },

    // trigger: null,
    trigger: { seconds: 5 },

  });
}

async function registerForPushNotificationsAsynd() {
  let meuId = "f1472409-d37a-47c7-b003-a9279adae6a1";
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Você não possui permissão para receber notificações!');
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync({ projectId: meuId })).data;
  console.log(token);
  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
