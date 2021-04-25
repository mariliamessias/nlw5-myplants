import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 

import StackRoutes from './stack.routes';

//Container de navegação
const Routes = () => (
    <NavigationContainer>
        <StackRoutes/>
    </NavigationContainer>
)

export default Routes;