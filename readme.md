# Not tested in production yet, will be tested today IA.
# Fiction Expo Social Auth

Fiction Expo Social Auth is a social media authentication helper developed by Fiction Developers. For more information, visit [fictiondevelopers.com/auth-system](https://fictiondevelopers.com/auth-system).

We know the hurdle you have to go through to just manage the social media logins for your react-native/expo apps. You have to setup so many so many credentials on your developer account, later it's almost impossible to move it to client's accounts or to remember which project/account you used for configuration, and I know google doesn't allow that many projects to create. So just use this package get your job done under 5 minutes!


** Note: we don't keep user's data at all, everything is sent to your app and erased from our sessions instantly, so you don't have to worry about your privacy **

## Check our Roadmap

- [✅] Google (Achieved)
- [ ] Facebook (Under Development)
- [ ] Apple (Planned)
- [✅] GitHub (Acheived) - almost, sometimes displayName & email will be made out of user's username
- [✅] LinkedIn (Acheived) - watchout for "id" please, I'm returning it, but not positive if that's the id
- [ ] Twitter (Planned)
- [ ] Others (Planned)


## Installation

To use Fiction Expo Social Auth in your project, follow these steps:

1. Install the package by running the following command:
    ```bash
    npm install fiction-expo-social-auth
    ```

2. Import `fictionLogin` in your code:
    ```javascript
    import {fictionLogin} from 'fiction-expo-social-auth';
    ```

3. Use `fictionLogin` component in your code:
    ```javascript
    const startLogin = async ()=>{

        let result = await fictionLogin("google");
    }
    ```


4. Control the option of `fictionLogin` with the following options:
    - `google`: google login
    - `facebook`: under development
    - `apple`: under development
    - `github`: under development


# Example:
```
import { Button, StyleSheet, Text, View } from 'react-native';
import { fictionLogin } from 'fiction-expo-social-auth'
export default function App() {

  const doLogin=async()=>{
    let result = await fictionLogin("google"); // control the social media type here
    console.log(result); // do whatever with result
  }
  return (
    <View style={styles.container}>
      <Button title="Login" onPress={doLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

```

For more information and usage examples, refer to the [documentation](https://fictiondevelopers.com/auth-system).



Ping me if you have any problems at:
whatsapp: +923009550284
email: csgenius786@gmail.com

Buy me coffee?

BuyMeCoffee Wallet
```
https://www.buymeacoffee.com/rndeveloper
```