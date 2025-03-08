import React, { useEffect, useState} from 'react';
import axios from 'axios';

const useAPI = (url) => {
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            await axios.get(url)
                    .then((res) => {
                        setUsers(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        }
        fetchUsers();
    }, []);

    return { users }
}

export default useAPI;