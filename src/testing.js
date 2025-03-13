import React, { useState } from 'react';
import useAPI from './test';

const Testing = () => {
    const { users } = useAPI('https://jsonplaceholder.typicode.com/users');
    console.log("Hi");
}

export default Testing;